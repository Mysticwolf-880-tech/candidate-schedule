

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const tokenFromCookie = req.cookies?.token;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "mySecretKey");
    req.user = decoded;
    console.log(req.user);
    
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(403).json({ message: "Invalid token" });
  }
}
module.exports = { authenticateToken };