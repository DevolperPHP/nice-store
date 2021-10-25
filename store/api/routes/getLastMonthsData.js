const moment = require('moment');
const Product = require('../modules/products');

const getLastMonthsData = async (months) => {
    const monthsArr = [];
    for (let i = 1; i <= months; i++) {
        const month = moment().subtract(i, 'months').format('M/YYYY');
        monthsArr.push(month)
    };
    const data = [];
    for (let y = 0; y < monthsArr.length; y++) {
        let total = 0;
        let currentMonth = monthsArr[y];
        const products = await Product.find({ analysisDate: { $eq: currentMonth }, buyScore:{$gt:0}})

        for (let x = 0; x < products.length; x++) total += products[x].buyScore;
        data.push(total);
        total = 0;
    }
    return { labels: monthsArr, data };
}

module.exports = getLastMonthsData;