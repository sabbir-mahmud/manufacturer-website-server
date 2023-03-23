// imports
import reviewModel from "../models/reviewModel.js";

// get all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find();
    return res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// create review
const createReview = async (req, res) => {
  try {
    const review = new reviewModel({
      name: req.body.name,
      img: req.body.img,
      bio: req.body.bio,
      location: req.body.location,
      starts: req.body.starts,
      review: req.body.review,
    });

    await review.validate();
    await review.save();
    return res.status(201).send(review);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export { createReview, getReviews };
