const mysql = require("mysql")

module.exports = (req, res, next) => {
    const connection = mysql.createConnection({
        user: "root",
        password: 'root',
        database: "bibliotheque"
    }) 

    connection.connect( err => {
      if(err){
        res.status(503).json({ message: "database down"}) 
      }
      else{
        req.body.connection = connection
        next()
      } 
    })
}