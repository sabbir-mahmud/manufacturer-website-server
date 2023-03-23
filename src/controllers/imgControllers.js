import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const productImage = (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "..", "public", imageName);
  console.log(imagePath);
  res.sendFile(imagePath);
};

export { productImage };
