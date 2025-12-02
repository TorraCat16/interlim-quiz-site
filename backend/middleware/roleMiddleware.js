module.exports = function allowedRoles(...roles) {
  return (req, res, next) => {
    const user = req.headers["x-username"];

    if (!user) {
      return res.status(401).json({ error: "Missing user header" });
    }

    req.user = user;

    if (!roles.includes(req.headers["x-role"])) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};
