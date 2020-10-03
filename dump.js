const express = require("express");
const app = express();

//let server=require('./server');
//let middleware=require('./middleware');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'hospital';
let db
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db(dbName);
    console.log('connected mongo:{url}');
    console.log('data base:${dbname}');
})

// //fetching hospital details
// app.get('/hospdetails', function(req, res) {
//     console.log("hospital  details");
//     var answer = db.collection('hp').find().toArray()
//         .then(result => res.json(result));

// });
// //fetching ventilator details
// app.get('/ventdetails', function(req, res) {
//     console.log("ventilator details");
//     var answer = db.collection('ventilators').find().toArray()
//         .then(result => res.json(result));
// });

//search ventilators by status
// app.post('/ventdetailsbystatus', (req, res) => {
//     var status1 = req.body.status;
//     //console.log(status);
//     var ventdetails = db.collection('ventilators')
//         .find({ "status": status1 }).toArray().then(result => res.json(result));
// });

//
app.post('/Vst', (req, res) => {
    var vs = req.body.vs;
    var ventilatorstatus = db.collection("ventilators").find({ "status": vs }).toArray().then(result => res.json(result));
});


//search ventilators by hospname
app.post('/ventdetailsbyhosp', (req, res) => {
    var name = req.body.name;
    console.log(name);
    var vendetails = db.collection('ventilators')
        .find({ "name": name }).toArray().then(result => res.json(result));
});
//SEARCH HOSPITAL BY NAME
app.post('/hospbyname', (req, res) => {
    var name1 = req.body.name;
    console.log(name1);
    var hospdetails = db.collection('hp')
        .find({ "name": name1 }).toArray().then(result => res.json(result));
});
//update ventilator details
app.put('/update', (req, res) => {
    var ventid1 = { ventid: req.body.ventid };
    var nv = { $set: { status: req.body.status } };
    db.collection("ventilators").updateOne(ventid1, nv, function(err, result) {
        res.json("1 updated");
        if (err) throw err;
    });
});

//add ventilator
app.post('/add', (req, res) => {
    var hid = req.body.hid;
    var ventid = req.body.ventid;
    var status = req.body.status;
    var name = req.body.name;
    var item = {
        hid: hid,
        ventid: ventid,
        status: status,
        name: name
    }
    db.collection('ventilators').insertOne(item, function(err, result) {
        res.json('item inserted');
    });
});
//delete ventilatoe by ventid
app.delete('/del', (req, res) => {
    var ventid1 = req.query.ventid;
    console.log(ventid1);
    var myq = { ventid: ventid1 };
    db.collection('ventilators').deleteOne(myq, function(err, obj) {
        if (err) throw err;
        res.json('1 deleted');
    });
});
app.listen(8000);