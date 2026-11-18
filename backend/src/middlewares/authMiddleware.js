const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

/**
 * Protect routes: verify JWT Bearer token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError('Not authorized. No token provided.', 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'hireflow_super_secret_jwt_key_2026_production_grade'
    );

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ApiError('User no longer exists.', 401));
    }

    if (user.status === 'deactivated') {
      return next(
        new ApiError('Your account has been deactivated. Please contact support.', 403)
      );
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError('Token verification failed or token expired.', 401));
  }
};

/**
 * Authorize specific roles (RBAC)
 * @param  {...string} roles - e.g. 'recruiter', 'admin'
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Access forbidden: Role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
