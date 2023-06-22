let mysql = require("mysql")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")

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
  
exports.signup = (req, res) => {

    const connection = mysql.createConnection({
        user: "root",
        password: 'root',
        database: "bibliotheque"
    });

    connection.connect((err) =>{ // verifie si on est conneté à la base
        if(err){
            res.status(503).json({message: "database down"})
        }
        else{ // Quand on est connecté
            
            connection.query("SELECT login FROM bibliothecaire where = ?", [req.body.login], (err, result, field) =>{
                if(err){
                    res.status(500).json({})
                }
                else{
                    if(result.length === 0){
                        bcrypt.hash(req.body.password, 5).then(hash =>{ // on hash le mot de passe
                            const id = strRandom({
                                includeUpperCase: true,
                                includeNumbers: true,
                                length: 5
                            })
                            let user = [req.body.id, req.body.login, req.body.userName, hash] // value of the placeholder 
                            const sql = "INSERT INTO bibliothecaire SET id = ?, login = ?, userName = ?, password = ?" 
                            
                            connection.query(sql, user , (err, result, field) => { // la lance la requête
                                if(err){
                                    if(err.code === 'ER_DATA_TOO_LONG'){
                                        err.sqlMessage.includes("userName") ? res.status(400).json({message: "user name too long"}) 
                                        : res.status(400).json({message: "login too long"}) 
                                    }
                                    else{
                                        res.status(400).json({message: "erreur"})
                                    }
                                }
                                else{
                                    res.status(201).json({message : "success"})
                                }
                            })
                        
                        
                        }).catch(err =>{
                            console.log(err)
                            res.status(400).json(err)
                        })
                    }
                    else{
                        res.status(400).json({message: "login unavailable"})
                    }
                }
            })
                
            }
        })
   
}


exports.login = (req, res) => {
    const connection = mysql.createConnection({
        user: "root",
        password: 'root',
        database: "bibliotheque"
    });

    connection.connect((err) =>{ // verifie si on est conneté à la base
        if(err){
            res.status(503).json({message: "database down"})
        }
        else{ // Quand on est connecté

            connection.query("SELECT * FROM bibliothecaire WHERE login = ?", req.body.login, (err, result, field) =>{
                if(err){
                    res.status(400).json({})
                }
                else{

                    if(result.length != 0){ // si le login existe on verifie le mot de passe
                        bcrypt.compare(req.body.password, result[0].password)
                        .then(valide => {
                            if(valide){
                                res.status(200).json({
                                   token: jwt.sign({id: result[0].id}, "RAMDOM_SECRET_KEY", {expiresIn: '12h'})
                                })
                            }else{
                                res.status(401).json({message: "login ou mot de passe incorrect"})
                            }
                        })
                        .catch(err =>{
                            res.status(500).json({message: "erreur"})
                        })
                    }
                    else{
                        res.status(401).json({message: "login ou mot de passe incorrect"})
                    }
                }
            } )
            
        }
    })
}


exports.valid = (req, res) =>{

    let token = req.headers.authorization.split(' ')[1]
    
    try {
        let decoded = jwt.verify(token, "RAMDOM_SECRET_KEY")
        res.status(200).json({message: "valid"})
    } catch (error) {
        console.log(error)
        res.status(401).json({message: "invalide token"})
    }

}