const multer = require("multer")

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png" 
}


const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'images')
    },

    filename: function(req, file, callback){
        const name = file.originalname.split(" ").join("_")
        callback(null, name + Date.now() + "." + MIME_TYPES[file.mimetype]) 
    }

})


module.exports = multer({ storage: storage }).single("image")