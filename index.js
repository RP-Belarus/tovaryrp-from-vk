const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

console.log(process.env);

const app = express();
app.listen(3000, () => console.log('Listening at 3000...'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb'}));

// См. как получить токен:   https://vk.com/dev/authcode_flow_user
// А также видео: https://www.youtube.com/watch?v=2eiPf-DfZBE
// Токен получен для localhost:3000
// "expires_in": 0  (бесконечное время жизни токена)
const access_token = process.env.ACCESS_TOKEN;

//const tovar_id = "-93793008_964938"; // яблоки
const tovar_id = "-93793008_79152";  // посуда из глины
const api_version = "5.126";
const tovar_url = "https://api.vk.com/method/market.getById?item_ids=" + tovar_id +
        "&access_token=" + access_token + "&v=" + api_version;

app.get('/tovar', async (request, response) => {
    const fetch_response = await fetch(tovar_url);
    const json = await fetch_response.json();
    console.log(json);
    console.log("Count: " + json.response.count);
    console.log("Title: " + json.response.items[0].title);
    console.log("Description: " + json.response.items[0].description);
    response.json(json);
});

app.post('/gettovar', (request, response) => {
    console.log('I got a POST request!');
    console.log('Name: ' + request.body.name);
    response.json({
        status: 'success'
    });
});