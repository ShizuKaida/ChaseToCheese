const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  deviceToken: {
    type: String,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  isPremiumUser: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model("user", UserSchema);
