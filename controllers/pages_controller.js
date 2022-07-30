module.exports = {
  showLoginPage: (req, res) => {
    res.render("../views/pages/login.ejs");
  },

  showRegisterPage: (req, res) => {
    res.render("../views/pages/register.ejs");
  },
};
