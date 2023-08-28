const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
require('dotenv').config();   //  Чтобы получить данные из файла .env

// ---- Временно вместо sellers (с mongoose) - sellers-hardcode ---->
// const sellerRoutes = require('./api/routes/sellers');
const sellerRoutes = require('./api/routes/sellers-hardcode');
// <-----
const userRoutes = require('./api/routes/users');

const app = express();
const port = process.env.PORT || 3001;

const mongo_user = process.env.MONGO_USER;
const mongo_pass = process.env.MONGO_PASS;
const mongo_url = `mongodb+srv://${mongo_user}:${mongo_pass}@cluster0.tefog.mongodb.net/tovaryFromVk`;

async function start() {
    try {
        // Подключаемся к mongoose
        // --- времмено отключено. При необходимости - раскомментировать:
        // await mongoose.connect(mongo_url, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // });

        // Запускаем express
        //console.log("URL: " + mongo_url);
        app.listen(port, () => {
            console.log(`Starting server at ${port} ...`);
        });
        app.use(express.static('public'));
        app.use(express.json());

        //  Для отключения CORS
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
                return res.status(200).json({});
            }
            next();
        });

        // Роуты для обработки запросов
        app.use('/sellers', sellerRoutes);
        app.use('/user', userRoutes);

    } catch (e) {
        console.log(e);
    }
}

start(); // Запускаем