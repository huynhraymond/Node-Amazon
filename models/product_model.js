
var mongoose = require('mongoose');

var ProductModel = mongoose.model('product', {
    category: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
        index: true
    },

    description: {}
});

module.exports = ProductModel;
