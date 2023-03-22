// imports
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

const login_controller = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({
        message: "nun fill errors! please check your email",
      });
    }
    const filter = { email: email };
    const user = { email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    let data = await userModel.findOneAndUpdate(filter, updateDoc, options);
    if (!data) {
      data = await userModel.findOneAndUpdate(filter, updateDoc, options);
    }
    console.log(data);
    const accessToken = jwt.sign(
      { email: email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3d",
      }
    );
    return res.status(200).json({ data, accessToken });
  } catch (error) {
    console.log(error);
  }
};

const userDetails = async (req, res) => {
  try {
    const user = await userModel.find({ email: req.query.email });
    return res.status(200).json({
      message: user[0] ? user[0].is_admin : false,
    });
  } catch (error) {
    console.log(error);
  }
};

export { login_controller, userDetails };
