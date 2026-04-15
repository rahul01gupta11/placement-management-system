import jwt from "jsonwebtoken";

const verifyAdminToken = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "JWT_SECRET is not configured on the server." });
    }

    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Admin authorization token is required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access is required." });
    }

    req.admin = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired admin token." });
  }
};

export default verifyAdminToken;
