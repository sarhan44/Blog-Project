const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
   fname: {type: String, required: true},

   lname: {type: String, required: true},

   title: {type: String, enum: ["Mr", "Mrs", "Miss"], required: true},

   email: {
      type: String, required: true, unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/] 
   },

   password: {type: String, required: true}

}, { timestamps: true })

module.exports = mongoose.model('Author', authorSchema)