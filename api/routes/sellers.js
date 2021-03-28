const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const vk = require('../vk-api');

const Seller = require('../models/seller');

router.get('/', (req, res, next) => {
    // Загружаем из базы
    Seller.find()
        .exec()
        .then(async docs => {
            // Получаем все group_id из docs и помещаем их в массив groupIds
            const groupIds = docs.reduce((ids, vkGroup) => [ ...ids, vkGroup.vk_owner_id.slice(1)], [])

            // Получаем информацию о группах Вконтакте по их groupIds и помещаем в vkGroupsInfo
            const vkResponse = await vk.getGroupsInfo(groupIds)
            const vkGroupsInfo = vkResponse.response

            // Помещаем информацию о группах Вконтакте из vkGroupsInfo в объекты, полученные из Mongo
            const result = [];
            for (item in docs) {
                result[item] = {
                    ...docs[item]._doc,
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
            res.status(200).json(result);
            //res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {
    const seller = new Seller({
        name: req.body.name,
        vk_owner_id: req.body.vk_owner_id,
        lat: req.body.lat,
        lon: req.body.lon
    });
    // Сохраняем в базу
    seller.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:vkOwnerId', (req, res, next) => {
    const vkOwnerId = req.params.vkOwnerId;
    // Ищем продавца в базе по vk_owner_id
    Seller.findOne({ vk_owner_id: vkOwnerId })
        .exec()
        .then(seller => {
            if (seller) {
                // Получаем товары продавца из API Вконтакте
                vk.getTovaryByOwnerId(vkOwnerId)
                    // Получаем информацию о группе Вконтакте
                    .then(tovary => {
                        vk.getGroupInfo(vkOwnerId.slice(1))  // slice(1) - удаляем "-" перед owner_id
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
            } else {
                res.status(404).json({
                    message: `Продавец с owner_id = ${vkOwnerId} не найден в базе`
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.get('/id/:sellerId', (req, res, next) => {
    const id = req.params.sellerId;
    Seller.findById(id)
        .exec()
        .then(seller => {
            if (seller) {
                res.status(200).json(seller);
            } else {
                res.status(404).json({
                    message: `Продавец с id = ${id} не найден`
                })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.patch('/id/:sellerId', (req, res, next) => {
    const id = req.params.sellerId;
    //console.log('Обновили продавца с ID = ' + req.params.sellerId);
    Seller.updateOne({ _id: id }, { $set: {
        name: req.body.newName,
        vk_owner_id: req.body.newVkOwnerId,
        lat: req.body.newLat,
        lon: req.body.newLon
    } })
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Продавец с id = ${id} успешно изменён`
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/id/:sellerId', (req, res, next) => {
    const id = req.params.sellerId;
    Seller.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Продавец с id = ${id} удалён`
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

//  Метод для получения информации о группе Вконтакте
//  (используется только в тестовых целях)
router.get('/group/:groupId', (req, res, next) => {
   //  vk.getGroupInfo('93793008')
   //  vk.getGroupInfo('128194899')
    vk.getGroupInfo(req.params.groupId)
       .then(groupInfo => {
           res.status(200).json(groupInfo)
       })
       .catch(err => {
           res.status(500).json({ error: err });
       });
});

//  Метод для получения информации о нескольких группах Вконтакте
//  (используется только в тестовых целях)
//  93793008,128194899,81509275,13916738
router.get('/groups/:groupIds', (req, res, next) => {

    const ids = req.params.groupIds.split(',')
    console.log('Length: ', ids.length)

    // const groupIds = [93793008, 128194899, 81509275]
    // vk.getGroupsInfo(groupIds)
    vk.getGroupsInfo(req.params.groupIds)
        .then(groupsInfo => {
            res.status(200).json(groupsInfo)
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})

module.exports = router;