
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/eshopAPI'
const db = mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const Product = require('./recordModel');
const Account = require('./accountModel');
const Order = require('./orderModel');
const productRouter = require('./recordRouter')(Product);
const accountRouter = require('./accountRouter')(Account);
const orderRouter = require('./orderRouter')(Order, Product);
const Mockdata = require('../compoonent/Mockdata')

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
        //"Content-Type": "text/html"
    })
    next()
})




app.use('/api', productRouter);

app.use('/authentication', accountRouter);

app.use('/order', orderRouter);

app.get('/test', (req, res) => {
    res.send(JSON.stringify(Mockdata));
});



app.get('/', (req, res) => {
    res.send('welcome');
});



app.listen(port, () => {
    console.log(`Running on port : ${port}`);
});