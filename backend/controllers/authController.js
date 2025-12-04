const jwt = require("jsonwebtoken");
const users = require("../data/users.json");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "7d";

exports.login = (req, res) => {
  const { username, role, password } = req.body || {};

  if (!username || !role || !password) {
    return res.status(400).json({ error: "username, role and password are required" });
  }

  const user = users.find((u) => u.username === username && u.role === role);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      sub: String(user.id),
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
};


