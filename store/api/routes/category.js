//SERVER SETUP
const express = require('express');
const router = express.Router();

//PACKAGES
const jwt = require('jsonwebtoken');
const Category = require('../modules/category');
const User = require('../modules/user');

//ALGOS
const binaryId = require('../algos/binaryId');

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories)
    } catch (err) {
        console.log(err)
    }

})
router.post('/add/category', async (req, res) => {
    try {
        const { title, type } = req.body;
        const token = req.cookies.token;
        const userId = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) console.log(err)
            else return decoded.id;
        });

        const { isAdmin } = binaryId(userId, await User.find());
        if (!userId || !isAdmin) return res.send({ errMsg: 'You Must Be Admin', done: false });
        if (!title || !type) return res.send({ errMsg: 'Please Full All Sections', done: false });
        await new Category({
            title,
            type: Boolean(type)
        }).save();
        res.send({ done: true })

    } catch (err) {
        console.log(err)
    }
})
module.exports = router;
