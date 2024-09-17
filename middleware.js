const Listing = require('./models/listing');
const Review = require('./models/review');
const { listingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedInCreate = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; 
    req.flash("error", "Please login to create listing!");
    return res.redirect("/login");
  }
  next();
};
module.exports.isLoggedInEdit = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login to edit or update listing!");
    return res.redirect("/login");
  }
  next();
};
module.exports.isLoggedInDelete = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login to delete listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner=async (req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
    if(!(res.locals.currUser && res.locals.currUser._id.equals(listing.owner._id))){
      req.flash("error","You don't have permission to edit or delete");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

//**********************Reviews Middlewares******************************

module.exports.isLoggedInCreateReview = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; 
    req.flash("error", "Please login to create or delete Review!");
    return res.redirect("/login");
  }
  next();
};
module.exports.isReviewAuthor=async (req,res,next)=>{
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
    if(!(res.locals.currUser && res.locals.currUser._id.equals(review.author._id))){
      req.flash("error","You don't have permission to delete the Review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};