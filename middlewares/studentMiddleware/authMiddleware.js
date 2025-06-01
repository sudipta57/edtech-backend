import jwt from "jsonwebtoken";
const AuthMiddleware = (req, res, next) => {
  const authHeader = req.cookies.token;
  try {
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const secret = process.env.JWT_SECRET || "sudipta_2006";
    const decoded = jwt.verify(authHeader, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

export default AuthMiddleware;
