const Order = require("../../../models/order");
const moment = require("moment");
function orderController() {
  return {
    store(req, res) {
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "Please provide the details below!");
        return res.redirect("/cart");
      }
      const order = new Order({
        customerID: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });
      order.save().then((result) => {
        Order.populate(result, { path: "customerID" }, (err, placedOrder) => {
          req.flash("success", "Order placed successfully");
          delete req.session.cart;
          const eventEmitter = req.app.get("eventEmitter");
          eventEmitter.emit("OrderPlaced", placedOrder);

          return res.redirect("/customer/orders");
        });
      });
    },
    async index(req, res) {
      const orders = await Order.find({ customerID: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        "Cache-Control",
        "no-cache,private,no-store,must-revalidate",
        "max-stale=0,post-check=0,pre-check=0"
      );
      res.render("customers/orders", { orders: orders, moment: moment });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      if (req.user._id.toString() === order.customerID.toString()) {
        return res.render("customers/singlePage", { order });
      }
      return res.redirect("/");
    },
  };
}
module.exports = orderController;
