const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const vk = require('../vk-api');

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
    // vk.getTovarById(id).then(tovar => {
    //     console.log('А теперь из ВК : ' + tovar);
    //     res.status(200).json({
    //         message: 'Продавец с ID = ' + id,
    //         tovar: tovar
    //     });
    // });
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