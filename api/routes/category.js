//SERVER SETUP
const express = require("express");
const router = express.Router();

//PACKAGES
const Category = require("../modules/category");
const User = require("../modules/user");
const Product = require("../modules/products");
const fs = require("fs");
//HELPER FUNCTIONS
const exportToken = require("./export_token");
const mergeHigh = require("../algos/mergeHigh");
const mergeLow = require("../algos/mergeLow");
//GET PRODUCTS BY CATEGORY
router.get("/category/:category", async (req, res) => {
  try {
    const path = req.params.category;
    const sort = req.query.sort;
    const category = await Category.findOne({ path });

    if (sort === "high") {
      const products = mergeHigh(
        await Product.find({ active: true, category: category.title }).select(
          "-userQty -checkBuyWithPoints"
        )
      );
      return res.send(products);
    }
    if (sort === "low") {
      const products = mergeLow(
        await Product.find({ active: true, category: category.title }).select(
          "-userQty -checkBuyWithPoints"
        )
      );
      return res.send(products);
    }
    if (sort === "discount") {
      const products = await Product.find({
        active: true,
        category: category.title,
        discount: true,
      }).select("-userQty -checkBuyWithPoints");
      return res.send(products);
    } else {
      const products = await Product.find({
        active: true,
        category: category.title,
      }).select("-userQty -checkBuyWithPoints");
      res.send(products);
    }
  } catch (err) {
    console.log(err);
  }
});

//GET CATEGORIES
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (err) {
    console.log(err);
  }
});

//SEARCH CATEGORIES
router.get("/search/category/:category", async (req, res) => {
  try {
    const title = req.query.title;
    const category = await Category.findOne({ path: req.params.category });
    let searchOptions = { category: category.title };
    if (title !== "") searchOptions.title = new RegExp(title, "i");
    else
      return res.send(
        await Product.find({ active: true, category: category.title })
      );
    const products = await Product.find(searchOptions);
    res.send(products);
  } catch (err) {
    console.log(err);
  }
});

//ADD CATEGORY
router.post("/add/category", async (req, res) => {
  try {
    const { title, type } = req.body;
    const userId = exportToken(req.cookies.token);
    const user = await User.findOne({ _id: userId });
    if (!user || !user.isAdmin)
      return res.send({ errMsg: "Un Authorized", done: false });
    if (!title || !type)
      return res.send({ errMsg: "Please Full All Sections", done: false });
    await new Category({
      title,
      type: Boolean(type),
      path: title.replace(/ /g, "-"),
    }).save();
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});

//DELETE CATEGORY
router.delete("/delete/category/:id", async (req, res) => {
  try {
    const userId = exportToken(req.cookies.token);
    const user = await User.findOne({ _id: userId });
    if (!user || !user.isAdmin)
      return res.send({ errMsg: "Un Authorized", done: false });
    const categoryId = req.params.id;
    const category = await Category.findOne({ _id: categoryId });
    if (!category)
      return res.send({ errMsg: "Category Not Found", done: false });
    const products = await Product.find({ category: category.title });
    for (let i = 0; i < products.length; i++) {
      fs.unlink(
        `${__dirname}/../../client/public/images/${products[i].image}`,
        (err) => {
          if (err) console.log(err);
        }
      );
      for (let j = 0; j < products[i].slider.length; j++) {
        const { image } = products[i].slider[j];
        fs.unlink(`${__dirname}/../../client/public/images/${image}`, (err) => {
          if (err) console.log(err);
        });
      }
    }
    await Product.deleteMany({ category: category.title });
    await Category.deleteOne({ _id: categoryId });
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
