const Order = require("../../../models/order");
function adminOrderController() {
  return {
    index(req, res) {
      Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      })
        .populate("customerID", "-password")
        .exec((err, orders) => {
          if (req.xhr) {
            return res.json(orders);
          }
          return res.render("admin/orders");
        });
    },
  };
}
module.exports = adminOrderController;
