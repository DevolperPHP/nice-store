//ROUTER SETUP
const express = require('express');
const router = express.Router();

//PACKAGES
const User = require('../modules/user');
const Token = require('../modules/token');
const bcrypt = require('bcrypt');
const moment = require('moment');
const uuid = require('uuid').v1;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const exportToken = require('./export_token');

//ADD ACCOUNT
router.post('/register', async (req, res) => {
    try {
        //REG EX
        const numberRegEx = new RegExp(/[1-9]/)
        const emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        const governorates = [
            'Anbar',
            'Babil',
            'Baghdad',
            'Basra',
            'Dhi Qar',
            'Al-Qadisiyah',
            'Diyala',
            'Duhok',
            'Erbil',
            'Karbala',
            'Kirkuk',
            'Maysan',
            'Muthanna',
            'Najaf',
            'Nineveh',
            'Saladin',
            'Sulaymaniyah',
            'Wasit',
        ];
        //INFO
        const { email, password, phone, name, address, governorate } = req.body;

        //CHECK DATA
        for (const key in req.body) {
            if (req.body[key] == '') return res.send({ errMsg: 'Please Full All The Sections', done: false });
        };

        if (!emailRegEx.test(email)) return res.send({ errMsg: 'Please Write Valid Email', done: false });

        if (!numberRegEx.test(phone)) return res.send({ errMsg: 'Please Write Valid Phone Number', done: false });

        if (!governorates.find(gover => gover == governorate)) return res.send({ errMsg: 'Invalid Governorate', done: false });
        
        //CHECK UNIEQ
        const checkEmail = await User.findOne({ email });
        const checkName = await User.findOne({ name });
        const userId = exportToken(req.cookies.token);
        const user = await User.findOne({ _id: userId });

        if (checkEmail) return res.send({ errMsg: 'Please Choose Other Email', done: false });
        if (checkName) return res.send({ errMsg: 'Please Choose Other Name', done: false });
        if (user) return res.send({ errMsg: 'Your Already Login', done: false });

        //ADD USER
        const hashed = await bcrypt.hash(password, 10)
        await User({
            name,
            email,
            password: hashed,
            phone,
            address,
            governorate,
            date: moment().format('llll'),
            analysisDate: moment().format('M/YYYY'),
        }).save();
        res.send({ done: true })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router