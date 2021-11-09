const moment = require("moment");
const Product = require("../modules/products");

const getLastMonthsData = async (months) => {
  const monthsArr =
    months === "current-month"
      ? [moment().format("M/YYYY")]
      : [];
  for (let i = 1; i <= months; i++) {
    const month = moment().subtract(i, "months").format("M/YYYY");
    monthsArr.push(month);
  }
  const data = [];
  let totalSales = 0;
  for (let y = 0; y < monthsArr.length; y++) {
    let total = 0;
    let currentMonth = monthsArr[y];
    const products = await Product.find({
      analysisDate: { $eq: currentMonth },
      buyScore: { $gt: 0 },
    });
    for (let x = 0; x < products.length; x++) total += products[x].buyScore;
    data.push(total);
    totalSales += total;
    total = 0;
  }
  return { labels: monthsArr, data, totalSales };
};

module.exports = getLastMonthsData;
