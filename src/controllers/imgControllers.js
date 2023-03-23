import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const productImage = (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(
    __dirname,
    "uploads",
    "images",
    "products",
    imageName
  );
  res.sendFile(imagePath);
};

export { productImage };
