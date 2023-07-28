const admin = require("../config/firebase-config");
class Middleware {
  async decodeToken(token) {
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        return decodeValue;
      }
    } catch (e) {
      return -1;
    }
  }
}
module.exports = new Middleware();
