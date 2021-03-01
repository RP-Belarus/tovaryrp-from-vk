const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    vk_url: { type: String, required: true},
    lat: { type: Number, required: true},
    lon: { type: Number, required: true}
});

module.exports = mongoose.model('Seller', sellerSchema);