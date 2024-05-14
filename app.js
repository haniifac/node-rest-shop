const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routers
const productsRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');

// Connect DB
mongoose.connect(
    'mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop.byfw8nl.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop',
    {
        useMongoClient: true
    }
);

// Logging Middleware
app.use(morgan('dev'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// Route incoming requests
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);


// Error Handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;