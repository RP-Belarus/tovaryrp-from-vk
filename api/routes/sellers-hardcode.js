//  --- Это временный, хардкодный модуль, вместо использования Mongoose в файле sellers.js
//  Для переподключения см. файл index.js, строку  const sellerRoutes = require('./api/routes/sellers-hardcode');
const express = require('express');
const router = express.Router();


const vk = require('../vk-api');



router.get('/', (req, res, next) => {

    const getDataFromVK = async () => {

        // Получаем все group_id из docs и помещаем их в массив groupIds
        // docs - зашит хардкорно, см. в конце файла
        const groupIds = docs.reduce((ids, vkGroup) => [ ...ids, vkGroup.vk_owner_id.slice(1)], [])

        // Получаем информацию о группах Вконтакте по их groupIds и помещаем в vkGroupsInfo
        const vkResponse = await vk.getGroupsInfo(groupIds)
        const vkGroupsInfo = vkResponse.response

        // Помещаем информацию о группах Вконтакте из vkGroupsInfo в объекты, полученные из Mongo
        const result = [];
        for (item in docs) {
            result[item] = {
                // ...docs[item]._doc,
                ...docs[item],
                vk_group_info: {
                    vk_name: vkGroupsInfo[item].name,
                    vk_market_enabled: vkGroupsInfo[item].market.enabled,
                    photo_50: vkGroupsInfo[item].photo_50,
                    photo_100: vkGroupsInfo[item].photo_100,
                    photo_200: vkGroupsInfo[item].photo_200,
                    description: vkGroupsInfo[item].description
                }
            }
        }
        // console.log("Уже вот-вот выдадим результат:")
        res.status(200).json(result);
    }

    getDataFromVK().catch(err => {
        res.status(500).json({
            error: err
        })
    })

    // Получаем информацию о группах Вконтакте по их groupIds и помещаем в vkGroupsInfo
    //const vkResponse = await vk.getGroupsInfo(groupIds)
    //const vkGroupsInfo = vkResponse.response

    // const result = [];
    // for (item in docs) {
    //     result[item] = {
    //         ...docs[item]._doc,
    //         vk_group_info: {
    //             vk_owner_id: docs[item].vk_owner_id,
    //             vk_name: docs[item].name,
    //             lat: docs[item].lat,
    //             lon: docs[item].lon
    //         }
    //     }
    // }

    // res.status(200).json(result);
    // res.send('Что-то есть.....');

});

router.get('/:vkOwnerId', (req, res, next) => {
    const vkOwnerId = req.params.vkOwnerId;

    const seller = docs.find(e => e.vk_owner_id === '-' + vkOwnerId)

    vk.getTovaryByOwnerId(vkOwnerId)
    // Получаем информацию о группе Вконтакте
        .then(tovary => {
            // vk.getGroupInfo(vkOwnerId.slice(1))  // slice(1) - удаляем "-" перед owner_id
            vk.getGroupInfo(vkOwnerId)
                .then(groupInfo => {
                    res.status(200).json({
                        seller: seller,
                        group_info: groupInfo,
                        tovary: tovary
                    })
                })
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

const docs = [
    {
        "_id" : "603fd3b7951ec5023c184584",
        "name": "Райский Сад",
        "vk_owner_id": "-93793008",
        "lat": 53.99363,
        "lon": 26.805321,
        "__v": 0
    },
    {
        "_id": "60448f5326e4c51acc389c31",
        "name": "Поместье Огородников",
        "vk_owner_id": "-128194899",
        "lat": 54.38083,
        "lon": 27.70718,
        "__v": 0
    },
    {
        "_id": "6045ec14a19b320f1048e4d4",
        "name": "Мастерская деревянной живописи \"ПинескЪ\"",
        "vk_owner_id": "-81509275",
        "lat": 52.11141,
        "lon": 26.10261,
        "__v": 0
    },
    {
        "_id": "6046685021cf6e1b68bd546e",
        "name": "\"ЛАДУШКА\" Натуральное мыло и косметика",
        "vk_owner_id": "-70820274",
        "lat": 53.57908,
        "lon": 26.03013,
        "__v": 0
    },
    {
        "_id": "60485db71687ca24e840cdd3",
        "name": "Семейная пекарня \"Саковінка\" (Минск)",
        "vk_owner_id": "-148886371",
        "lat": 53.90226,
        "lon": 27.56183,
        "__v": 0
    },
    {
        "_id": "60485ed31687ca24e840cdd4",
        "name": "Ремесленная мастерская\"Хозяин Родового Поместья\" (Яснодар)",
        "vk_owner_id": "-66034438",
        "lat": 55.42937,
        "lon": 30.78517,
        "__v": 0
    },
    {
        "_id": "60485f241687ca24e840cdd5",
        "name": "Мастерская по дереву \"Добрый лес\"",
        "vk_owner_id": "-13916738",
        "lat": 52.09384,
        "lon": 23.68528,
        "__v": 0
    },
    {
        "_id": "61d7327749fc9200159f29e6",
        "name": "Мастерская \"Лесодия\"",
        "vk_owner_id": "-191328680",
        "lat": 53.58581,
        "lon": 26.03378,
        "__v": 0
    }
];

module.exports = router;
