//libraries?
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
// const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

// linking from other files
const userController = require("./controllers/user_controller");
const pagesController = require("./controllers/pages_controller");
const authMiddleware = require("./middlewares/auth_middlewares");

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
// this middleware is for creating a session
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false, maxAge: 7200000 },
  })
);
app.use(authMiddleware.setAuthUserVar);

//routes
//default route
app.get("/", (req, res) => {
  res.send("Working!");
});
app.get("/pages/login", pagesController.showLoginPage);
app.get(
  "/pages/register",
  authMiddleware.isAuthenticated,
  pagesController.showRegisterPage
);
app.post("/pages/register", userController.register);
app.post("/pages/login", userController.login);
app.get(
  "/users/dashboard",
  authMiddleware.isAuthenticated,
  userController.dashboard
);
app.post("/users/post", userController.newPost);

//mapbox (doesnt work)
// mapboxgl.accessToken =
// "pk.eyJ1IjoibW93aXBlIiwiYSI6ImNsNmM5OTZ5cjF2dm0zaXA0ejQ2bXFpaHYifQ.-nQwU8ydtMSSBHoO5h0U2w";
// const map = new mapboxgl.Map({
// container: "map",
// style: "mapbox://styles/mapbox/streets-v11",
// });

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
