const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;   // use env variable in production

// create token
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    SECRET,
    { expiresIn: "1d" }
  );
};

// verify token middleware
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};
