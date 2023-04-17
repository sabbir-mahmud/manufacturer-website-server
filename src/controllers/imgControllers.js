import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// serve products images
const productImage = async (req, res) => {
  try {
    const imageName = req.params.imageName;
    const imagePath = path.join(
      __dirname,
      "uploads",
      "images",
      "products",
      imageName
    );
    return res.sendFile(imagePath);
  } catch (error) {
    return res.status(400).send({ message: "Invalid Images Routes!" });
  }
};

// serve user profile images
const userProfile = async (req, res) => {
  try {
    const imageName = req.params.imageName;
    const imagePath = path.join(
      __dirname,
      "uploads",
      "images",
      "profiles",
      imageName
    );
    res.sendFile(imagePath);
  } catch (error) {
    return res.status(400).send({ message: "Invalid Images Routes!" });
  }
};

export { productImage, userProfile };
