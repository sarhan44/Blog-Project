// ----------[ Import All Requirements]-----------
const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const middleware = require("../middleware/auth")


//==+==+==+==+==+==+==+==+==+==[ APIs ]==+==+==+==+==+==+==+==+==+== 

// ---------[ Create Author ]-------
router.post("/authors", authorController.createAuthor);

// ---------[ Author Login ]-------
router.post("/login", authorController.loginAuthor);

// ---------[ Create Blogs ]-------
router.post("/blogs", middleware.authenticate, middleware.auth2, blogController.createBlog);

// ---------[ Get List All Blogs ]-------
router.get("/blogs",middleware.authenticate, blogController.getBlog);

// ---------[ Update Blog ]-------
router.put("/blogs/:blogId",middleware.authenticate, middleware.authorise,  blogController.updateblogs);

// ---------[ Delete By Blog Id ]-------
router.delete("/blogs/:blogId",middleware.authenticate, middleware.authorise, blogController.deleteBlog);

// ---------[ Delete By Query ]-------
router.delete("/blogs",middleware.authenticate,middleware.authorise, blogController.deleteByQuery);  



module.exports = router;
