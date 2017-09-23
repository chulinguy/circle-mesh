var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MeshSchema = new Schema({
  meshname: {
    type: String,
    unique: true,
    required: true
  },
  
  	users: []
});

var Mesh = mongoose.model("Mesh", MeshSchema);
module.exports = Mesh;