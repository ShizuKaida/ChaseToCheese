const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  nickname: {
    type: String,
    unique: true,
  },
   isPremiumUser: {
    type: Boolean,
  },
  userScore: {
    type : Number
  },
  userId : {
    type : mongoose.Types.ObjectId
  }
});

module.exports = mongoose.model("userScoreBoard", ScoreSchema);
