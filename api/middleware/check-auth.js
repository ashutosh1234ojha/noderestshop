var jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token= req.headers.authorization.split(" ")[1]
        // const decoded = jwt.verify(req.body.token, "secretKey")
        const decoded = jwt.verify(token, "secretKey")
        req.userData = decoded;
        next()
    } catch (error) {

        return res.status(401).json({
            message: "Auth Failed"
        })
    }

}