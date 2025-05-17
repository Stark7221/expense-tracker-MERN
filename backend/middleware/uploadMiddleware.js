const multer = require('multer');

//configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // specify the filename format
  }
});

//filefilter
const fileFilter = (req, file, cb) => {
 const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
 if (allowedTypes.includes(file.mimetype)) {
   cb(null, true); // accept the file
 } else {
   cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and PDF files are allowed.'), false); // reject the file
 }}

 const upload = multer({
    storage, fileFilter
 });

 module.exports = upload;