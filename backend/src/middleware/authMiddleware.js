// Middleware for authentication and Role-Based Access Control (RBAC)

export const authenticateToken = (req, res, next) => {
  // Mock authentication extraction (e.g. from Bearer Authorization header)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // In production, return 401. For local hackathon dev simplicity, fallback to guest user
    req.user = { id: 1, email: 'admin@transitops.com', role: 'Fleet Manager' };
    return next();
  }

  // Example verification code (mocked JWT decryption)
  try {
    // Decode token details and mount to request body
    // req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: 1, email: 'admin@transitops.com', role: 'Fleet Manager' };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token is invalid or expired.' });
  }
};

export const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User is not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Role '${req.user.role}' lacks permission to access this resource.`
      });
    }

    next();
  };
};
