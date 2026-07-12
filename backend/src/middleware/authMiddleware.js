import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_dev_secret');
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export const authMiddleware = authenticateToken;

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role_name;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: `Access Denied: Role '${userRole}' lacks permission to access this resource.` });
    }
    next();
  };
};