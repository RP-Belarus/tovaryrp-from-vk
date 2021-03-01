const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Seller = require('../models/seller');

router.get('/', (req, res, next) => {
    console.log('Успешно отработали GET');
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
    console.log('Получили продавца с ID = ' + req.params.sellerId);
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