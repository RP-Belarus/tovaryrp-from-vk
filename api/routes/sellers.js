const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const vk = require('../vkApi');

const Seller = require('../models/seller');

router.get('/', (req, res, next) => {
    const seller = vk.getTovaryByOwnerId(345);
    console.log('Успешно отработали GET');
    //console.log('А теперь из ВК : ' + seller);
    res.status(200).json({
        message: 'Отработали GET'
    });
});

router.post('/', (req, res, next) => {
    console.log('Успешно отработали POST');
    res.status(201).json({
        message: 'Отработали POST'
    });
});

router.get('/:sellerId', (req, res, next) => {
    const id = req.params.sellerId;
    const tovar = vk.getTovarById(id);
    console.log('Получили продавца с ID = ' + req.params.sellerId);
    console.log('А теперь из ВК : ' + tovar);
    res.status(200).json({
        message: 'Продавец с ID = ' + id
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