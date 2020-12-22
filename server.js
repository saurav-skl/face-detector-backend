const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
var cors = require("cors");
const knex = require("knex");
const register = require("./Control/Register.js");
const signin = require("./Control/Signin");
const profile = require("./Control/Profile");
const image = require("./Control/Image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", //localhost
    user: "postgres", //add your user name for the database here
    password: "test", //add your correct password in here
    database: "postgres", //add your database name you created here
  },
});

db.select("*")
  .from("person")
  .then((data) => {
    // console.log(data);
  });

const app = express();

app.use(cors());

app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send(db.person);
  //   console.log(database)
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(3001, () => {
  console.log("Success on port 3001");
});
