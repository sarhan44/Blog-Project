// ==+==+==+==+==+==+==+==+==+==[Requirements]==+==+==+==+==+==+==+==+==+==

const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

// ==+==+==+==[Validation Functions]==+==+==+==+=
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string")
    return true;
};

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

// ==+==+==+==+==+==+==+==+==+==[Create Author]==+==+==+==+==+==+==+==+==+==

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let { fname, lname, title, email, password } = author

        if (!isValid(fname)) return res.status(400).send({ status: false, msg: "fname is Required" })

        if (!isValid(lname)) return res.status(400).send({ status: false, msg: "lname is Required" })

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is Required" })

        if (!isValidTitle(title)) return res.status(400).send({ status: false, msg: "title is not as per requirement" })

        if (!isValid(password)) return res.status(400).send({ status: false, msg: "password is Required" })

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is Invalid" })

        let Email = await authorModel.findOne( {email} )

        if (Email) return res.status(400).send({ status: false, msg: "email is already used" })

        if (author) {
            let authorCreated = await authorModel.create(author)
            res.status(201).send({ status: true, data: authorCreated, msg: "author successfully created" })
        } else res.send(400).send({ status: false,  msg: "bad request" })
    }
    catch (error) {
        console.log("Server Error:", error.message)
        res.status(500).send({ msg: "Server Error", error: error.message })
    }
}


// ==+==+==+==+==+==+==+==+==+==[Author Login]==+==+==+==+==+==+==+==+==+==

const loginAuthor = async function (req, res) {
    try {
      let data = req.body
      let { email, password } = data

      if (!email) return res.status(400).send({ status: false, msg: "Please provide email" })

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is invalid" })

        let Email = await authorModel.findOne({ email })

        if (!Email) return res.status(400).send({ status: false, msg: "email is not correct" })

        let author = await authorModel.findOne({email: email,password: password});

        if (!author)return res.status(401).send({status: false,msg: "password is not corerct"});

      // ---------[Create Token JWT]---------
      let token = jwt.sign(
        {
          authorId: author._id.toString(),
          batch: "radon",                    //payload data
          organisation: "FunctionUp",
        },
        "Radon-project-1"                    //Secret Key
        )                   
      res.setHeader("x-api-key", token);
      res.status(201).send({ status: true, token: token , msg: "Login Successfully"});
    } catch (err) {
      res.send({ msg: "error", err: err.message });
    }
  };
// ==+==+==+==+==+==+==+==+==+==[Exports]==+==+==+==+==+==+==+==+==+==

module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor