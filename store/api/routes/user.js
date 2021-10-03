//ROUTER SETUP
const express = require('express');
const router = express.Router();

//PACKAGES
const User = require('../modules/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Token = require('../modules/token');
const uuid = require('uuid').v1;
const redis = require('redis');
const redisClient = redis.createClient();
//ALGOS
const Product = require('../modules/products');
const mergeRevers = require('../algos/mergeRevers');
const exportToken = require('./export_token');
const getOrSetCach = require('./getOrSetCachList');

//GET USER
router.get('/user', async (req, res) => {
    try {
        const token = req.cookies.token;
        const userId = exportToken(token);
        redisClient.get(`user:${userId}`, async (err, data) => {
            if (err) throw err
            else if (data !== null) {
                res.send({ user:JSON.parse(data), isLogin: true, });
            };
            const user = await User.findOne({ _id: userId }).select(
                'email name isAdmin phone cart score rank address governorate -_id'
            );
            if (!user) return res.send({ isLogin: false });
            redisClient.set(`user:${userId}`, JSON.stringify(user));
        })
    } catch (err) {
        console.log(err)
    }
});

//GET CART
router.get('/cart', async (req, res) => {
    try {
        const token = req.cookies.token;
        const userId = exportToken(token)
        const user = await User.findOne({ _id: userId });
        if (!user) return res.send([]);
        const { cart } = user;
        const ids = cart.map(i => i._id);
        let totalPrice = 0;
        let totalPoints = 0;
        let items = await Product.find({ _id: { $in: ids } }).select('-slider -shortDesc -desc');

        for (let i = 0; i < items.length; i++) {
            let product = items[i];
            if (cart[i]._id == product._id) {
                product.userQty = cart[i].qty
                product.checkBuyWithPoints = cart[i].checkBuyWithPoints
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
            if (product.discount) totalPrice += product.discountPrice * product.userQty;
            else totalPrice += product.price * product.userQty;
        };
        res.send({ items, totalPrice, totalPoints });
    } catch (error) {
        res.send([]);
        console.log(error)
    }
});

//GET USERS LEADER BOARD
router.get('/ranking/user', async (req, res) => {
    try {
        const users = await getOrSetCach('rankingUsers', 604800, async () => {
            return mergeRevers(await User.find({ score: { $gt: 0 } }).select('name rank score -_id'));
        })
        res.send(users)
    } catch (err) {
        console.log(err)
    }
});

//EDIT ACCOUNT 
router.put('/edit/account', async (req, res) => {
    try {
        const userId = exportToken(req.cookies.token);
        const user = await User.find({ _id: userId });
    } catch (err) {
        console.log(err)
    }

})

//LOGOUT 
router.post('/logout', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.send({ done: false, errMsg: 'Full Password Section' });
        const userId = exportToken(req.cookies.token);
        const user = await User.findOne({ _id: userId });
        if (!user) return res.send({ done: false, errMsg: 'Login to be able to logout' });
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return res.send({ done: false, errMsg: 'Wrong Password' })
        res.cookie('token', '', { maxAge: 1 });
        res.send({ done: true });
    } catch (err) {
        console.log(err)
    }

});

//SEND DELETE EMAIL ACCOUNT
router.post('/delete/user/email', async (req, res) => {
    try {
        const userId = exportToken(req.cookies.token);
        const user = await User.findOne({ _id: userId });

        if (!user) return res.send({ done: false, errMsg: 'Please Login First' });

        //MAKE VERFIY TOKEN
        const verifyToken = uuid();
        await new Token({
            token: verifyToken
        }).save();

        //MAKE JSON VERIFY TOKEN
        const deletingToken = jwt.sign({
            token: verifyToken,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '5m'
            }
        )
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.COMPANY_EMAIL,
                pass: process.env.COMPANY_EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.COMPANY_EMAIL,
            to: user.email,
            subject: 'Deleting Aireo Account',
            html: `
                <p>Note this Link valid For 5 minutes<p/>
                <h3>By Following this <a href=${process.env.CLIENT_URL}/delete/account/${deletingToken}>Link<a/> Your Redirect to Deleting Account Page<h3/>
        
            `
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) throw err;
        });
        res.send({ done: true })
    } catch (err) {
        console.log(err)
    }
});

//CONFIRM DELETE
router.post('/confirm/delete/:token', async (req, res) => {
    try {
        const token = req.cookies.token;
        const userId = exportToken(token);
        const user = await User.findOne({ _id: userId });
        if (!user) return res.send({ done: false, errMsg: 'Login first' });
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.send({ done: false, errMsg: 'Token Expired' });
            else return decoded
        });
        const { password } = req.body;
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword || !password) return res.send({ done: false, errMsg: 'Wrong Password' });
        const verifyToken = await Token.findOne({ token: decoded.token });
        if (!verifyToken) return res.send({ done: false, errMsg: 'Invalid Token' })
        await User.deleteOne({ _id: userId });
        await Token.deleteOne({ token: decoded.token });
        res.send({ done: true });
    } catch (err) {
        console.log(err)
    }
});

//SEND VERIFY EMAIL
router.post('/send/verfiy/email', async (req, res) => {
    const { email } = req.body;
    const userId = exportToken(req.cookies.token);
    if (!email) return res.send({ done: false, errMsg: 'Include Email' });
    const user = await User.findOne({ _id: userId });
    if (user) return res.send({ done: false, errMsg: 'Your Already Login' });
    //ADD VERFIY TOKEN
    const verifyToken = uuid();
    await new Token({
        token: verifyToken
    }).save();

    //MAKE JSON VERIFY TOKEN
    const jsonVerifyToken = jwt.sign({
        token: verifyToken,
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '8m'
        }
    )
    //SEND VERIFY EMAIL
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.COMPANY_EMAIL,
            pass: process.env.COMPANY_EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.COMPANY_EMAIL,
        to: email,
        subject: 'Confirming Account',
        html: `
        <p>Note:This Link Valid for 8 minutes</p>
        <h3>Buy Following this <a href=${process.env.CLIENT_URL}/verify/account/${jsonVerifyToken}>Link<a/> you will Redirect to Verify Page<h3/>
    `
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) throw err;
    });
    res.send({ done: true });
});

//VERIFY EMAIL 
router.post('/verify/account/:token', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.send({ done: false, errMsg: 'Please Include Email' })
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.send({ done: false, errMsg: 'Token Expired' });
            else return decoded;
        });
        const verifyToken = await Token.findOne({ token: decoded.token });
        const user = await User.findOne({ email })
        if (!verifyToken || !user) return res.send({ done: false, errMsg: 'Wrong Token or email' });
        else {
            await User.updateOne({ email }, {
                $set: {
                    "confirmed": true
                }
            })
            await Token.deleteOne({ token: decoded.token });
            res.send({ done: true })
        }
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;