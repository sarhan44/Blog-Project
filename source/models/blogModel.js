const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId   //For Reference 

//==+==+==+==+==+==+==+==+==+==[ Schema ]==+==+==+==+==+==+==+==+==+==

const blogSchema = new mongoose.Schema({

    title: {type: String, required: true},

    body: {type: String, required: true},

    authorId: {type: ObjectId, required: true, ref: 'Author'},

    tags: [{type: String, required: true}],

    category: {type: String, required: true},

    subcategory: [{type: String, required: true}],

    deletedAt: {type: Date},

    isDeleted: {type: Boolean, default: false},

    publishedAt: {type: Date},

    isPublished: {type: Boolean, default: false,}

}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema) // Its provides an interface to DB for CRUD.