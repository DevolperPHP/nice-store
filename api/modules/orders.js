const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    items:{
        type:Array,
        default:[]
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    totalPoints:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    finished:{
        type:Boolean,
        default:false
    },
    canceled:{
        type:Boolean,
        default:false
    },
    totalDiscount:{
        type:Number,
        required:true,
    }
});
const Order = mongoose.model('orders' , Schema);
module.exports = Order;