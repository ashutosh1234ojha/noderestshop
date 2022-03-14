const express = require('express');

const app = express();   //It will start the express  framework

const morgan = require('morgan'); //http logger middleware

const bodyParser = require('body-parser'); //It will help in request parsing

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://ashutosh:' +
    "qwerty1234" +
    '@cluster0.w984v.mongodb.net/mernstack?retryWrites=true&w=majority',
  
).then(() => {
    console.log("Connection success")
}).catch((err) => console.log("no connection " + err));

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false })); //type of  bodies we want to parse
app.use(bodyParser.json()); //type of  bodies we want to parse

app.use((req, res, next) => { //CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "Origin,X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTION') {
        res.header("Access-Control-Allow-Header", "PUT, POST, DELETE, GET, PATCH")
        return res.status(200).json({});
    }
    next()
})
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//If our code execution reaches here it means above routes are not able to handle it
//and we should  use error handling

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})

//To handle DB error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;