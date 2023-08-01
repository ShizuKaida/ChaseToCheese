// models/PlayerScore.js
const mongoose = require("mongoose");

const playerScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  topScores: [
    {
      score: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("PlayerScores", playerScoreSchema);
