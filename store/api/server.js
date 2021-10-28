//SET UP SERVER VARS
require('dotenv').config()
const express = require('express');
const server = express();
const PORT = process.env.PORT || 5000;

//PACKAGES
const cookieParser = require('cookie-parser');
const cors = require('cors')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const helmet = require("helmet");

//CONNECT MONGO DB
mongoose.connect(process.env.DATABASE_URL , {
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

//APPLY MIDDLEWARE
server.use(cookieParser(process.env.COOKIE_PARSER_SECRET))
server.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}));

server.use(fileUpload())
server.use(express.json());
server.use(helmet())
//IMPORT ROUTRES
const register = require('./routes/register')
const login = require('./routes/login')
const user = require('./routes/user')
const cart = require('./routes/cart')
const products = require('./routes/products')
const category = require('./routes/category')
const orders = require('./routes/orders')

//HOOK UP ROUTERS
server.use('/' , register);
server.use('/' , login);
server.use('/' , user);
server.use('/' , cart);
server.use('/' , products);
server.use('/' , category);
server.use('/' , orders);

//HOOK UP THE SERVER
server.listen(PORT , (e) => {
    if (e) throw e;
    else console.log(`Server Connected on ${PORT}`);
})