const express = require('express');
const jwt = require('jsonwebtoken')
function routes(Order, Product) {
    const orderRouter = express.Router();

    /*orderRouter.use(('/'), (req, res, next) => {
        let token = req.get("token")
        if (req.method === "POST") { return next(); }
        Order.findOne({ token: token }, (err, order) => {
            if (err) {
                return res.send(err);
            }
            if (order && order.token) {
                req.order = order;
                return next();
            }
            else return res.status(404).json("token invalid");
        });
    })*/

    orderRouter.route('/')

        .get((req, res) => {
            /*let token = req.get("token")

            Order.findOne({ token: token }, (err, order) => {
                if (err) {
                    return res.send(err);

                }
                if (order) {
                    if (!order.admin) { return res.status(404).json("Unauthorized access"); }
                    const query = {}
                    Order.find(query, (err, order) => {
                        if (err) {
                            return res.send(err);
                        }
                        console.log("get successed")
                        return res.json(order);
                    });
                }
                else return res.status(404).json("token invalid");

            });*/


            const query = req.header("username") === null ? {} : { username: req.header("username") };
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
                username: req.header("username") || "notfound",
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
            }

            )



        })



    orderRouter.route('/create')
        .post((req, res) => {
            Order.findOne(
                {
                    username: req.body.username
                },
                function (err, user) {
                    if (err) throw err

                    if (user) {
                        return res.json({ success: false, message: 'This username is used' })
                    }
                    const order = new Order(req.body);
                    order.save();
                    return res.status(201).json(order);
                }
            )
        })
    orderRouter.use('/order/:orderId', (req, res, next) => {
        Order.findById(req.params.orderId, (err, order) => {
            if (err) {
                return res.send(err);
            }
            if (order) {
                let token = req.get("token")

                if (order.token === token) {
                    req.order = order;
                    return next();
                }
                else return res.status(404).json("token invalid");
            }

            //req.order = order;
            //return next();

            else return res.sendStatus(404);
        })
    })
    orderRouter.route('/order/:orderId')
        .get((req, res) => {
            res.json(req.order);
        })
        .put((req, res) => {
            const { order } = req;
            order.username = req.body.username
            order.password = req.body.password;
            order.admin = req.body.admin;
            order.history = req.body.history;
            order.information = req.body.information;
            order.save();

            return res.sendStatus(201);
        })
        .delete((req, res) => {
            req.order.remove((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.sendStatus(204);
            })

        })


    return orderRouter
}

module.exports = routes;