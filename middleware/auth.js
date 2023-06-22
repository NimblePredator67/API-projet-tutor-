let jwt = require("jsonwebtoken")

module.exports = (req, res, next) =>{
    let token = req.headers.authorization.split(' ')[1]
    try {
        let decoded = jwt.verify(token, "RAMDOM_SECRET_KEY")
        req.body.id = decoded.id

        next()
    } catch (error) {
        res.status(401).json({message: "invalide token"})
    }
}