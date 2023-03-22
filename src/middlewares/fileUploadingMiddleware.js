// imports
import fs from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    fs.mkdir("./uploads/images", (err) => {
      console.log("error", err);
      cb(null, "./uploads/images");
    });
  },
  filename: function (req, file, cb) {
    console.log(file);
    // cb(null, file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Set the directory where uploaded files will be stored
//     cb(null, "public/Media/products/");
//   },
//   filename: function (req, file, cb) {
//     // Set the name of the uploaded file
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

export { upload };
