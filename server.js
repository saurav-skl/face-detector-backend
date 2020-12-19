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

db.select('*').from('person').then(data =>{
  // console.log(data);
});

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
      password: "shyam121",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(db.users);
  //   console.log(database)
});

app.post("/signin", (req, res) => {
  let found = false;
  database.users.forEach((user) => {
    if (user.email === req.body.email && user.password === req.body.password) {
      found = true;
      res.json(user);
    }
  });
  if (found === false) {
    res.status(400).json("error logging in!");
  }
  // if (
  //   req.body.email === database.users[0].email &&
  //   req.body.password === database.users[0].password
  // ) {
  //   res.json("success");
  // } else {
  //   res.status(400).json("error logging in");
  // }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db('person')
  .returning('*')
  .insert({
    email:email,
    name:name,
    joined:new Date()
  }).then(user => {
    res.json(user[0]);
  })
  .catch(err => res.status(400).json('unable to regster'))
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select('*').from('person').where({
    id:id
  })
  .then(user =>{
    // console.log(user);
    if(user.length){
      res.json(user[0])
    }
    else{
      res.status(400).json('Not found')
    }
  })
  .catch(err => res.status(400).json('error getting user'))
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  
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
