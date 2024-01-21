const express = require("express");

const ctrl = require("../../controllers/auth");
const schema = require("../../schemas/auth");
const { validateBody } = require("../../middlewares");

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

module.exports = router;
