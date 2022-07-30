//libraries?
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// linking from other files
const userController = require("./controllers/user_controller");
const pagesController = require("./controllers/pages_controller");
const exp = require("constants");

const app = express();
const port = 3000;
const connStr =
  "mongodb+srv://marcusmo:oAd8hk511aEXKw5w@marcuscluster1.mj37dyq.mongodb.net/?retryWrites=true&w=majority";

// set view engine
app.set("view engine", "ejs");

// apply middleware
// this middleware is for converting form response to json
app.use(express.urlencoded({ extended: true }));
// need this middleware for delete and update on forms - refer to documentation for ejs format
app.use(methodOverride("_method"));

//routes
//default route
app.get("/", (req, res) => {
  res.send("Working!");
});
app.get("/pages/login", pagesController.showLoginPage);
app.get("/pages/register", pagesController.showRegisterPage);
app.post("/pages/register", userController.register);
app.post("/pages/login", userController.login);

// to show that app is running
app.listen(port, async () => {
  //connecting to DB
  try {
    await mongoose.connect(connStr, { dbName: "travel_diary" });
  } catch (err) {
    console.log(`Failed to connect to DB`);
    process.exit(1);
  }

  console.log(`listening on local port ${port}`);
});
