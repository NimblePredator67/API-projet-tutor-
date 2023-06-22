const express = require("express")
const router = express.Router();
const biblioControlleur = require("../../controlleurs/bibliothecaire/bibliothecaire")

router.post("/signup", biblioControlleur.signup)
router.post("/login", biblioControlleur.login)
router.post("/validToken", biblioControlleur.valid)

module.exports = router