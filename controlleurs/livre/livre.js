let mysql = require("mysql")
let fs = require("fs")


function strRandom(o) {
    var a = 10,
        b = 'abcdefghijklmnopqrstuvwxyz',
        c = '',
        d = 0,
        e = ''+b;
    if (o) {
      if (o.startsWithLowerCase) {
        c = b[Math.floor(Math.random() * b.length)];
        d = 1;
      }
      if (o.length) {
        a = o.length;
      }
      if (o.includeUpperCase) {
        e += b.toUpperCase();
      }
      if (o.includeNumbers) {
        e += '1234567890';
      }
    }
    for (; d < a; d++) {
      c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
  }

exports.getAll = (req, res) =>{
    const connection = mysql.createConnection({
        user: "root",
        password: 'root',
        database: "bibliotheque"
    }) 

    connection.connect( (err) => {
      if(err){
        res.status(503).json({message : "database down"})
      }else{

        connection.query("SELECT id, name, author, publishing_house, imageUrl, status FROM livre", (err, result, field) =>{
            if(err){
                res.status(400).json({})
            }
            else{
                if(result.length != 0){
                    res.status(200).json(result)
                }
                else{
                    res.status(404).json({})
                }
            }
        })
      }
    })

}

exports.getBook = (req, res) =>{
  const connection = mysql.createConnection({
      user: "root",
      password: 'root',
      database: "bibliotheque"
  }) 

  connection.connect( (err) => {
    if(err){
      res.status(503).json({message : "database down"})
    }else{

      connection.query("SELECT id, name, author, publishing_house, imageUrl FROM livre WHERE status = 'available'", (err, result, field) =>{
          if(err){
              res.status(400).json({})
          }
          else{
              res.status(200).json(result)
          }
      })
    }
  })

}
exports.get = (req, res) => {
    const connection = mysql.createConnection({
        user: "root",
        password: 'root',
        database: "bibliotheque"
    }) 

    connection.connect( (err) => {
      if(err){
        res.status(503).json({message : "database down"})
      }else{

        connection.query("SELECT (copies - COUNT(reservation.id_livre)) as disponible FROM livre INNER JOIN reservation Where id_livre = id AND id = ? and reservation.date_fin > CURDATE()", [req.params.id_livre], (err, result, field) =>{
            if(err){
                res.status(400).json({})
            }
            else{
                if(result.length != 0){ 
                    res.status(200).json(result)
                }
                else{
                    res.status(404).json({})
                }
            }
        })
      }
    })
}


exports.post = (req, res) => {

    const connection = mysql.createConnection({
        user: "root",
        password: 'root',
        database: "bibliotheque"
    }) 

    connection.connect( (err) => {
      if(err){
        res.status(503).json({message : "database down"})
      }else{
        let imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}` 
        const id = strRandom({
            includeUpperCase: true,
            includeNumbers: true,
            length: 5
          })
        connection.query("INSERT INTO livre SET id = ?, name = ?, author = ?, publishing_house = ?, copies = ?, imageUrl = ?", [id, req.body.name, req.body.author, req.body.publishing_house, req.body.copies, imageUrl], (err, result, field) =>{
            if(err){
                res.status(400).json({})
            }
            else{
                if(result.length != 0){
                    res.status(200).json(result)
                }
                else{
                    res.status(404).json({})
                }
            }
        })
      }
    })
}

exports.put = (req, res) => {
    const connection = mysql.createConnection({
        user: "root",
        password: 'root',
        database: "bibliotheque"
    }) 

    connection.connect( (err) => {
      if(err){
        res.status(503).json({message : "database down"})
      }
      else{
        connection.query("SELECT imageUrl FROM livre WHERE id = ?", [req.params.id], (err, result, field) =>{
          if(err){
              console.log(err)
              res.status(400).json({message: 'erreur'})
          }
          else{
          
            if(result.length > 0){

              const filename = result[0].imageUrl.split("/images/")[1]
            
              const field = Object.keys(req.body)

              if(field.length > 0){

                  let sql = field.map( (key) => key +' = ?').join(',') // ajout des parties à modifier clé=valeur

                  let values = Object.values(req.body);

                  if(req.file){ // ajout du champ imageUrl si req.file existe 

                    sql += req.file ? ", imageUrl = ?" : ""

                    values.push(`${req.protocol}://${req.get("host")}/images/${req.file.filename}`)

                    fs.rmSync("images/" + filename);
                  }

                  connection.query("UPDATE livre SET " + sql + "  WHERE id = ?", [...values, req.params.id], (err, result, field) =>{
                      if(err){
                          console.log(err)
                          res.status(400).json({message: 'erreur'})
                      }
                      else{
                        res.status(200).json({message: "done"})
                      }
                  })
              } // s'il n'y pas de body
              else if(req.file){ // s'il n'y a pas de body qu'on a changé l'image
                connection.query("UPDATE livre SET imageUrl = ?  WHERE id = ?", [`${req.protocol}://${req.get("host")}/images/${req.file.filename}`, req.params.id], (err, result, field) =>{
                    if(err){
                        console.log(err)
                        
                        res.status(400).json({message: 'erreur'})
                    }
                    else{
                      fs.rmSync("images/" + filename);
                      res.status(200).json({message: "done"})
                    }
                })
              }
            
            } // si l'id n'existe pas
            else{
              res.status(404).json({})
            }
          }
      })
      }
    })
}

exports.delete = (req, res) => {
    const connection = mysql.createConnection({
        user: "root",
        password: 'root',
        database: "bibliotheque"
    }) 

    connection.connect( (err) => {
      if(err){
        res.status(503).json({message : "database down"})
      }else{
          connection.query("UPDATE livre SET status = ? WHERE id = ?", [req.body.status ,req.params.id], (err, result, field) =>{ // on supprime l'élément s'il existe
            if(err){
              res.status(400).json({})
            }
            else{    
              res.status(200).json({message: "done"})
          }
        })
      }
    })
} 