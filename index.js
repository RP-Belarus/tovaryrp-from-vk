const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');
require('dotenv').config();   //  Чтобы получить данные из файла .env
//console.log(process.env);

const sellerRoutes = require('./api/routes/sellers');

const app = express();
const port = process.env.PORT || 3000;

const mongo_user = process.env.MONGO_USER;
const mongo_pass = process.env.MONGO_PASS;
const mongo_url = `mongodb+srv://${mongo_user}:${mongo_pass}@cluster0.tefog.mongodb.net/tovaryFromVk`;
const mongoClient = new MongoClient(mongo_url, { useNewUrlParser: true , useUnifiedTopology: true});

async function start() {
    try {
        // Подключаемся к mongoose
        // await mongoose.connect(mongo_url, {
        //     useNewUrlParser: true,
        //     useFindAndModify: false
        // });

        mongoClient.connect(err => {
            const collection = mongoClient.db("tovaryrp").collection("localities");
            // perform actions on the collection object
            collection.find().toArray( (err,results) => {
                console.log(results);
                mongoClient.close();
            });
        });


        // Запускаем express
        console.log("URL: " + mongo_url);
        app.listen(port, () => {
            console.log(`Starting server at ${port} ...`);
        });
        app.use(express.static('public'));
        app.use(express.json({ limit: '1mb'}));

        app.use('/sellers', sellerRoutes);
    } catch (e) {
        console.log(e);
    }
}

start(); // Запускаем