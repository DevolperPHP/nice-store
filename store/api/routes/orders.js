const express = require('express');
const router = express.Router();

//PACKAGES
const moment = require('moment')
//MODULES
const User = require('../modules/user');
const Order = require('../modules/orders');

//HELPER FUNCTIONS
const exportToken = require("./export_token");

//GET ORDERS
router.get('/admin/orders', async (req, res) => {
    try {
        const userId = exportToken(req.cookies.token);
        const user = await User.findOne({ _id: userId });
        if (!user || !user.isAdmin) return res.send({ done: false, errMsg: 'Un Authorized' });
        let query = {};
        for (let key in req.query) if (req.query[key] !== 'undefined') query[key] = req.query[key]

        const orders = await Order.find(query);
        res.send({ orders, done: true })
    } catch (err) {
        console.log(err);
    }
});

//GET ORDER BY ID
router.get('/order/:id', async (req, res) => {
    try {
        const userId = exportToken(req.cookies.token);
        const user = await User.findOne({ _id: userId });
        if (!user || !user.isAdmin) return res.send({ done: false, errMsg: 'Un Authorized' });
        const orderId = req.params.id;
        const order = await Order.findOne({ _id: orderId });
        res.send({ order, done: true })
    } catch (err) {
        console.log(err);
    }
});

//SEARCH ORDER 
router.get('/search/order', async (req, res) => {
    try {
        const userId = exportToken(req.cookies.token);
        const user = await User.findOne({ _id: userId });
        if (!user || !user.isAdmin) return res.send({ done: false, errMsg: 'Un Authorized' });
        let query = {};
        for (let key in req.query) if (req.query[key] !== 'undefined') query[key] = req.query[key]
        const orders = await Order.find(query);
        res.send(orders);
    } catch (err) {
        console.log(err);
    }
})
//RESTORE ORDER 
router.put('/restore/order/:id', async (req, res) => {
    try {
        const userId = exportToken(req.cookies.token);
        const user = await User.findOne({ _id: userId });
        if (!user || !user.isAdmin) return res.send({ done: false, errMsg: 'Un Authorized' });
        const orderId = req.params.id;
        await Order.updateOne({ _id: orderId }, {
            $set: {
                "canceled": false,
            }
        });
        res.send({ done: true, });
    } catch (err) {
        console.log(err);
    }
});
//FINSH ORDER
router.put('/finsh/order/:id', async (req, res) => {
    try {
        const userId = exportToken(req.cookies.token);
        const user = await User.findOne({ _id: userId });
        if (!user || !user.isAdmin) return res.send({ done: false, errMsg: 'Un Authorized' });
        const orderId = req.params.id;

        await Order.updateOne({ _id: orderId }, {
            $set: {
                "finished": true,
            }
        });
        res.send({ done: true, succMsg: 'Done' });
    } catch (err) {
        console.log(err);
    }
})
module.exports = router;
