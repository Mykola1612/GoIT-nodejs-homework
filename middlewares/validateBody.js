const { HttpError } = require("../helpers");

const validateBody = (schema, message) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      console.log(error.details[0]);
      const spotMessage = message.concat(": ", error.details[0].message);
      next(HttpError(400, spotMessage));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
