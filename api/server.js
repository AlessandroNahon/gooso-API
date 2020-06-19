import express from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
// import { createProxyMiddleware } from "http-proxy-middleware";

import routes from "./router";

// const options = {
//   target: "http://localhost:3000",
//   changeOrigin: true,
// };

// const proxy = createProxyMiddleware("/api", options);

const app = express();

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;

require("./config/auth.js")(passport, LocalStrategy, JWTStrategy);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(routes);

const port = process.env.PORT || 4200;

app.listen(port, () => console.log(`Listening on port ${port}`));
