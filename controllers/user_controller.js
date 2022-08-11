const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const postModel = require("../models/posts");
const { name } = require("ejs");

// for image upload
const cloudinary = require("../middlewares/cloudinary_middleware");
const upload = require("../middlewares/multer_middlware");
const User = require("../models/posts");

module.exports = {
  register: async (req, res) => {
    // to add validations

    const formInput = req.body;
    // hash the password
    const hash = await bcrypt.hash(formInput.password, 10);

    try {
      await userModel.create({
        name: formInput.fullname,
        email: formInput.email,
        password: hash,
      });
    } catch (err) {
      console.log(err);
      res.send("failed to create user");
      return;
    }
    res.redirect("/pages/login");
  },

  login: async (req, res) => {
    // to add validations

    const formInput = req.body;

    let user = null;
    // get user with email from db
    try {
      user = await userModel.findOne({ email: formInput.email });
      if (!user) {
        res.send("email not registered");
      }
    } catch (err) {
      res.send(err);
      return;
    }

    // use bcrypt to compare the given password with the one store as has in DB
    const pwMatches = await bcrypt.compare(formInput.password, user.password);

    if (!pwMatches) {
      res.send("incorrect password");
      return;
    }

    // log the user in by creating a session --> using 'session' middleware
    req.session.regenerate(function (err) {
      if (err) {
        res.send("unable to regenerate session");
        return;
      }

      // if no error, store user information in session, typically a user id
      req.session.user = user.email;

      // BE send FE --> s%3A3Rw0nHcjPAg2I8JJFG9eueggeZB_IG6g.UTbF%2FcFZJ41NihFPjU6Fbr0JPRcndjtgMgZJdKIZAm0
      // FE saves as cookie
      // subsequent req. to BE --> will send cookie and BE will authenticate this

      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) {
          res.send("unable to save session");
          return;
        }
      });

      res.redirect("/users/dashboard");
    });
  },

  dashboard: async (req, res) => {
    const user = await userModel.findOne({ email: req.session.user });
    const userName = user.name;
    const userID = user._id;
    const userPosts = await postModel.find({ userId: userID });
    console.log(userPosts);
    res.render("../views/users/dashboard.ejs", { userName, userPosts });
  },

  newPost: async (req, res) => {
    //upload image to cloudinary
    let result = null;
    try {
      result = await cloudinary.uploader.upload(req.file.path);
    } catch (err) {
      console.log(err);
    }

    const formInput = req.body;

    // get user from DB
    let user = null;

    try {
      user = await userModel.findOne({ email: req.session.user });
    } catch (err) {
      console.log(err);
      res.redirect("/users/login");
      return;
    }

    // create post in DB
    try {
      await postModel.create({
        userId: user._id,
        title: formInput.title, // title of post
        longitude: formInput.longitude, // location of post
        latitude: formInput.latitude,
        placeName: formInput.placeName,
        description: formInput.description,
        imageUrl: result.secure_url,
        createdAt: formInput.date,
      });
    } catch (err) {
      console.log(err);
      res.send("failed to create post");
      return;
    }
    res.redirect("/users/dashboard");
  },

  listPosts: async (req, res) => {
    const posts = await postModel.find().exec();
    res.send(posts);
  },

  deletePost: async (req, res) => {
    const postId = req.params.post_id;
    postModel.findByIdAndRemove(postId, function (err) {
      if (err) {
        res.redirect("/users/dashboard");
      } else {
        res.redirect("/users/dashboard");
      }
    });
  },

  updatePost: async (req, res) => {
    const formInput = req.body;

    //update post in DB
    postModel.findOneAndUpdate(
      { _id: req.params.post_id },
      {
        title: formInput.title,
        description: formInput.description,
        imageUrl: formInput.imageUrl,
        createdAt: formInput.date,
        updatedAt: new Date(),
      },
      { upsert: true },
      function (err) {
        if (err) {
          res.redirect("/users/dashboard");
        } else {
          res.redirect("/users/dashboard");
        }
      }
    );
  },
};
