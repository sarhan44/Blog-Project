// ==+==+==+==+==+==+==+==+==+==[Imports]==+==+==+==+==+==+==+==+==+==

const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { default: mongoose, isValidObjectId } = require("mongoose");

// ==+==+==+==[Validation Functions]==+==+==+==+=

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "string")
    return true;
};
const isValidBody = function (body) {
  return Object.keys(body).length > 0
}
const isValidAuthorId = function (ObjectId) {  
  return mongoose.Types.ObjectId.isValid(ObjectId)
}



// ==+==+==+==+==+==+==+==+==+==[Create Blogs]==+==+==+==+==+==+==+==+==+==

let createBlog = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide data to Create" })

    let { authorId, body, title, tags, category, subcategory } = data

    if (!title) return res.status(400).send({ status: false, msg: "title Is required" });

    if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is Invalid" })

    let Title = await blogModel.findOne({ title })

    if (Title) return res.status(400).send({ status: false, msg: "Title has been already used please choose diffrent" })
    
    if (!body) return res.status(400).send({ status: false, msg: "Body is required" });

    if (!authorId) return res.status(400).send({ status: false, msg: "Please provide Author Id" });

    if (!isValidAuthorId(authorId)) return res.status(400).send({ status: false, msg: "Please provide Valid Author Id" });

    let authorData = await authorModel.findById(authorId);

    if (!authorData) return res.status(404).send({ status: false, msg: "Author Id not found!" });

    const token = req.authorId
    if (token !== data.authorId) res.status(403).send({ status: false, msg: "you cannot create other users blogs please provide your author ID" });

    if (!isValid(authorId)) return res.status(400).send("Please provide Author Id");

    if (!isValidAuthorId(authorId)) return res.status(400).send({ status: false, msg: `${authorId} is not valid authorId` })


    if (!isValid(body)) return res.status(400).send({ status: false, msg: "body cannot be number" })

    if (!tags) return res.status(400).send({ status: false, msg: "tags Is required" });

    if (!category) return res.status(400).send({ status: false, msg: "category Is required" });

    if (!isValid(category)) return res.status(400).send({ status: false, msg: "Category is Invalid" })

    if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory Is required" });

    if (data.isPublished == true) { $set: { data.publishedAt = new Date() } }


    let savedData = await blogModel.create(data);
    res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}; 
// ==+==+==+==+==+==+==+==+==+==[Get Blogs List]==+==+==+==+==+==+==+==+==+==

let getBlog = async function (req, res) {
  try {
    let filterBlog = req.query;
    if (!filterBlog) return res.status(404).send({ status: false, msg: "please set query" })
    let data = await blogModel.find({
      $and: [{ isDeleted: false, isPublished: true }, filterBlog],
    });
    if (data.length === 0) return res.status(404).send({ status: false, msg: "Blog not found! " });

    res.status(200).send({ status: true, msg: data });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// ==+==+==+==+==+==+==+==+==+==[Update Blogs]==+==+==+==+==+==+==+==+==+==


const updateblogs = async function (req, res) {
  try {
    let data = req.body;
    let blogId = req.params.blogId;
    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ status: false, msg: "Incorrect Blog Id format" })

    if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "input can't be empty" });

    let checkBlog = await blogModel.findById(blogId);

    if (!checkBlog) return res.status(404).send({ status: false, msg: "Blog Not Found" });

    const token = req.authorId
    if (token !== checkBlog.authorId.toString()) res.status(401).send({ status: false, msg: "unauthorised" });


    if (checkBlog.isDeleted == true) return res.status(400).send({ status: false, msg: "This blog is already Deleted" });


    let update = await blogModel.findByIdAndUpdate(blogId, { $push: { tags: data.tags, subcategory: data.subcategory }, title: data.title, body: data.body, isPublished: data.isPublished, }, { new: true });

    if (data.isPublished == true) { $set: { update.publishedAt = new Date() } }


    res.status(200).send({ status: true, message: "Blog update is successful", data: update });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// ==+==+==+==+==+==+==+==+==+==[ Delete Blogs By Id ]==+==+==+==+==+==+==+==+==+==

let deleteBlog = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ status: false, msg: "Incorrect Blog Id format" })

    let checkBlog = await blogModel.findById(blogId);

    if (!checkBlog) return res.status(404).send({ status: false, msg: "Blog Not Found" });

    const token = req.authorId
    if (token !== checkBlog.authorId.toString()) res.status(401).send({ status: false, msg: "unauthorised" });

    if (checkBlog.isDeleted == true)
      return res.status(400).send({ status: false, msg: "This blog is already Deleted" });

    let deleteBlog = await blogModel.findOneAndUpdate(
      { _id: checkBlog },
      { isDeleted: true, deletedAt: Date() },
      { new: true }
    );
    res.status(200).send({ status: true, data: deleteBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// ==+==+==+==+==+==+==+==+==+==[ Delete Blogs By Query ]==+==+==+==+==+==+==+==+==+==

let deleteByQuery = async (req, res) => {

  try {
    const queryParams = req.query

    const blog = await blogModel.find({ ...queryParams, isDeleted: false })

    // Checking authorisation on each document inside blog & pushing the id of all those documents which pass authorisation inside arr

    let arr = []
    blog.forEach((ele, index) => {
      if (req.authorId == ele.authorId.toString()) arr.push(ele._id)
    })

    const deletedBlog = await blogModel.updateMany({ _id: arr }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

    if (deletedBlog.modifiedCount == 0) return res.status(404).send({ status: false, msg: "Blog doesn't Exist" })

    return res.status(200).send({ status: true, data: `Number of documents deleted : ${deletedBlog.modifiedCount}` })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


// ==+==+==+==+==+==+==+==+==+==[ Exports ]==+==+==+==+==+==+==+==+==+==

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateblogs = updateblogs;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteByQuery = deleteByQuery;
