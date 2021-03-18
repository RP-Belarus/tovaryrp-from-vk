const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

// Проверка связи
router.get('/', (req, res, next) => {
    res.status(200).json({ message: 'Ответ получен...' })
});

module.exports = router;