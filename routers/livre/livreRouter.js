const express = require("express")
const multer = require("../../middleware/mutler_config")
const auth = require("../../middleware/auth")
const router = express.Router()

const livreControll = require("../../controlleurs/livre/livre")

router.get("/all", livreControll.getAll)

router.get("/book", livreControll.getBook)

router.get("/:id_livre", livreControll.get)

router.post("/add", multer, livreControll.post)

router.put("/modify/:id", multer, livreControll.put)

router.put("/delete/:id", livreControll.delete)

module.exports = router