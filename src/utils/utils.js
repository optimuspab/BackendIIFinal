import bcrypt from "bcrypt";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

export const createResponse = (req, res, statusCode, data, error = null) => {
  return res.status(statusCode).json({
    data,
    status: statusCode,
    error,
    path: req.url,
  });
};

