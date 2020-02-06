
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;
const DB_URL = process.env.MONGODB_URI || "mongodb+srv://cheukheisiu:970204leo@cluster0-m0cdc.mongodb.net/test" || 'mongodb://localhost:27017/eshopAPI'
const db = mongoose.connect('mongodb+srv://cheukheisiu:970204leo@eshopapi-m0cdc.mongodb.net/eshopAPI?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const Product = require('./recordModel');
const productRouter = require('./recordRouter')(Product);
const Mockdata = require('../compoonent/Mockdata')

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "text/html"
    })
    next()
})
app.use('/api', productRouter);

app.get('/test', (req, res) => {
    res.send(JSON.stringify(Mockdata));
});



app.get('/', (req, res) => {
    res.send('welcome');
});



app.listen(port, () => {
    console.log(`Running on port : ${port}`);
});