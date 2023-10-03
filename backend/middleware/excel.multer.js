const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination folder where uploaded files will be stored
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage: storage });

app.use(express.static('public'));


// Endpoint for uploading a file

// const excelUploadMiddleware = async()=>{
//   upload.single('excelFile',(req,res,next)=>{
//     console.log("hello")
//     console.log(req.file)
    // if (!req.file) {
    //   return res.status(400).json({ success: false, message: 'No file uploaded.' });
    // }
  
    // console.log(req.file)
   
    // return res.status(200).json({
    //   success: true,
    //   message: 'File uploaded successfully.',
    //   filename: req.file.filename,
    // });
//   })
  
// }

const excelUploadMiddleware = (req, res, next) => {
  upload.single("excelFile")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    console.log("File uploaded successfully")
     res.status(200).json({message : "Excel File Uploaded" , status : true})
    next();
  });
};
module.exports = excelUploadMiddleware

