import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const getImage = (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(
    __dirname,
    "..",
    "public",
    "Media",
    "users",
    imageName
  );
  res.sendFile(imagePath);
};

export { getImage };
