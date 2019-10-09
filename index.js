const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const miceData = require('./data/mice.json');
var cors = require('cors');
const db = require('./db');

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.get('/getData', (req, res) =>{
    db.query('SELECT * FROM data').then(results => {
        res.json(results)
    })
    .catch(() => {
        res.sendStatus(500);
    })  
});
app.post('/addData', (req, res) =>{
//  отправлять промисы после выполнения лупы
    let data = req.body;
    Promise.all( [
    data.forEach(element => {
         db.query('INSERT INTO data (name, description, company, price, currency, ship, image) VALUES (?,?,?,?,?,?,?)', [element.name, element.description, element.company, element.price, element.currency, element.ship, element.image])
    })]
    ).then((response) => {
        res.send('succesfull');
    })
    .catch((err) => {
        console.log(err);
        // res.send(err);
    })          
});
app.patch('/changeData', (req, res) =>{
    //  отправлять промисы после выполнения лупы
        let data = req.body;
        Promise.all( [
        data.forEach(element => {
             db.query('UPDATE data SET name = (?), description = (?) , company = (?), price = (?), currency = (?), ship = (?), image = (?) WHERE data.id =(?)', [element.name, element.description, element.company, element.price, element.currency, element.ship, element.image, element.id])
        })]
        ).then((response) => {
            res.send('succesfull');
        })
        .catch((err) => {
            console.log(err);
            // res.send(err);
        })          
    });
// Do not accept "delete" request
app.patch('/deleteData', (req, res) =>{
        //  отправлять промисы после выполнения лупы
            let data = req.body;
            // console.log(data);
            Promise.all( [
            data.forEach(element => {
                 db.query('DELETE FROM `data` WHERE `data`.`id` = (?)', [element.id])
            })]
            ).then((response) => {
                res.send('succesfull');
            })
            .catch((err) => {
                console.log(err);
                // res.send(err);
            })          
        });
// DB init 
Promise.all(    
    [
        db.query("CREATE TABLE IF NOT EXISTS data(`id` INT NOT NULL AUTO_INCREMENT , `name` TEXT NOT NULL , `description` TEXT NOT NULL , `company` TEXT NOT NULL , `price` INT NOT NULL , `currency` TEXT NOT NULL , `ship` TEXT NOT NULL , `image` TEXT NOT NULL , PRIMARY KEY (`id`)        )")
        // Add more table create statements if you need more tables
    ]
).then(() => {
    console.log('database initialized');
    app.listen(port, () => {
        console.log(`Example API listening on http://localhost:${port}\n`);
        console.log('Available API endpoints');
        console.log('  /hello [GET, POST, PUT, DELETE]');
        console.log('  /hello/{param1}/world/{param2} [GET]');
        console.log('  /world [GET, POST, PUT, DELETE]');
        console.log('\n  /dogs [GET, POST]');
        console.log('  /dogs/{dogId} [GET, DELETE]');
        console.log('\n  /apikey/new/{username} [GET]');
        console.log('  /apikey/protected} [GET]');
        console.log('\n\n Use for example curl or Postman tools to send HTTP requests to the endpoints');
    });
});