require("dotenv").config();
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const { db } = require("./public/app/models/menu");
const cookieParser = require("cookie-parser");
var MongoStore = require("connect-mongo");
const passport = require("passport");
const Emitter = require("events");

const app = express();
const port = process.env.PORT || 8000;
app.use(cookieParser());
app.use(flash());

const url =
  "mongodb+srv://shivamrawat06994:5glsL70HOzInHqCo@cluster0.uehq4an.mongodb.net/pizza";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongo connected");
});

const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: MongoStore.create({ mongoUrl: url }),
  })
);
const initPassport = require("./public/app/config/passport");
const { Socket } = require("socket.io");
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.use("/public", express.static(__dirname + "/public"));

app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

const server = app.listen(port, () => {
  console.log("server started at Port http://localhost:" + port);
});

// -----------------------------------------------------------------------------------------------------

// Socket.io

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("join", (orderID) => {
    socket.join(orderID);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("OrderPlaced", (data) => {
  io.to("adminRoom").emit("OrderPlaced", data);
});
