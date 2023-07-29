const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token =
    req.headers["x-access-token"] || req.body.token || req.query.token;

  if (token) {
    jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.status(401).json({
            msg: "Oturum Süresi Doldu",
            detail: "",
          });
        } else {
          res.status(401).json({
            msg: "Geçersiz Token",
            detail: "",
          });
        }
      } else {
        req.decode = decoded;

        const payload = {
          nickname: decoded.nickname,
          id: decoded.id,
          isPremiumUser: decoded.isPremiumUser,
        };
        const newToken = jwt.sign(payload, process.env.API_SECRET_KEY, {
          expiresIn: 72000,
        });
        res.set("x-access-token", newToken);

        next();
      }
    });
  } else {
    res.status(401).json({
      msg: "Token Bulunamadı",
      detail: "",
    });
  }
};
