const express = require("express");

const ctrl = require("../../controllers/contacts");

const { validateBody, isValidObjectId } = require("../../middlewares");

const schema = require("../../schemas/contacts");

const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:contactId", isValidObjectId, ctrl.getContactById);

router.post(
  "/",
  validateBody(schema.addSchema, "missing required name field"),
  ctrl.addContact
);

router.delete("/:contactId", isValidObjectId, ctrl.removeContact);

router.put(
  "/:contactId",
  isValidObjectId,
  validateBody(schema.addSchema, "missing fields"),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidObjectId,
  validateBody(schema.addFavoriteSchema, "missing field favorite"),
  ctrl.updateStatusContact
);

module.exports = router;
