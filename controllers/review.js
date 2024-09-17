const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(id);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
