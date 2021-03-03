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
        vk_url: req.body.vk_url,
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

router.get('/:sellerId', (req, res, next) => {
    const id = req.params.sellerId;
    // vk.getTovarById(id)
    //     .then(tovar => {
    //         console.log('А теперь из ВК : ' + tovar);
    //         res.status(200).json({
    //             message: 'Продавец с ID = ' + id,
    //             tovar: tovar
    //         });
    //     });
    vk.getTovaryByOwnerId(id)
        .then(tovary => {
            res.status(200).json({
                message: 'Получаем товары от продавца с ID = ' + id,
                tovary: tovary
            })
        })
        .catch(err => {
            console.log(err);
        });
});

router.patch('/:sellerId', (req, res, next) => {
    const id = req.params.sellerId;
    console.log('Обновили продавца с ID = ' + req.params.sellerId);
    res.status(200).json({
        message: 'Обновили продавца с ID = ' + id
    });
});

router.delete('/:sellerId', (req, res, next) => {
    const id = req.params.sellerId;
    console.log('Продавец с ID = ' + req.params.sellerId + ' успешно удалён');
    res.status(200).json({
        message: 'Продавец с ID = ' + id + ' удалён'
    });
});

module.exports = router;