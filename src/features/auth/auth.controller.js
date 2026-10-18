
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const { signupSchema, loginSchema } = require('./auth.validation');

const sendValidationError = (res, result) => {
  return res.status(400).json({
    success: false,
    message: 'Invalid request data',
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join('.') || 'request',
      message: issue.message
    }))
  });
};

const register = async (req, res, next) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return sendValidationError(res, result);
    }

    const { username, email, password } = result.data;
    const normalizedUsername = username.toLowerCase();

    const exists = await User.exists({
      $or: [
        { username: normalizedUsername },
        { email }
      ]
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Username or email is already registered'
      });
    }

    const user = await User.create({
      username: normalizedUsername,
      email,
      password
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return sendValidationError(res, result);
    }

    const { username, email, password } = result.data;

    const user = await User.findOne(
      email
        ? { email }
        : { username: username.toLowerCase() }
    ).select('+password');

    const isValid = user
      ? await user.verifyPassword(password)
      : false;

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username, email, or password'
      });
    }

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      token_type: 'Bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
