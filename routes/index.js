const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

/* GET home page. */
router.post("/", function (req, res, next) {
  const payload = {
    nickname: req.body.nickname,
    id: req.body.id,
  };
  const token = jwt.sign(payload, req.app.get("api_secret_key"), {
    expiresIn: 72000,
  });
  res.json(token);
});
module.exports = router;
