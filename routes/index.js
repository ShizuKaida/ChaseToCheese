const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

/* GET home page. */
router.post("/", function (req, res, next) {
  const payload = {
    nickname: req.body.nickname,
    id: req.body.id,
  };
  const token = jwt.sign(payload, "THIS_IS_VERY_SECRET_API_KEY", {
    expiresIn: 72000,
  });
  res.json(token);
});
module.exports = router;
