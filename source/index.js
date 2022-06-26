// ==+==+==+==+==+==+==+==+==+==[Requirements]==+==+==+==+==+==+==+==+==+==
const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==+==+==+==+==+==+==+==+==+==[Connect DataBase]==+==+==+==+==+==+==+==+==+==
mongoose
  .connect(
    "mongodb+srv://sarhank44:sarhank8299@sarhancluster.fxjt3wn.mongodb.net/blogProject",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected You are Ready To Goo buddy!"))
  .catch((err) => console.log(err.message));

  
app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Yuhoo! Express app is running on port " + (process.env.PORT || 3000));
});
