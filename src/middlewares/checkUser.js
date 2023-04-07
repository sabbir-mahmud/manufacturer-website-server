// import
import jwt from "jsonwebtoken";

// checking user authenticate

const verifyUser = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).send({ message: "unauthorized access" });
  } else {
    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Forbidden access" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};

export default verifyUser;
