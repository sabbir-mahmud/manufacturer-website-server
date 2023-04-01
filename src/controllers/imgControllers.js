import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// serve products images
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
    console.log(error);
  }
};

export { productImage, userProfile };
