const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    type:{
        type:Boolean,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
})
const Category = mongoose.model('category' , Schema);
module.exports = Category;