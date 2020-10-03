const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

var db;
var app = express();
let middleware = require("./middleware.js");
let server = require('./server.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect('mongodb://127.0.0.1:27017', { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db('HospitalDB');
    console.log("Connected to HospitalDB!");
});


//Home Page //Tested and Working 
app.get('/', middleware.checkToken, (req, res) => {
    res.send(`<h1>Welcome to Hospital API</h1>
            <h1>Authentication Successful</h1>`);
});

//Search by Status //Tested and Working
app.post('/searchByStatus', middleware.checkToken, (req, res) => {
    console.log(req.body.status);
    db.collection('ventilators')
        .find({ 'status': req.body.status }).toArray()
        .then(result => res.json(result));

});

//Search by HospitalName //Tested and Working
app.post('/searchByName', middleware.checkToken, (req, res) => {
    console.log(req.body.name);
    db.collection('ventilators')
        .find({ 'name': new RegExp(req.body.name, 'i') }).toArray()
        .then(result => res.json(result));

});

//Delete by VentilatorID //Tested and Working
app.post('/deleteByVentilatorID', middleware.checkToken, (req, res) => {
    db.collection('ventilators').deleteOne({ 'ventilatorId': new RegExp(req.body.ventilatorId, 'i') })
    console.log(`${req.body.ventilatorId} removed`);
    res.send(`${req.body.ventilatorId} removed`);
});

//Fetching Hospital Details //Tested and Working
app.get('/hospitalDetails', middleware.checkToken, function(req, res) {
    console.log("All Hospital Details");
    db.collection('hospital').find().toArray()
        .then(result => res.json(result));

});

//Fetching Ventilator Details //Tested and Working
app.get('/ventilatorDetails', middleware.checkToken, function(req, res) {
    console.log("Ventilator Details");
    db.collection('ventilators').find().toArray()
        .then(result => res.json(result));
});

//Add Ventilator //Tested and Working
app.put('/addVentilator', middleware.checkToken, (req, res) => {
    db.collection('ventilators').insertOne({
        "hId": req.body.hId,
        "ventilatorId": req.body.ventilatorId,
        "status": req.body.status,
        "name": req.body.name
    }, (err, res_) => {
        res.json("Item Added Succesfully");
        console.log("Item Added Succesfully");
    })
});

//Update Ventilator Details //Tested and Working
app.put('/updateVentilatorStatus', middleware.checkToken, (req, res) => {
    db.collection('ventilators').updateOne({ 'ventilatorId': req.body.ventilatorId }, { $set: { 'status': req.body.status } }, (err, res_) => {
        res.json('Succesfully Updated');
    });
});

//Server
app.listen(3000, function() {
    console.log(`App listening at port 3000`);
});