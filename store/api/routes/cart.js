//ROUTER SETUP
const express = require('express');
const router = express.Router();

//PACKAGES
const jwt = require('jsonwebtoken');
const Order = require('../modules/orders');
const Product = require('../modules/products');
const User = require('../modules/user');
const exportToken = require('./export_token');
const moment = require('moment');
//ADD TO CART
router.put('/add/cart', async (req, res) => {
    try {
        const token = req.cookies.token;
        const exportedId = exportToken(token);
        const { productId, qty, checkBuyWithPoints } = req.body;
        const user = await User.findOne({ _id: exportedId });
        if (!user) return res.send({ done: false, errMsg: 'Please Login First' });
        let check = false;
        for (let i = 0; i < user.cart.length; i++) if (productId == user.cart[i]._id) check = true;
        const product = await Product.findOne({ _id: productId });
        if (!product) return res.send({ done: false, errMsg: 'No Product With this Id' });
        if (check) {
            if (qty < 1) return res.send({ errMsg: `Quantity Can't be Less Than one` })
            await User.updateOne({ _id: user._id, "cart._id": productId }, {
                $set: {
                    "cart.$.qty": qty,
                    "cart.$.checkBuyWithPoints": checkBuyWithPoints
                }
            })
            return res.send({ done: true, succMsg: 'Product Updated Succ' });
        }
        else {
            if (product.qty < 1) return res.send({ done: false, succMsg: 'Out Of Stock' });
            if (qty < 1) return res.send({ errMsg: `Quantity Can't be Less Than one` })
            await User.updateOne({ _id: user._id }, {
                $push: {
                    cart: {
                        _id: productId,
                        qty,
                        checkBuyWithPoints,
                    }
                }
            });
            return res.send({ done: true, succMsg: 'Product Added Succ' });
        }
    } catch (err) {
        console.log(err)
    }
});

//UPDATE CART
router.put('/update/cart', async (req, res) => {
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) throw err
        else return decoded.id;
    });
    const type = req.query.type;
    const { qty, productId } = req.body;

    if (type == 'updateQty') {
        if (qty < 1) return res.send({ errMsg: `Quantity Can't be Less Than one` })
        await User.updateOne({ _id: userId, "cart._id": productId }, {
            $set: {
                "cart.$.qty": qty
            }
        });
        res.send({ done: true })
    }
    if (type == 'deleteProduct') {
        await User.updateOne({ _id: userId, "cart._id": productId }, {
            $pull: {
                cart: {
                    _id: productId,
                }
            }
        });
        res.send({ done: true })

    }
    if (type == 'clear') {
        await User.updateOne({ _id: userId }, {
            $set: {
                "cart": []
            }
        });
        res.send({ done: true })

    }
});

//CHECKOUT
router.post('/checkout', async (req, res) => {
    try {
        const token = req.cookies.token;
        const exportedId = exportToken(token);
        const user = await User.findOne({ _id: exportedId });
        if (!user) return res.send({ done: false, errMsg: 'Please Login' });
        const cart = user.cart;
        if (cart.length < 1) return res.send({ done: false, errMsg: 'Cart is Empty' });
        const ids = cart.map(i => i._id);
        const items = await Product.find({ _id: { $in: ids } }).select('-slider -shortDesc -desc -slider -recently');
        let totalPrice = 0;
        let totalPoints = 0;
        let addedScore = 0;

        for (let i = 0; i < items.length; i++) {
            let product = items[i];
            if (cart[i]._id == product._id) {
                product.userQty = cart[i].qty;
                product.checkBuyWithPoints = cart[i].checkBuyWithPoints;
                if (product.qty - product.userQty < 0) return res.send({ done: false, errMsg: `Left in Stock Only ${product.qty}` })
                await Product.updateOne({ _id: product._id }, {
                    $set: {
                        "qty": product.qty - product.userQty
                    }
                })
            }
            if (cart[i]._id == product._id && cart[i].checkBuyWithPoints && product.discountScoreActive) {
                if (product.discount) {
                    const percentage = product.discountScore.percentage / 100;
                    const newPrice = Math.floor(product.discountPrice - (product.discountPrice * percentage))
                    product.discountPrice = newPrice
                }
                else {
                    const percentage = product.discountScore.percentage / 100;
                    const newPrice = Math.floor(product.price - (product.price * percentage))
                    product.price = newPrice
                };
                totalPoints += product.discountScore.points
            };
            addedScore += product.addedScore;
            if (product.discount) totalPrice += product.discountPrice * product.userQty
            else totalPrice += product.price * product.userQty;
        };
        if (totalPoints > user.score + addedScore) return res.send({ done: false, errMsg: 'You Need more Points' })
        await User.updateOne({ _id: user._id }, {
            $set: {
                "score": (user.score + addedScore) - totalPoints,
                "cart": []
            }
        })
        await new Order({
            userId: user._id,
            items,
            totalPrice,
            totalPoints,
            date:moment().format('llll'),
        }).save();

        res.send({ done: true, succMsg: 'Your Order completed Succ' });
    } catch (err) {
        console.log(err)
    }
})

//GET ORDERS
router.get('/orders', async (req, res) => {
    try {
        const token = req.cookies.token;
        const userId = exportToken(token);
        if (!userId) return res.send({ isLogin: false });
        const orders = await Order.find({ userId: userId });
        res.send({ orders, isLogin: true })
    } catch (err) {
        console.log(err)
    }
})
module.exports = router;