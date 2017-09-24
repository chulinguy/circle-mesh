var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  photo: {
    type: String,
    unique: true
  },
  job: {
    type: String
  },
  linkedinURL: {
    type: String,
    unique: true,
  },
	messagesSent: {
    type: Number,
    default: 0
  }, 
  linkedinClickd: {
    type: Number,
    default: 0
  }, 
  	meshCreated: {
    type: Number,
    default: 0
  }, 
  	meshJoined: {
    type: Number,
    default: 0
  }
});

var User = mongoose.model("User", UserSchema);
module.exports = User;