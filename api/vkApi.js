//  -----  Получение данных из API Вконтакте -----
//
const fetch = require('node-fetch');
require('dotenv').config();   //  Чтобы получить данные из файла .env

// См. как получить токен:   https://vk.com/dev/authcode_flow_user
// А также видео: https://www.youtube.com/watch?v=2eiPf-DfZBE
// Токен получен для localhost:3000
// "expires_in": 0  (бесконечное время жизни токена)
const access_token = process.env.ACCESS_TOKEN;    // Получает токен из файла .env
const api_version = "5.126";

module.exports = {

    getTovarById: async (tovarId) => {
        const url = "https://api.vk.com/method/market.getById?item_ids=" + tovarId +
            "&access_token=" + access_token + "&v=" + api_version;
        const fetch_response = await fetch(url);
        const json = await fetch_response.json();
        //response.json(json);
        //return json;
        console.log('это мы внутри vk.getTovarById, где id = ' + tovarId);
        return 'Получаем из ВК товар с id=' + tovarId;
        //return 'Лови из ВК json : ' + json(json);

    },

    getTovaryByOwnerId: async (ownerId) => {
        return 'Получаем товары из ВК от продавца с owner_id=' + ownerId;
    }

};