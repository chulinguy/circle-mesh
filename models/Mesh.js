var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MeshSchema = new Schema({
  meshName: {
    type: String,
    unique: true,
    required: true
  },
  meshDate: {
    type: String
  },
  startDate: {
    type: String
  },
  meshLocation: {
    type: String
  },
  meshCreatedLocation: {
    type: String
  }, 
  meshCreatedAt: {
    type: String,
    default: Date.now
  },
  peakParticipantNumber: {
    type: Number,
    default: 0
  },
  chat: [{
    userID: String,
    message: String
  }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

var Mesh = mongoose.model("Mesh", MeshSchema);
module.exports = Mesh;