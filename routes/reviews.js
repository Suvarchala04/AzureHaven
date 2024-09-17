const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedInCreateReview, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Reviews
// Adding a review
router.post(
  "/",
  isLoggedInCreateReview,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete reviews route
router.delete(
  "/:reviewId",
  isLoggedInCreateReview,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);
module.exports = router;
