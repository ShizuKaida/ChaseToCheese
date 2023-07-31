const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
 
  userScore: {
    type : Number
  },
  userId : {
    type : mongoose.Types.ObjectId
  }
});

module.exports = mongoose.model("Score", ScoreSchema);
