
const mongoose = require("mongoose");

const Product = require('../models/product')


exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc.length > 0) {

                const response = {
                    count: doc.length,
                    products: doc.map(item => {
                        return {
                            name: item.name,
                            price: item.price,
                            productImage: item.productImage,
                            _id: item._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + item._id
                            }

                        }
                    })
                }
                res.status(200).json(response)

            } else {
                res.status(404).json({ message: "no  entry found" })

            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
};

exports.products_get_product=(req, res, next) => {
    const id = req.params.productId

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {

                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'To get all products',
                        url: 'http://localhost:3000/products/'
                    }

                })
            } else {
                res.status(404).json({ message: "Id not found" })
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

};

exports.products_create_product=(req, res, next) => {

    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path

    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created Product Successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }

            }
        })
    })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        });


};

exports.products_update_product=(req, res, next) => {
    const id = req.params.productId

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, {
        $set: updateOps
    }).exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: 'Product updated successfully',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })

};

exports.products_delete_product=(req, res, next) => {
    const id = req.params.productId

    Product.deleteOne({ _id: id })
        .exec()
        .then(doc => {
            res.status(200).json({
                message: 'Product deleted successfully',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + id,
                    data: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

};