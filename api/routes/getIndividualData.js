const moment = require("moment");
const Product = require("../modules/products");

const getIndividualData = async (number) => {
  const monthsArr =
    number === "current-month" ? [moment().format("M/YYYY")] : [];
  for (let i = 1; i <= number; i++) monthsArr.push(moment().subtract(i, "months").format("M/YYYY"));
  const products = await Product.find({analysisDate: { $in: monthsArr },buyScore: { $gt: 0 }});
  let totalSales = 0;
  for (let y = 0; y < currentProducts.length; y++) totalSales += currentProducts[y].buyScore;
  return { products, totalSales };
};
module.exports = getIndividualData;
