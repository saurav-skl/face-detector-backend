const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
var cors = require("cors");
const knex = require("knex");

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

const saltRounds = 10;

const app = express();

app.use(cors());

app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send(db.person);
  //   console.log(database)
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("person")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  // console.log(password);
  const hash = bcrypt.hashSync(password, 10);
  // console.log(email,hash);
  db.transaction((trx) => {
    trx
      .insert(
        {
          hash: hash,
          email: email,
        },
        "id"
      )
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        // console.log(loginEmail[0]);
        return trx("person")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then((user) => {
            console.log(user);
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json(err + "   unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("person")
    .where({
      id: id,
    })
    .then((user) => {
      // console.log(user);
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("person")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to take entries"));
});

app.listen(3001, () => {
  console.log("Success on port 3001");
});
