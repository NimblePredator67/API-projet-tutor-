const express = require("express")
const membre = require("../../controlleurs/membre/membre")
const auth = require("../../middleware/auth")
const router = express.Router()

router.post("/signup", membre.signup)
router.post("/login", membre.login)
router.get("/all", auth ,membre.get)

module.exports = router