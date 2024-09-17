const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const {
  isLoggedInCreate,
  isLoggedInEdit,
  isLoggedInDelete,
  isOwner,
  validateListing,
} = require("../middleware.js");

// Index route
router.get("/", wrapAsync(listingController.index));

// 1) Add new listing

// New route
router.get("/new", isLoggedInCreate, listingController.renderNewForm);

router.get('/search',wrapAsync(listingController.search));

// Create New Listing
router.post(
  "/",
  isLoggedInCreate,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.create)
);

//2) Show listing

// Show
router.get("/:id", wrapAsync(listingController.show));

//3) Edit listing

// Edit and Update

// Edit listing
router.get(
  "/:id/edit",
  isLoggedInEdit,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// Update
router.put(
  "/:id",
  isLoggedInEdit,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.update)
);

//4) Delete listing
// Delete
router.delete("/:id", isLoggedInDelete, isOwner, wrapAsync());
module.exports = router;
