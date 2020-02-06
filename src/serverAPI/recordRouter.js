const express = require('express');

function routes(Product) {
    const productRouter = express.Router();
    productRouter.route('/product')

        .get((req, res) => {
            const query = {}
            Product.find(query, (err, products) => {
                if (err) {
                    return res.send(err);
                }
                console.log("get successed")
                return res.json(products);
            });
        })
        .post((req, res) => {
            const product = new Product(req.body);
            product.save();
            return res.status(201).json(product);
        });
    productRouter.use('/product/:productId', (req, res, next) => {
        Product.findById(req.params.productId, (err, product) => {
            if (err) {
                return res.send(err);
            }
            if (product) {
                req.product = product;
                return next();
            }
            return res.sendStatus(404);
        });
    })
    productRouter.route('/product/:productId')
        .get((req, res) => {
            res.json(req.product);
        })
        .put((req, res) => {
            const { product } = req;
            product.name = req.body.name
            product.category = req.body.category;
            product.price = req.body.price;
            product.save();
            return res.sendStatus(201);
        })
        .delete((req, res) => {
            req.product.remove((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.sendStatus(204);
            })

        })


    return productRouter
}

module.exports = routes;