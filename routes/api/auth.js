const express = require("express");

const ctrl = require("../../controllers/auth");
const schema = require("../../schemas/auth");
const { validateBody, authenticate } = require("../../middlewares");

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

module.exports = router;
