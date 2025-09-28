import userModel from "../models/userModels.js";

// checking user permission admin routes
const verifyAdmin = async (req, res, next) => {
    const requester = req.decoded?.email;
    const user = await userModel.findOne({ email: requester });
    console.log(user);

    if (user?.is_admin) {
        next();
    } else {
        res.status(403).send({ message: "forbidden" });
    }
};

export default verifyAdmin;
