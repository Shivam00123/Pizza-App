const homeController = require("../public/app/http/controllers/homeController");
const cartController = require("../public/app/http/controllers/customers/cartController");
const authController = require("../public/app/http/controllers/authController");
const guest = require("../public/app/http/middleware/guest");
const orderController = require("../public/app/http/controllers/customers/orderController");
const auth = require("../public/app/http/middleware/auth");
const adminOrderController = require("../public/app/http/controllers/admin/orderController");
const admin = require("../public/app/http/middleware/admin");
const statusController = require("../public/app/http/controllers/admin/statusController");

function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/cart", cartController().index);

  // auth routes

  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postregister);

  // cart routes
  app.post("/upload-cart", cartController().upload);

  app.post("/logout", authController().logout);

  // order routes
  app.post("/orders", auth, orderController().store);
  app.get("/customer/orders", auth, orderController().index);
  app.get("/customer/orders/:id", auth, orderController().show);

  // admin routes
  app.get("/admin/orders", admin, adminOrderController().index);

  // realtime order /admin/order/status
  app.post("/admin/order/status", admin, statusController().update);
}

module.exports = initRoutes;
