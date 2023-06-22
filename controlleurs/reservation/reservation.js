
exports.all = (req, res) =>{
    req.body.connection.query("SELECT num, date_debut, date_fin, reservation.status, userName, name FROM reservation INNER JOIN membre ON id_membre = membre.id INNER JOIN livre ON id_livre = livre.id ", (err, result, field) =>{
        if(err){
            res.status(404).json({})
        }
        else{
            res.status(200).json(result)
        }
   })
} 

exports.byNum = (req, res) =>{
    req.body.connection.query("SELECT * FROM reservation WHERE num= ?", [req.params.num], (err, result, field) =>{
        if(err){
            res.status(404).json({})
        }
        else{
            res.status(200).json(result)
        }
   })
} 

exports.byState = (req, res) =>{
    req.body.connection.query("SELECT * FROM reservation WHERE etat= ?", [req.params.state], (err, result, field) =>{
        if(err){
            res.status(404).json({})
        }
        else{
            res.status(200).json(result)
        }
   })
} 

exports.byLibrarian = (req, res) =>{
    req.body.connection.query("SELECT * FROM reservation WHERE id_bibliothecaire= ?", [req.params.id], (err, result, field) =>{
        if(err){
            res.status(404).json({})
        }
        else{
            res.status(200).json(result)
        }
   })
} 

exports.byMembre = (req, res) =>{
    req.body.connection.query("SELECT name, date_debut, date_fin FROM reservation INNER JOIN livre WHERE reservation.id_membre = ? and reservation.id_livre = livre.id", [req.body.id], (err, result, field) =>{
        if(err){
            
            res.status(404).json({})
        }
        else{
            res.status(200).json(result)
        }
   })
} 

exports.byBook = (req, res) =>{
    req.body.connection.query("SELECT * FROM reservation WHERE id_livre= ?", [req.params.id], (err, result, field) =>{
        if(err){
            res.status(404).json({})
        }
        else{
            res.status(200).json(result)
        }
   })
}

exports.modifyState = (req, res) =>{
    req.body.connection.query("SELECT num FROM reservation WHERE num= ?", [req.params.num], (err, result, field) =>{
        if(err){
            res.status(404).json({})
        }
        else{
            if(result.length != 0){

                req.body.connection.query("UPDATE reservation SET status = ?  WHERE num = ?", [req.body.status , req.params.num], (err, result, field) =>{
                if(err){
                    console.log(err)
                    res.status(400).json({message: 'erreur'})
                }
                else{
                res.status(200).json({message: "done"})
                }
                    })
            }
        }
   })
} 

exports.modifyDeadline = (req, res) =>{
    req.body.connection.query("SELECT num FROM reservation WHERE num= ?", [req.params.num], (err, result, field) =>{
        if(err){
            res.status(404).json({})
        }
        else{
            if(result.length != 0){

                req.body.connection.query("UPDATE reservation SET date_fin = ?  WHERE num = ?", [req.body.date , req.params.num], (err, result, field) =>{
                if(err){
                    console.log(err)
                    res.status(400).json({message: 'erreur'})
                }
                else{
                res.status(200).json({message: "done"})
                }
                    })
            }
        }
   })
}

exports.modifyStartDate = (req, res) =>{
    req.body.connection.query("SELECT num FROM reservation WHERE num= ?", [req.params.num], (err, result, field) =>{
        if(err){
            res.status(404).json({})
        }
        else{
            if(result.length != 0){

                req.body.connection.query("UPDATE reservation SET date_debut = ?  WHERE num = ?", [req.body.date , req.params.num], (err, result, field) =>{
                if(err){
                    console.log(err)
                    res.status(400).json({message: 'erreur'})
                }
                else{
                res.status(200).json({message: "done"})
                }
                    })
            }
        }
   })
}

exports.add = (req, res) =>{
    const start = new Date(req.body.date_debut)
    const end = new Date(req.body.date_fin)

    if(start - Date.now() > 0 && end > start){
        req.body.connection.query("SELECT copies - COUNT(reservation.id_livre) as disponible FROM livre INNER JOIN reservation WHERE id_livre = id AND id = ?", [req.body.id_livre], (err, result, field) =>{
            if(err){
                res.status(400).json(err)
            }
            else{
                if(result[0].disponible > 0){
                    req.body.connection.query("INSERT INTO reservation SET id_membre = ?, id_livre = ?, id_bibliothecaire = ?, date_debut = ?, date_fin = ?", [req.body.id, req.body.id_livre, req.body.id_bibliothecaire, req.body.date_debut, req.body.date_fin], (err, result, field) =>{
                                if(err){
                                    res.status(400).json(err)
                                }
                                else{
                                    res.status(201).json({message: "reservation confirmer"})
                                }
                        })
                }
                else{
                    res.status(400).json({})
                }

            }
        })
    }else{
        res.status(400).json({})
    }
    
}