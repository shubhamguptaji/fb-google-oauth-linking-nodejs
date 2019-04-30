const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  local: {
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: String,
    Name: String
  },
  facebook: {
    id: String,
    token: String,
    Name: String,
    email: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    Name: String
  }
});

module.exports = mongoose.model("User", UserSchema);
