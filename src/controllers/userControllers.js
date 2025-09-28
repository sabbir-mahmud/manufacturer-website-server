// imports
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

// get all user: admin route
const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).send(users);
    } catch (error) {
        console.log(error);
    }
};

// make someone admin: admin route
const makeAdmin = async (req, res) => {
    try {
        const user = await userModel.find({ email: req.params.email });

        if (user) {
            user[0].is_admin = true;
            await user[0].save();
            return res.status(200).send(user);
        }
    } catch (error) {
        console.log(error);
    }
};

// delete user
const deleteUser = async (req, res) => {
    try {
        const result = await userModel.findByIdAndDelete(req.params.id);
        console.log(result);
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
    }
};

// login
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

// user details route
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

export { deleteUser, getUsers, login_controller, makeAdmin, userDetails };
