const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

module.exports = function allowedRoles(...roles) {
  return (req, res, next) => {
    // Prefer Bearer token; fall back to legacy headers for backward compatibility
    const authHeader = req.headers["authorization"];
    let userFromToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userFromToken = {
          username: decoded.username,
          role: decoded.role
        };
      } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    }

    const username = userFromToken?.username || req.headers["x-username"];
    const role = userFromToken?.role || req.headers["x-role"];

    if (!username || !role) {
      return res.status(401).json({ error: "Missing authentication" });
    }

    req.user = username;

    if (!roles.includes(role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};
