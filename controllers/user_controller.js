const userModel = require("../models/users");
const bcrypt = require("bcrypt");

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

    res.send("good!");
  },
};
