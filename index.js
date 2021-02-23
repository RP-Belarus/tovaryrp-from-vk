const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
require('dotenv').config();   //  Чтобы получить данные из файла .env

//console.log(process.env);

const app = express();
const port = process.env.PORT || 3000;

async function start() {
    try {
        // Подключаемся к mongoose
        // await mongoose.connect('', {
        //     useNewUrlParser: true,
        //     useFindAndModify: false
        // });

        // Запускаем express
        app.listen(port, () => {
            console.log(`Starting server at ${port} ...`);
        });
        app.use(express.static('public'));
        app.use(express.json({ limit: '1mb'}));
    } catch (e) {
        console.log(e);
    }
}

start(); // Запускаем

// См. как получить токен:   https://vk.com/dev/authcode_flow_user
// А также видео: https://www.youtube.com/watch?v=2eiPf-DfZBE
// Токен получен для localhost:3000
// "expires_in": 0  (бесконечное время жизни токена)
const access_token = process.env.ACCESS_TOKEN;    // Получает токен из файла .env
const api_version = "5.126";

//const tovar_id = "-93793008_964938"; // яблоки
//const tovar_id = "-93793008_79152";  // посуда из глины
//const tovar_url = "https://api.vk.com/method/market.getById?item_ids=" + tovar_id +
//        "&access_token=" + access_token + "&v=" + api_version;

//app.get('/tovar', async (request, response) => {
//    const fetch_response = await fetch(tovar_url);
//    const json = await fetch_response.json();
    //console.log(json);
    //console.log("Count: " + json.response.count);
    //console.log("Title: " + json.response.items[0].title);
    //console.log("Description: " + json.response.items[0].description);
//    response.json(json);
//});


// Берёт id товара из строки запроса, возвращает товар из API Вконтакта
// Пример строки: /tovar?id=-93793008_964938
app.get('/tovar', async (request, response) => {
    const id = request.query.id;
    const url = "https://api.vk.com/method/market.getById?item_ids=" + id +
        "&access_token=" + access_token + "&v=" + api_version;
    const fetch_response = await fetch(url);
    const json = await fetch_response.json();
    response.json(json);
});

// Берёт id продавца из строки запроса, возвращает товары продавца из API Вконтакта
// Пример строки: /tovary?owner_id=-93793008
// Примеры owner_id:
// -93793008  Райский сад
// -128194899  Поместье Огородников
// -81509275  Мастерская деревянной живописи "ПинескЪ"
// -13916738  Мастерская по дереву "Добрый лес"
app.get('/tovary', async (request, response) => {
    const owner_id = request.query.owner_id;
    const url = "https://api.vk.com/method/market.get?owner_id=" + owner_id +
        "&access_token=" + access_token + "&v=" + api_version;
    const fetch_response = await fetch(url);
    const json = await fetch_response.json();
    response.json(json);
});

app.post('/gettovar', (request, response) => {
    console.log('I got a POST request!');
    console.log('Name: ' + request.body.name);
    response.json({
        status: 'success'
    });
});