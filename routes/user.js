const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

/****************************** Sign Up User ***********************************************/

router.get("/signup", userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signup));

/****************************** Login User ***********************************************/

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.login
);

/***************************************Log Out *******************************************/

router.get("/logout", userController.logout);

module.exports = router;
