const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
    },
});
const Token = new mongoose.model('token', Schema);
module.exports = Token