const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
const User = require('../models/user')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');




router.post("/signup", (req, res, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({

                    message: "user with this  email already existed"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash


                        });

                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: "User created"
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                })

            }
        })
        .catch();
})

router.post('/login', (req, res, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({

                    message: "Auth failed"
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        res.status(401).json({
                            message: "Auth failed"
                        });
                    }

                    if (result) {
                        var token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                            "secretKey",
                            { expiresIn: '1h' }
                        );

                        res.status(200).json({
                            message: "Auth Success",
                            token:token
                        });
                    } else {
                        res.status(401).json({
                            message: "Auth failed"
                        });
                    }


                })
            }




        })
        .catch();

});

router.delete("/:userId", (req, res, next) => {

    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Deleted"
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
})











module.exports = router;