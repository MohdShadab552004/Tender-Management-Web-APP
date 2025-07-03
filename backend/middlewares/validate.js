// middlewares/validate.js
import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // modifies req.body with parsed (safe) data
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    return res.status(500).json({ error: "Internal validation error" });
  }
};
