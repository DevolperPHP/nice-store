const moment = require('moment');
const Product = require('../modules/products');

const getIndividualData = async (number) => {
    const monthsArr = [];
    for (let i = 1; i <= number; i++) {
        monthsArr.push(moment().subtract(i, 'months').format('M/YYYY'))
    };

    const products = [];
    let totalSales = 0;
    for (let x = 0; x < monthsArr.length; x++) {
        const currentProducts = await Product.find({ analysisDate: { $eq: monthsArr[x] }, buyScore: { $gt: 0 } });
        for (let y = 0; y < currentProducts.length; y++) totalSales += currentProducts[y].buyScore;
        products.push(...currentProducts);
    }
    return {products, totalSales};
}
module.exports = getIndividualData;