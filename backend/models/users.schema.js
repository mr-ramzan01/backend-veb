const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name"],
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide the password"],
  },
  organisation: {
    type: String,
    
  },
  industry: {
    type: String,
    
  },
  phone: {
    type: Number,
    
  },
  radio: {
    type: Boolean,
   
  },
  orgNo: {
    type: Number,
   
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "Admin",
  },
  plan : {
    type : String ,
    default : "Free & Trail"
  },
  access : {
    type : Boolean ,
    default : true
  } ,
  expiryplan : {
    type : String ,
  },
  signupBy : {type : String,enum : ["Google","Facebook","Mannual"]}
},{timestamps : true});

const Users = mongoose.models.users || mongoose.model("users", userSchema);

module.exports = Users;
