const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const postModel = require("../models/posts");

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

  dashboard: (req, res) => {
    res.render("../views/users/dashboard.ejs");
  },

  newPost: async (req, res) => {
    const formInput = req.body;
    console.log(formInput);

    // try {
    //   await postModel.create({
    //     userId: req.session.user,
    //     location: null, //for time being
    //     description: formInput.email,
    //     password: hash,
    //   });
    // } catch (err) {
    //   console.log(err);
    //   res.send("failed to create user");
    //   return;
    // }
    res.redirect("/users/dashboard");
  },
};
