const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
var knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", //this will be the address where we will host our database
    user: "shoumikh",
    password: "",
    database: "smart-brain",
  },
}); 

console.log(db.select("*").from("users"));

const app = express();

app.use(bodyParser.json());
// this middleware will prevent security issaue we face when
// accessing data of this erver from front end
// if we do not use this middleware the front end will
// give in the front end console and will not allow to
// access datas
app.use(cors());

const users = [
  {
    id: "123",
    name: "Rabin",
    email: "rabin@gmail.com",
    password: "jilla",
    entries: 0,
    joined: new Date(),
  },
  {
    id: "124",
    name: "Tanbir",
    email: "tanbir@gmail.com",
    password: "jilla",
    entries: 0,
    joined: new Date(),
  },
];

app.get("/", (req, res) => {
  res.json(users);
});

app.post("/signin", (req, res) => {
  // res.send and res.json are same only difference is res.json sends everything in json format
  bcrypt.compare(
    "jilla",
    "$2a$10$xk.svQSwnyopHt8qzm9OT./HRx8P7mCSl.mPv27cEw2SHBE6xWA8O",
    function (err, res) {
      console.log("first guess is ", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$xk.svQSwnyopHt8qzm9OT./HRx8P7mCSl.mPv27cEw2SHBE6xWA8O",
    function (err, res) {
      console.log("second guess is ", res);
    }
  );

  if (
    req.body.email === users[0].email &&
    req.body.password === users[0].password
  ) {
    res.json(users[0]);
  }
  //   else {
  //     res.status(400).json("failed");
  //   }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash("jilla", null, null, function (err, hash) {
    console.log("hash function ", hash);
  });

  users.push({
    id: "125",
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  //if we do not respond anything any click send postman will load forever as we do not have anything to respond with
  res.json(users[users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;

  users.map((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
    //here we can not use a else statement and res with something
    //if we do this
    //one the res will run to loop will stop on else
    //and will not check any further user in the array
  });

  if (found === false) {
    res.status(404).json("user is not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  users.map((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (found === false) {
    res.status(404).json("not found");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/**
  / --> res = this is working  ------
  /signin -->  POST = success/fail -----respond with successful login of fail to login
  /register --> POST = USER ------------post the information of user and create a user
  /profile/:userId --> GET = user ------this will get a profile of a user
  /image --> PUT --> user---------------this will update a variable in the user object of how many picture they uploaded
 */
