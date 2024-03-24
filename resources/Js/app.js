import axios from "axios";
import moment from "moment";
import Noty from "noty";
import { initAdmin } from "./admin.js";
import io from "socket.io-client";
let addToCart = document.querySelectorAll(".add_to_cart");
let cartCounter = document.querySelector(".cart-counter");
let totalAmount = document.querySelector(".amount");

function updateCart(pizza) {
  axios
    .post("/upload-cart", pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        text: "Item added to cart",
        timeout: 1000,
        progressBar: false,
        //   layout: "bottomLeft",
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        text: "Something went wrong",
        timeout: 1000,
        progressBar: false,
        //   layout: "bottomLeft",
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});
const sucessAlert = document.querySelector("#success-alert");
if (sucessAlert) {
  setTimeout(() => {
    sucessAlert.remove();
  }, 2000);
}

let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
let Order = JSON.parse(order);
let time = document.createElement("small");

function updateStatus(Order) {
  let stepCompleted = true;
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current-status");
  });

  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === Order.status) {
      stepCompleted = false;
      time.innerText = moment(Order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      Object.assign(time.style, {
        // color: "green",
        fontSize: "14px",
        float: "right",
        fontWeight: "bold",
      });
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current-status");
      }
    }
  });
}
updateStatus(Order);

let socket = io();

if (Order) {
  socket.emit("join", `order_${Order._id}`);
}
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...Order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: "success",
    text: "Order Updated",
    timeout: 1000,
    progressBar: false,
    //   layout: "bottomLeft",
  }).show();
});
