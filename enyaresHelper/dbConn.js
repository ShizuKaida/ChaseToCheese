const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    "mongodb+srv://ShizuKaida:G6PfuJGLD6a8pTM5@cluster0.8fbhfnw.mongodb.net/"
  );
  mongoose.connection.on("open", () => {
    console.log("MongoDB: Connected");
  });
  mongoose.connection.on("error", (err) => {
    console.log("MongoDB: Not Connected");
  });
};
