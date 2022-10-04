import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  PORT_API: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  REFRESH_JWT_SECRET: Joi.string().required(),
  EXPIRES_IN: Joi.number().required(),
  REFRESH_EXPIRES_IN: Joi.number().required(),
});