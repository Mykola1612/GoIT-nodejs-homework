const mongoose = require("mongoose");
const { HttpError } = require("../helpers");

const isValidObjectId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw HttpError(400, "Invalid ID");
  }
  next();
};

module.exports = isValidObjectId;
