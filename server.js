//libraries?
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

//for image upload
const cloudinary = require("./middlewares/cloudinary_middleware");
const upload = require("./middlewares/multer_middlware");
const User = require("./models/posts");

// linking from other files
const userController = require("./controllers/user_controller");
const pagesController = require("./controllers/pages_controller");
const authMiddleware = require("./middlewares/auth_middlewares");

const app = express();
const port = process.env.PORT || 3000;
const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@marcuscluster1.mj37dyq.mongodb.net/?retryWrites=true&w=majority`;

// set view engine
app.set("view engine", "ejs");

// apply middleware
// this middleware is for converting form response to json
app.use(express.urlencoded({ extended: true }));
// need this middleware for delete and update on forms - refer to documentation for ejs format
app.use(methodOverride("_method"));
// this middleware is for creating a session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false, maxAge: 7200000 },
  })
);
app.use(authMiddleware.setAuthUserVar);
app.use(express.static("public"));

//routes
//default route
app.get("/", (req, res) => {
  res.send("Working!");
});
//get routes
app.get("/pages/login", pagesController.showLoginPage);
app.get("/pages/register", pagesController.showRegisterPage);
app.get(
  "/users/dashboard",
  authMiddleware.isAuthenticated,
  userController.dashboard
);
app.get("/users/post", userController.listPosts);
//post routes
app.post("/pages/register", userController.register);
app.post("/pages/login", userController.login);
app.post("/users/post", upload.single("image"), userController.newPost);
//delete route
app.delete("/users/post/:post_id", userController.deletePost);
//update route
app.put("/users/post/:post_id", userController.updatePost);

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
