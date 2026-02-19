import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized! Login Again"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token"
    });
  }
};

export default isAuthenticated;
