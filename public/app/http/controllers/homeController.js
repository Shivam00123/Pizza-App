const menuModel = require("../../models/menu");

function homeController() {
  return {
    index(req, res) {
      menuModel.find((err, data) => {
        if (data) {
          res.render("home", { pizzas: data });
        } else {
          console.log(err);
        }
      });
    },
  };
}

module.exports = homeController;
