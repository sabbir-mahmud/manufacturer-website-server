// imports
import fs from "fs";
import multer from "multer";

// product images storage
const productImagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir("./uploads/images/products", (err) => {
      cb(null, "./uploads/images/products");
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// user profiles storage
const userImagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir("./uploads/images/profiles", (err) => {
      cb(null, "./uploads/images/profiles");
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// handle product images
const uploadProductImage = multer({
  storage: productImagesStorage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

// handle user images
const uploadUserImage = multer({
  storage: userImagesStorage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

export { uploadProductImage, uploadUserImage };
