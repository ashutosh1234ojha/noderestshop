const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /Orders'
    })
});

router.post('/', (req, res, next) => {
    const order={
        productId:req.body.productId,
        quantity:req.body.quantity
    }
    res.status(201).json({
        message: 'Handling POST requests to /Orders',
        order:order
    })
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    if(id==='special'){
        res.status(200).json({
            message: 'you discovered a special Id',
            id:id
        })
    }else{
        res.status(200).json({
            message: 'You passed an Id'
        })
    }
  
});



router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted Order',
        id:req.params.orderId
    })
  
});

module.exports = router;