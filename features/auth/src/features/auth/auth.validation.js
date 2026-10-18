
const { z } = require('zod');

const signupSchema = z.strictObject({
  username: z.string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),

  email: z.email().trim().toLowerCase(),

  password: z.string()
    .min(8)
    .max(72)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
});

const loginSchema = z.strictObject({
  username: z.string().trim().optional(),
  email: z.email().trim().toLowerCase().optional(),
  password: z.string().min(1)
}).refine(
  (data) => Boolean(data.username || data.email),
  { message: 'Username or email is required' }
);

module.exports = {
  signupSchema,
  loginSchema
};
