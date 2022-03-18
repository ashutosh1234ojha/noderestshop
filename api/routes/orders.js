const express = require('express');
const router = express.Router();

const Order = require('../models/order')
const mongoose = require("mongoose");
const Product = require('../models/product')


router.get('/', (req, res, next) => {
    Order.find()
        .select('product _id quantity')
        .populate('product','name')
        .exec()
        .then(doc => {

            res.status(200).json({
                count: doc.length,
                orders: doc.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + order._id
                        }
                    }

                })
            })
        })
        .catch(err => {

            res.status(500).json({
                error: err
            })
        })

});

router.post('/', (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })

            return order.save()
           

        })
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Order created',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity

                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }

            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "product id not found or something went wrong",
                error: err
            })
        })



});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order=>{
        if(!order){
            res.status(404).json({
                message:'Order not found'
            })
        }
        res.status(200).json({
            order:order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'
            }
        })
    })
    .catch(err=>{
        res.status(200).json({
            error:err
        })
    })

});



router.delete('/:orderId', (req, res, next) => {
    Order.deleteOne({_id:req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"Order delted successfully",
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body:{
                    productId:"ID",
                    quantity:"Number"
                }
            }
        })
    })
    .catch(err=>{
        res.status(200).json({
            error:err
        })
    })
    // res.status(200).json({
    //     message: 'Deleted Order',
    //     id: req.params.orderId
    // })

});

module.exports = router;