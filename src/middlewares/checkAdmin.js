// checking user permission admin routes
const verifyAdmin = async (req, res, next) => {
  const requester = req.decoded.email;
  const adminsCollection = await admins.findOne({ email: requester });
  if (adminsCollection?.role === "admin") {
    next();
  } else {
    res.status(403).send({ message: "forbidden" });
  }
};

export default verifyAdmin;
