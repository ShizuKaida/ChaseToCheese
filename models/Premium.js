const mongoose = require("mongoose");

const premiumSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiresAt: {
    type: Date,
  },
});


module.exports = mongoose.model("Premium", premiumSchema);
