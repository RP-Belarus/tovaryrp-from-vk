//  -----  Получение данных из API Вконтакте -----
//
const fetch = require('node-fetch');
require('dotenv').config();   //  Чтобы получить данные из файла .env

// См. как получить токен:   https://vk.com/dev/authcode_flow_user
// А также видео: https://www.youtube.com/watch?v=2eiPf-DfZBE
// Токен получен для localhost:3000
// "expires_in": 0  (бесконечное время жизни токена)
const access_token = process.env.ACCESS_TOKEN;    // Получает токен из файла .env
const api_version = "5.131";  // было 5.126

module.exports = {

    // Получаем товар из ВК по ID. См. https://vk.com/dev/market.getById
    // Примеры:
    // tovarId = "-93793008_964938"; // яблоки
    // tovarId = "-93793008_79152";  // посуда из глины
    getTovarById: async (tovarId) => {
        try {
            const url = "https://api.vk.com/method/market.getById?item_ids=" + tovarId +
                "&access_token=" + access_token + "&v=" + api_version;
            const fetch_response = await fetch(url);
            const tovar = await fetch_response.json();
            return tovar;
        } catch (err) {
            return {
                error: 'Не удалось получить товар из API Вконтакте'
            }
        }
    },

    // Получаем товары из ВК по ID сообщества. См. https://vk.com/dev/market.get
    // Примеры ownerId:
    // -93793008   Райский сад
    // -128194899  Поместье Огородников
    // -81509275   Мастерская деревянной живописи "ПинескЪ"
    // -13916738   Мастерская по дереву "Добрый лес"
    getTovaryByOwnerId: async (ownerId) => {
        try {
            const url = "https://api.vk.com/method/market.get?owner_id=-" + ownerId +
                "&access_token=" + access_token + "&v=" + api_version;
            const fetch_response = await fetch(url);
            const tovary = await fetch_response.json();
            return tovary;
        } catch (err) {
            return {
                error: 'Не удалось получить данные из API Вконтакте'
            }
        }
    },

    // Получить данные группы Вконтакте
    // Подробнее о методе groups.getById  см.: https://vk.com/dev.php?method=groups.getById
    // Пример строки:
    // https://api.vk.com/method/groups.getById?group_id=93793008&access_token=....&v=5.126&fields=description,market
    getGroupInfo: async (groupId) => {
        try {
            //const groupId = ownerId.slice(1);  //  Удаляем первый символ "-"
            const url = "https://api.vk.com/method/groups.getById?group_id=" + groupId +
                "&access_token=" + access_token + "&fields=description,market" + "&v=" + api_version;
            const fetch_response = await fetch(url);
            const groupInfo = await fetch_response.json();
            //  return groupInfo;   //  если нужно вернуть все поля
            return ({
                name: groupInfo.response[0].name,
                description: groupInfo.response[0].description,
                market: {
                    enabled: groupInfo.response[0].market.enabled,
                    contact_id: groupInfo.response[0].market.contact_id  //  если с "-", для связи использ. сообщ. сообщества
                },
                photo_50: groupInfo.response[0].photo_50,
                photo_100: groupInfo.response[0].photo_100,
                photo_200: groupInfo.response[0].photo_200
            });
        } catch (err) {
            return {
                error: 'Не удалось получить данные из API Вконтакте'
            }
        }
    },

    // Получить данные о нескольких группах Вконтакте (не более 50! - ограничение API Вконтакте)
    // Подробнее о методе groups.getById  см.: https://vk.com/dev.php?method=groups.getById
    // примеры group_ids:  93793008,128194899,81509275,13916738
    // Пример строки:
    // ...
    getGroupsInfo: async (groupIds) => {
        try {
            const url = "https://api.vk.com/method/groups.getById?group_ids=" + groupIds +
                "&access_token=" + access_token + "&v=" + api_version + "&fields=description,market";
            const fetch_response = await fetch(url);
            const groupsInfo = await fetch_response.json();
            //return groupIds
            return groupsInfo
        } catch (err) {
            return {
                error: 'Не удалось получить данные из API Вконтакте'
            }
        }
    }

};