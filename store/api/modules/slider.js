const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    images:{
        type:Array,
        required:true,
    }
});
const Slider = mongoose.model('slider' , Schema);

module.exports = Slider