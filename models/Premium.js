<<<<<<< HEAD
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
=======
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
>>>>>>> bcca3cebb0743b7bb7f6ff3ca181da7b39e84e82
