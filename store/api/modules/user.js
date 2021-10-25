const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024,
        minlength: 8,
    },
    phone: {
        type: Number,
        required: true,
    },
    cart: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0,
    },
    rank: {
        type: Object,
        default: { title: 'Member', }
    },
    address: {
        type: String,
        required: true,
    },
    governorate: {
        type: String,
        required: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    date: {
        type: String,
        required: true
    },
    analysisDate: {
        type: String,
        required: true
    }
});
const User = mongoose.model('users', Schema);
module.exports = User;