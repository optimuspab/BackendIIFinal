import Joi from 'joi';

const registerSchema = Joi.object({
  first_name: Joi.string().min(3).max(20).required(),
  last_name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  age: Joi.number(),
  password: Joi.string().alphanum().min(8).max(30).required(),
});

export const userValidator = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(err => ({
      field: err.context.key,
      message: err.message,
    }));
    return res.status(400).render('register', { errors: errorMessages });
  }

  next();
};

