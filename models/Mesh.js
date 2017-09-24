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
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

var Mesh = mongoose.model("Mesh", MeshSchema);
module.exports = Mesh;