const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
var cors = require('cors')

const saltRounds = 10;

const app = express();

app.use(cors());

app.use(bodyparser.json());

const database = {
  users: [
    {
      id: "121",
      name: "ram",
      email: "ram12@gmail.com",
      password: "ram121",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "122",
      name: "shyam",
      email: "shyam12@gmail.com",
      password: "shyamam121",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john12@gmail.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
  //   console.log(database)
});

app.post("/signin", (req, res) => {

//   bcrypt.compare(
//     "subham123",
//     "$2b$10$tcmEbWltq6a61OAuqTH.1.CGukq0GLEmT9jC8AqoHQshD/mVUeZgm",
//     function (err, result) {
//       console.log("first ", res);
//     }
//   );
//   bcrypt.compare(
//     "hello",
//     "$2b$10$tcmEbWltq6a61OAuqTH.1.CGukq0GLEmT9jC8AqoHQshD/mVUeZgm",
//     function (err, result) {
//       console.log("Second ", res);
//     }
//   );
  if (
    req.body.email === database.users.email &&
    req.body.password === database.users[0].password
  ) {
    res.json("Success");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: "123",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("User Not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("user not found");
  }
});

app.listen(3001, () => {
  console.log("Success on port 3001");
});
