// imports
import profileModel from "../models/profileModels.js";

// get profile
const getProfile = async (req, res) => {
    try {
        const profile = await profileModel.find({ user: req.params.user });
        console.log(profile);
        return res.status(200).send(profile);
    } catch (error) {
        console.log(error);
    }
};

// create new profile
const createProfile = async (req, res) => {
    try {
        const filter = { user: req.body.user };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                user: req.body.user,
                name: req.body.name,
                avatar: `https://api.manufacturer.sabbirmahmud.com/images/profiles/${req.file.filename}`,
                bio: req.body.bio,
                address: req.body.address,
                phone: req.body.phone,
                education: req.body.education,
                linkedin: req.body.linkedin,
                github: req.body.github,
            },
        };

        let profile = await profileModel.findOneAndUpdate(
            filter,
            updateDoc,
            options
        );
        if (!profile) {
            profile = await profileModel.findOneAndUpdate(
                filter,
                updateDoc,
                options
            );
        }

        res.status(201).send(profile);
    } catch (error) {
        console.log(error);
    }
};

export { createProfile, getProfile };
