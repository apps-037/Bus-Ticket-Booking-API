//load express module 
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { application } = require('express');
const mysqlConnection = require('./connection');
const express = require('express');  //returns a func
//call that func 
const app = express();    //returns an obj of type express

const PeopleRoutes = require("./routes/app");

app.use(bodyParser.json());

app.use("/api", PeopleRoutes);

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(` listening on port ${port}...`));

