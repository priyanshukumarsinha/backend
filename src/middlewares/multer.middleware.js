import multer from 'multer'

// we can store the file in diskstorage as well as memorystorage
// but we will store it in diskStorage only, since there can be big video files also

// From the DOCS 
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })
//   const upload = multer({ storage: storage })


const storage = multer.diskStorage({
    destination : function(req, file, cb){
        // cb takes error : Error | Null and destination
        cb(null, "./public/temp")
    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
    }
})


export const upload = multer({
    storage,
})
