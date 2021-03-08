const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const vk = require('../vk-api');

const Seller = require('../models/seller');

router.get('/', (req, res, next) => {
    // Загружаем из базы
    Seller.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs)
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
                    .then(tovary => {
                        res.status(200).json({
                            seller: seller,
                            tovary: tovary
                        });
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

module.exports = router;