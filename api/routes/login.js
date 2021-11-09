//ROUTER SETUP
const express = require('express');
const router = express.Router();

//PACKAGES
const User = require('../modules/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const momnet = require('moment');
const exportToken = require('./export_token');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.send({ errMsg: 'Please Full All Sections', done: false });
        const user = await User.findOne({ email });

        if (!user) return res.send({ errMsg: 'Invalid Email or Password', done: false });
        if (!user.confirmed) return res.send({ errMsg: 'Please Confirmed Your Account in Email', done: false })

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return res.send({ errMsg: 'Invalid Email or Password', done: false });

        const userId = exportToken(req.cookies.token);
        const checkLogin = await User.findOne({ _id: userId });
        if (checkLogin) return res.send({ errMsg: 'Your Already Login', done: false });
        const token = jwt.sign({
            id: user._id,
        },
            process.env.JWT_SECRET
        );
        res.cookie('token', token, { maxAge: momnet().add(10, 'y'), httpOnly: true });
        res.send({ done: true });
    } catch (error) {
        console.log(error)
    }
})
module.exports = router