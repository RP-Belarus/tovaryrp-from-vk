const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
require('dotenv').config();   //  Чтобы получить данные из файла .env

const sellerRoutes = require('./api/routes/sellers');

const app = express();
const port = process.env.PORT || 3000;

const mongo_user = process.env.MONGO_USER;
const mongo_pass = process.env.MONGO_PASS;
const mongo_url = `mongodb+srv://${mongo_user}:${mongo_pass}@cluster0.tefog.mongodb.net/tovaryFromVk`;

async function start() {
    try {
        // Подключаемся к mongoose
        await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Запускаем express
        console.log("URL: " + mongo_url);
        app.listen(port, () => {
            console.log(`Starting server at ${port} ...`);
        });
        app.use(express.static('public'));
        app.use(express.json());

        app.use('/sellers', sellerRoutes);
    } catch (e) {
        console.log(e);
    }
}

start(); // Запускаем