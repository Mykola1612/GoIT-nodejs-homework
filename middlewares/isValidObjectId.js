const mongoose = require("mongoose");

const isValidObjectId = (req, res, next) => {
  const { contactId } = req.params;
  const func = (req, res, next) => {
    if (!mongoose.isValidObjectId(contactId)) {
      return null;
    }
    next();
  };
  return func;
};

module.exports = isValidObjectId;
