const express = require("express");
const router = express.Router();
const decodeToken = require("../enyaresHelper/firebaseAuth");
const Users = require("../models/User");
const jwt = require("jsonwebtoken");
const Score = require("../models/Score");
const PlayerScores = require("../models/PlayerScores");
const Premium = require("../models/Premium")



router.post("/savePlayerScore", async function (req, res, next) {
  try {
    const { userScore } = req.body;
    const token = req.headers["x-access-token"];
    const decoded = jwt.decode(token);
    const { id } = decoded;

    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const playerScore = await PlayerScores.findOne({ userId: id });

    console.log("playerScore",playerScore);
    
    if (!playerScore) {
      const newPlayerScore = new PlayerScores({
        userId: id,
        topScores: [{ score: userScore }],
      })
      const newUserScoreboard = new Score({
        userId: id,
        userScore
      });

      console.log("newUserScoreboard",newUserScoreboard);
      
      await newPlayerScore.save();//Oyuncunun kendi score unu kaydettim
      await newUserScoreboard.save();// SIKINTI BURADA 
      res.json(newPlayerScore);
    } else {
      let updatedTopScores = [...playerScore.topScores, { score: userScore }];
      updatedTopScores.sort((a, b) => b.score - a.score);
      updatedTopScores = updatedTopScores.slice(0, 5);

      playerScore.topScores = updatedTopScores;
      const updatedPlayerScore = await playerScore.save();
      

      const userScoreboard = await Score.findOne({ userId: id });
      
      if (!userScoreboard) {
        const newUserScoreboard = new Score({
          userId: id,
          userScore: Math.max(...updatedTopScores.map((item) => parseInt(item.score))),
        });
        await newUserScoreboard.save();
      } else {
        userScoreboard.userScore = Math.max(...updatedTopScores.map((item) => parseInt(item.score)));
        await userScoreboard.save();
      }

      res.json(updatedPlayerScore);
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/userScores", async function (req, res, next) {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.decode(token);
    const { id } = decoded;

    const playerScore = await PlayerScores.findOne({ userId: id });

    if (!playerScore) {
      const allScores =[]
      return res.json({ scores: allScores });
    }
    else
    {
      const allScores = playerScore.topScores.map((scoreObj) => scoreObj.score);

      res.json({ scores: allScores });

    }

    
    
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});
router.post("/buyPremiumMembership", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.decode(token);
    const { id } = decoded;

   
    const user = await Users.findOne({ id });

    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    
    if (user.isPremiumUser) {
      return res.status(400).json({ error: "Kullanici zaten premium üyedir" });
    }

    
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

  
    const premiumMembership = new Premium({
      userId: user._id,
      expiresAt: expirationDate,
    });
    await premiumMembership.save();

    
    user.isPremiumUserpremium = true;
    await user.save();

    res.json({ message: "Premium üyelik başariyla satin alindi" });
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

module.exports = router;

