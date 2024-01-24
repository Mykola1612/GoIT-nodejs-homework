const express = require("express");

const ctrl = require("../../controllers/contacts");

const {
  validateBody,
  isValidObjectId,
  authenticate,
} = require("../../middlewares");

const schema = require("../../schemas/contacts");

const router = express.Router();

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", authenticate, isValidObjectId, ctrl.getContactById);

router.post(
  "/",
  authenticate,
  validateBody(schema.addSchema, "missing required name field"),
  ctrl.addContact
);

router.delete("/:contactId", authenticate, isValidObjectId, ctrl.removeContact);

router.put(
  "/:contactId",
  authenticate,
  isValidObjectId,
  validateBody(schema.addSchema, "missing fields"),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidObjectId,
  validateBody(schema.addFavoriteSchema, "missing field favorite"),
  ctrl.updateStatusContact
);

module.exports = router;
