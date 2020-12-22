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
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// db.select("*")
//   .from("person")
//   .then((data) => {
//     // console.log(data);
//   });

const app = express();

app.use(cors());

app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("Its Working" + (db.person));
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

app.post("/imageUrl", (req, res) => {
  image.handleApi(req, res);
});

// app.listen(3001, () => {
//   console.log("Success on port 3001");
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
console.log('app is running on port '+ port);
app.listen(port);
