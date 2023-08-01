const express = require("express");
const router = express.Router();
const decodeToken = require("../enyaresHelper/firebaseAuth");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Score = require("../models/Score");
const { default: mongoose } = require("mongoose");
require('dotenv').config()


router.get("/", function (req, res, next) {
  res.json("ok");
});

router.post("/loginOrRegister", async function (req, res, next) {
  try {
    const { token } = req.body;
    const decoded = await decodeToken.decodeToken(token);
    if (decoded == -1) return res.status(401).json({ msg: "Unauthorized" });
    console.log(decoded);
    const { email, name } = decoded;
    let payload;
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = User({
        nickname: name,
        email,
      });
      const newUserRes = await newUser.save();
      payload = { nickname: newUserRes?.nickname, id: newUserRes?._id, isPremiumUser: newUserRes?.isPremiumUser };
    } else {
      payload = { nickname: user?.nickname, id: user?._id, isPremiumUser: user?.isPremiumUser };
    }
    console.log(payload);
    const tokenRes = await jwt.sign(payload, "THIS_IS_VERY_SECRET_API_KEY", {
      expiresIn: 72000,
    });
    return res.json({ token: tokenRes });
  } catch (err) {
    console.error(err);
    return res.json(err);
  }
});
router.get("/freeLeaderboard", async function (req, res, next) {
  try {
    
    const leaderboard = await Score.find().sort({ userScore: -1 }).limit(10);
    const simplifiedLeaderboard = leaderboard.map((player) => {
      return {
        userScore: player.userScore,
        nickname: player.nickname
      };
    });

    res.json(simplifiedLeaderboard);
  } catch (err) {
    res.json(err);
  }
});
router.get("/premiumLeaderboard", async function (req, res, next) {
  try {
    
    const premiumUsers = await User.find({ isPremiumUser: true });

    
    const premiumUserIds = premiumUsers.map(user => user._id);

   
    const leaderboard = await Score.find({ userId: { $in: premiumUserIds } })
      .sort({ userScore: -1 })
      .limit(10);

    console.log("Çitki kontrol", leaderboard);

    const simplifiedLeaderboard = leaderboard.map((player) => {
      return {
        userScore: player.userScore,
        nickname: player.nickname,
      };
    });

    res.json(simplifiedLeaderboard);
  } catch (err) {
    res.json(err);
  }
});
router.get("/checkPremiumMembership", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.decode(token);
    const { id } = decoded;

    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ error: "Kullanici bulunamadi" });
    }

    const premiumMembership = await Premium.findOne({ userId: user._id });

    if (!premiumMembership || premiumMembership.expiresAt < new Date()) {
      // Premium üyelik yok veya süresi dolmuşsa
      // isPremiumUser alanını false yaparak kullanıcının premium üyeliğini iptal ediyoruz
      user.isPremiumUser = false;
      await user.save();

      return res.json({ isPremium: false });
    }

    // Premium üyelik var ve süresi dolmamışsa
    res.json({ isPremium: true, expirationDate: premiumMembership.expiresAt });
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});
module.exports = router;
