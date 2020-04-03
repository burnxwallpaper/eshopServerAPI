const express = require('express');
const jwt = require('jsonwebtoken')
function routes(Order, Product, Account) {
    const orderRouter = express.Router();
    let username;
    orderRouter.use(('/'), (req, res, next) => {
        let token = req.header("token")
        Account.findOne({ token: token }, (err, account) => {
            if (err) {
                return res.send(err);
            }
            if (account && account.token) {
                username = account.username;
                return next();
            }
            else return res.status(401).json("token invalid");
        });
    })

    orderRouter.route('/')
        .get((req, res) => {
            const query = username ? { username: username } : {};
            console.log(username)
            Order.find(query, (err, orderhistory) => {
                if (err) {
                    return res.send(err);
                }
                if (!orderhistory) { return res.json("") }
                console.log("get successed")
                return res.json(orderhistory);
            });
        })
        .post((req, res) => {

            let summary = {
                username: username || "notfound",
                products: [],
                date: new Date(),
                transport: req.body.transport,
                destination: req.body.destination,
            };

            let promise = new Promise(function (resolve, reject) {
                async function loop() {
                    for (const productId in req.body.shopCart) {
                        await Product.findById(productId, (err, product) => {
                            /*if (!product) {
                                return res.status(500).json("product not found")
                            }*/
                            summary.products.push(
                                {
                                    productId: productId,
                                    name: product.name,
                                    quantity: req.body.shopCart[productId],
                                    price: product.price,
                                    image: product.image,
                                }
                            )
                        })
                    }
                }
                resolve(loop())
            })
            promise.then(() => {
                const order = new Order(summary);
                order.save();
                return res.status(201).json(order);
            })
        })

    orderRouter.use('/order/:orderId', (req, res, next) => {
        Order.findById(req.params.orderId, (err, order) => {
            if (err) {
                return res.send(err);
            }
            if (order) {
                return next();
            }

            else return res.sendStatus(404);
        })
    })
    orderRouter.route('/order/:orderId')
        .get((req, res) => {
            res.json(req.order);
        })
    return orderRouter
}

module.exports = routes;