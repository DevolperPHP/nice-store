//ROUTER SETUP
const express = require("express");
const router = express.Router();

//PACKAGES
const User = require("../modules/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../modules/token");
const uuid = require("uuid").v1;
const Product = require("../modules/products");
const exportToken = require("./export_token");
const moment = require("moment");
const _ = require("lodash");
//ALGOS
const mergeRevers = require("../algos/mergeRevers");
const binaryId = require("../algos/binaryId");

//HELPER FUNCTIONS
const getLastMonthsData = async (months) => {
  const monthsArr =
    months === "current-month"
      ? [moment().format("M/YYYY")]
      : [];

  for (let i = 0; i <= months; i++) {
    const month = moment().subtract(i, "months").format("M/YYYY");
    monthsArr.push(month);
  }
  const data = [];
  let totalUsersGain = 0;
  for (let y = 0; y < monthsArr.length; y++) {
    let currentMonth = monthsArr[y];
    const users = await User.find({ analysisDate: { $eq: currentMonth } });
    data.push(users.length);
    totalUsersGain += users.length;
  }
  return { labels: monthsArr, data, totalUsersGain };
};
const getGovernoratesData = async () => {
  const governorates = [
    "Anbar",
    "Babil",
    "Baghdad",
    "Basra",
    "Dhi Qar",
    "Al-Qadisiyah",
    "Diyala",
    "Duhok",
    "Erbil",
    "Karbala",
    "Kirkuk",
    "Maysan",
    "Muthanna",
    "Najaf",
    "Nineveh",
    "Saladin",
    "Sulaymaniyah",
    "Wasit",
  ];
  const data = [];
  let totalUsers = 0;
  for (let i = 0; i < governorates.length; i++) {
    let currentGovernorate = governorates[i];
    const users = await User.find({ governorate: currentGovernorate });
    data.push(users.length);
    totalUsers += users.length;
  }
  return { labels: governorates, data, totalUsers };
};
//GET USER
router.get("/user", async (req, res) => {
  try {
    const token = req.cookies.token;
    const userId = exportToken(token);
    const user = await User.findOne({ _id: userId }).select(
      "email name isAdmin phone cart score rank address governorate confirmed -_id"
    );
    if (!user) return res.send({ isLogin: false });
    res.send({ user, isLogin: true });
  } catch (err) {
    console.log(err);
  }
});

//GET USERS GOVERNORATE
router.get("/graph/users/governorate", async (req, res) => {
  try {
    const userId = exportToken(req.cookies.token);
    const user = await User.findOne({ _id: userId });

    if (!user || !user.isAdmin)
      return res.send({ done: false, errMsg: "Un Authorized" });
    const requestedDate = req.query.date;

    if (requestedDate === "1")
      return res.send({ done: true, data: await getGovernoratesData() });

    if (requestedDate === "2")
      return res.send({ done: true, data: await getGovernoratesData() });

    if (requestedDate === "5")
      return res.send({ done: true, data: await getGovernoratesData() });

    if (requestedDate === "12")
      return res.send({ done: true, data: await getGovernoratesData(1) });

    if (requestedDate === "24")
      return res.send({ done: true, data: await getGovernoratesData(2) });
    else {
      res.send({ done: false, errMsg: "This Date is not Allowed" });
    }
  } catch (err) {
    console.log(err);
  }
});

//GET USERS GAIN
router.get("/graph/users/gain", async (req, res) => {
  const userId = exportToken(req.cookies.token);
  const user = await User.findOne({ _id: userId });
  if (!user || !user.isAdmin)
    return res.send({ done: false, errMsg: "Un Authorized" });
  const requestedDate = req.query.date;

  if (requestedDate === "current-month")
    return res.send({
      done: true,
      data: await getLastMonthsData("current-month"),
    });
  if (requestedDate === "2") {
    const data = await getLastMonthsData(2, "User");
    res.send({ data, done: true });
  }
  if (requestedDate === "5") {
    const data = await getLastMonthsData(5, "User");
    res.send({ data, done: true });
  }
  if (requestedDate === "12") {
    const data = await getLastMonthsData(12, "User");
    res.send({ data, done: true });
  }
  if (requestedDate === "24") {
    const data = await getLastMonthsData(24, "User");
    res.send({ data, done: true });
  }
});
//GET CART
router.get("/cart", async (req, res) => {
  try {
    const token = req.cookies.token;
    const userId = exportToken(token);
    const user = await User.findOne({ _id: userId });
    if (!user) return res.send([]);
    const { cart } = user;
    const ids = cart.map((i) => i._id);
    let totalPrice = 0;
    let totalPoints = 0;
    let totalDiscount = 0;
    const items = await Product.find({ _id: { $in: ids } }).select(
      "-slider -shortDesc -desc"
    );

    const finalItems = [];
    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      const product = binaryId(cart[i]._id, items);
      product.userQty = cartItem.qty;
      product.checkBuyWithPoints = cartItem.checkBuyWithPoints;
      if (cartItem.checkBuyWithPoints && product.discountScoreActive) {
        if (product.discount) {
          const percentage = product.discountScore.percentage / 100;
          const newPrice = Math.floor(
            product.discountPrice - (product.discountPrice * percentage)
          );
          product.discountPrice = newPrice;
        } else {
          const percentage = product.discountScore.percentage / 100;
          const newPrice = Math.floor(
            product.price - (product.price * percentage)
          );
          totalDiscount += (product.price - newPrice) * product.userQty;
          product.price = newPrice;
        }
        totalPoints += (product.discountScore.points) * product.userQty;
      }
      if (product.discount) {
        totalPrice += product.discountPrice * product.userQty;
        totalDiscount += (product.price - product.discountPrice) * product.userQty;
      }
      else totalPrice += product.price * product.userQty;
      finalItems.push(product);
    }
    res.send({ items: finalItems, totalPrice, totalPoints, totalDiscount });
  } catch (err) {
    console.log(err);
  }
});

//GET USERS LEADER BOARD
router.get("/ranking/user", async (req, res) => {
  try {
    const users = mergeRevers(
      await User.find({ score: { $gt: 0 } }).select("name rank score -_id")
    );
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

//LOGOUT
router.post("/logout", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password)
      return res.send({ done: false, errMsg: "Full Password Section" });
    const userId = exportToken(req.cookies.token);
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res.send({ done: false, errMsg: "Login to be able to logout" });
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.send({ done: false, errMsg: "Wrong Password" });
    res.cookie("token", "", { maxAge: 1 });
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});

//SEND DELETE ACCOUNT EMAIL
router.post("/delete/user/email", async (req, res) => {
  try {
    const userId = exportToken(req.cookies.token);
    const user = await User.findOne({ _id: userId });

    if (!user) return res.send({ done: false, errMsg: "Please Login First" });

    //MAKE VERFIY TOKEN
    const verifyToken = uuid();
    await new Token({
      token: verifyToken,
      email: user.email,
      verifyCode: "delete-token",
    }).save();

    //MAKE JSON VERIFY TOKEN
    const deletingToken = jwt.sign(
      {
        token: verifyToken,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: user.email,
      subject: "Deleting Aireo Account",
      html: `
                <p>Note this Link valid For 5 minutes<p/>
                <h3>By Following this <a href=${process.env.CLIENT_URL}/delete/account/${deletingToken}>Link<a/> Your Redirect to Deleting Account Page<h3/>
        
            `,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) throw err;
    });
    console.log('test');
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});

//CONFIRM DELETE
router.post("/confirm/delete/:token", async (req, res) => {
  try {
    const token = req.cookies.token;
    const userId = exportToken(token);
    const user = await User.findOne({ _id: userId });
    if (!user) return res.send({ done: false, errMsg: "Login first" });
    const decoded = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) return res.send({ done: false, errMsg: "Token Expired" });
        else return decoded;
      }
    );
    const { password } = req.body;
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword || !password)
      return res.send({ done: false, errMsg: "Wrong Password" });
    const verifyToken = await Token.findOne({ token: decoded.token });
    if (!verifyToken) return res.send({ done: false, errMsg: "Invalid Token" });
    await User.deleteOne({ _id: userId });
    await Token.deleteOne({ token: decoded.token });
    res.cookie("token", "", { maxAge: 1 });
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});

//SEND VERIFY EMAIL
router.post("/send/verify/email", async (req, res) => {
  try {
    const { email } = req.body;
    const userId = exportToken(req.cookies.token);
    if (!email) return res.send({ done: false, errMsg: "Include Email" });
    let verifyCode = "";
    for (let i = 0; i < 5; i++) verifyCode += Math.floor(Math.random() * 10);
    const user = await User.findOne({ _id: userId });
    if (user) return res.send({ done: false, errMsg: "Your Already Login" });

    //ADD VERFIY TOKEN
    const verifyToken = uuid();
    await new Token({
      token: verifyToken,
      email,
      verifyCode,
    }).save();

    //MAKE JSON VERIFY TOKEN
    const jsonVerifyToken = jwt.sign(
      {
        token: verifyToken,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8m" }
    );

    //SEND VERIFY EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: "Confirming Account",
      html: `
            <div style=width:200px; height:250px;>
                <p>Note:This Link Valid for 8 minutes</p>
                <h3>Verify Code ${verifyCode}</h3>
                <h4>Go Verify <a href=${process.env.CLIENT_URL}/verify/account/${jsonVerifyToken}>Link<a/>!<h4/>
            </div>
    `,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) throw err;
    });
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});

//VERIFY EMAIL
router.put("/verify/account/:token", async (req, res) => {
  try {
    const { verifyCode } = req.body;
    const token = req.params.token;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) return res.send({ done: false, errMsg: "Token Expired" });
        else return decoded;
      }
    );
    const verifyToken = await Token.findOne({ token: decoded.token });
    if (!verifyToken) return res.send({ done: false, errMsg: "Invalid Token" });
    const user = await User.findOne({ email: verifyToken.email });
    if (!user) return res.send({ done: false, errMsg: "Invalid Token" });

    if (user.confirmed)
      return res.send({ done: false, errMsg: "Email Already Confirmed" });

    if (verifyCode !== verifyToken.verifyCode)
      return res.send({ done: false, errMsg: "Wrong Code" });

    await User.updateOne(
      { email: verifyToken.email },
      {
        $set: {
          "confirmed": true,
        },
      }
    );
    await Token.deleteOne({ token: verifyToken.token });
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});

//EDIT ACCOUNT
router.put("/edit/account", async (req, res) => {
  try {

    //CHECK USER INFORMATIONS
    const userId = exportToken(req.cookies.token);
    const user = await User.findOne({ _id: userId });
    if (!user) return res.send({ done: false, errMsg: "Login First" });
    const { password } = req.body;

    if (!password)
      return res.send({ done: false, errMsg: "Password Required" });
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.send({ done: false, errMsg: "Invalid Password" });

    //MAKE THE QUERY
    let query = { $set: {} };
    const newUserData = _.pick(req.body, [
      "name",
      "email",
      "phone",
      "governorate",
      "address",
    ]);
    for (let key in newUserData)
      if (user[key] !== newUserData[key]) query.$set[key] = newUserData[key];

    //UPDATE USER
    await User.updateOne({ _id: userId }, query);
    res.send({ done: true });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
