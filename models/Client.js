const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email : {
      type : String,
      
  },
  measurements : {
      type : String,
      required : true,
  }
  
});
module.exports = mongoose.model("Client", clientSchema);