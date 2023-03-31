// imports
import contactModel from "../models/contactModels.js";

// create contact
const createContact = async (req, res) => {
  try {
    const contact = new contactModel({
      email: req.body.email,
      phone: req.body.phone,
      msg: req.body.msg,
    });
    await contact.validate();
    await contact.save();
    return res.status(201).send(contact);
  } catch (error) {
    console.log(error);
  }
};

export { createContact };
