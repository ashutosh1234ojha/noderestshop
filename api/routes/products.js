const express = require('express');
const router = express.Router();

const Product = require('../models/product')
const mongoose = require("mongoose");


router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc.length > 0) {
                res.status(200).json(doc)

            } else {
                res.status(404).json({ message: "no  entry found" })

            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId

    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({ message: "Id not found" })
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

});

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price

    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: product
        })
    })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        });


});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, {
        $set: updateOps
    }).exec()
    .then(doc=>{
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    })

});


router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId

    Product.remove({ _id: id })
        .exec()
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

});

module.exports = router;