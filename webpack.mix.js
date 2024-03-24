let mix = require("laravel-mix");

mix
  .js("./resources/Js/app.js", "./public/js/app.js")
  .sass("./resources/scss/app.scss", "./public/style/app.css");
