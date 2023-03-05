// imports

import userModel from "../models/userModels";

const login_controller = async (req, res) => {
  try {
    const email = req.body.email;
    const filter = { email: email };
    const user = { email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    const data = await userModel.findOneAndUpdate(filter, updateDoc, options);
    const accessToken = jwt.sign(
      { email: email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3d",
      }
    );
    res.send({ data, accessToken });
  } catch (error) {
    console.log(error);
  }
};

export { login_controller };
