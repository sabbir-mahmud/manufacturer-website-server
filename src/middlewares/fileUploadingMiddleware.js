// imports
import fs from "fs";
import multer from "multer";

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

const uploadProductImage = multer({
  storage: productImagesStorage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

const uploadUserImage = multer({
  storage: userImagesStorage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

export { uploadProductImage, uploadUserImage };
