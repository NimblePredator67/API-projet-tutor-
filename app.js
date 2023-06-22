const express = require("express");
const path = require("path")
const membreRouter = require("./routers/membre/membreRouter")
const bibliothecaireRouter = require("./routers/bibliothecaire/bibliothecaireRouter")
const livreRouter = require("./routers/livre/livreRouter")
const reservationRouter = require("./routers/reservation/reservation")
let app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
app.use(express.json())

app.use("/membre", membreRouter)
app.use("/bibliothecaire", bibliothecaireRouter)
app.use("/livre", livreRouter)
app.use("/reservation", reservationRouter)
app.use("/images", express.static(path.join(__dirname, "images")))

module.exports = app