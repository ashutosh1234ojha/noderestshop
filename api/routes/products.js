const express = require('express');
const router = express.Router();
const multer = require("multer");

const checkAuth = require('../middleware/check-auth')
const ProductsControllers = require('../controllers/products')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {

        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {

        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    }, fileFilter: fileFilter
})


router.get('/',ProductsControllers.products_get_all );

router.get('/:productId',ProductsControllers.products_get_product );

router.post('/', checkAuth, upload.single('productImage'),ProductsControllers.products_create_product );

router.patch('/:productId', checkAuth, ProductsControllers.products_update_product);


router.delete('/:productId', checkAuth, ProductsControllers.products_delete_product);

module.exports = router;