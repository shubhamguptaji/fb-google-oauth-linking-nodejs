const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.mongousername}:${process.env.mongopassword}@${
      process.env.mongoname
    }.mongodb.net/test?retryWrites=true`,
    // "mongodb://localhost:27017/test"
    {
      useNewUrlParser: true
    }
  )
  .catch(err => console.log(err));

mongoose.set("useCreateIndex", true);

mongoose.connection.on("connected", () => console.log("MongoDB connected"));

mongoose.connection.on("error", err => console.log("Error connecting to MongoDB" + err));

mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));
