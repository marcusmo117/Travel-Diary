const userModel = require("../models/users");

module.exports = {
  register: async (req, res) => {
    const formInput = req.body;
    try {
      await userModel.create({
        name: formInput.fullname,
        email: formInput.email,
        password: formInput.password,
      });
    } catch (err) {
      console.log(err);
      res.send("failed to create user");
      return;
    }
    res.redirect("/pages/login");
  },
};
