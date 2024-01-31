const express = require("express");

const ctrl = require("../../controllers/auth");
const schema = require("../../schemas/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  validateBody(schema.authSchema, "missing fields"),
  ctrl.register
);

router.post(
  "/login",
  validateBody(schema.authSchema, "missing fields"),
  ctrl.login
);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch("/", authenticate, ctrl.subscription);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.newAvatars
);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
  "/verify",
  validateBody(schema.emailSchema, "missing fields"),
  ctrl.verify
);

module.exports = router;
