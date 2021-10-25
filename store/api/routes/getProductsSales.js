const moment = require('moment');
const Product = require('../modules/products');

const getProductsSales = async (number, cb) => {
    const month = moment().subtract(number, 'months').format('M/YYYY');
    const products = await Product.find({analysisDate:{$gte:month}, buyScore:{$gt:0}});
    return products;
}
module.exports = getProductsSales;