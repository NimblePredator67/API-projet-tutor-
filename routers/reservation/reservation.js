const express = require("express");
const router = express.Router();
const connectMembre = require("../../middleware/connect_membre")
const connectBibliothecaire = require("../../middleware/connect_bibliothecaire")
const reservation = require("../../controlleurs/reservation/reservation");
const auth = require("../../middleware/auth");

router.get("/all", connectBibliothecaire, reservation.all)

// router.get("/:num", )

// router.get("/byStat/:state", )

// router.get("/byLibrarian/:id", )

router.get("/byMember",  auth, connectMembre, reservation.byMembre)

// router.get("/byBook/:id", )

//router.get("/byDeadline/:date", )

//router.get("/byStartDate/:date" , )

router.put("/modify/state/:num", auth, connectBibliothecaire, reservation.modifyState)

// router.put("modify/deadline/:date", )

// router.put("modify/startDate/:date", )

router.post("/do", auth, connectBibliothecaire, reservation.add)


module.exports = router