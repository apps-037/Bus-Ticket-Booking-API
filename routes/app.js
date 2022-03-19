const express = require('express'); 
const mysqlConnection = require('../connection');
const mysql = require('mysql');
const app = express.Router();    //returns an obj of type express
const bcrypt = require('bcrypt');

//this app has various methods like get put post delete
//http get req takes 2 args ----1. path 2. callback func that has 2 args req,res 
//the callback func has various properties 
app.get('/', (req,res) => {
    mysqlConnection.query("SELECT * from buses", (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
});

//add a new user 
app.post('/adduser', async (req,res) => {

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.pswrd,10);

    const sqlSearch = "SELECT * FROM users WHERE email = ?"
    const search_query = mysql.format(sqlSearch,[email])
    const sqlInsert = "INSERT INTO users VALUES (0,?,?,?,?)"
    const insert_query = mysql.format(sqlInsert,[email, fname, lname, hashedPassword])

    // let sql = 'INSERT INTO users SET ?'
    // let post = {
    //     email: req.body.email,
    //     first_name : req.body.fname,
    //     last_name: req.body.lname,
    //     password: req.body.pswrd,
    // }

    await mysqlConnection.query(search_query, async (err, result) => {
        if (err) throw (err)
            console.log("------> Search Results")
            console.log(result.length)
        if (result.length != 0) {
           // mysqlConnection.release()
            console.log("------> User already exists")
            res.sendStatus(409) 
            } 

            else {
                await mysqlConnection.query (insert_query, (err, result)=> {
              //  mysqlConnection.release()
                if (err) throw (err)
                console.log ("--------> Created new User")
                console.log(result.insertId)
                res.sendStatus(201)
               })
              }
    });
  });

//login authenticate the user 
app.post('/loginuser', async (req, res)=> {
    const email = req.body.email;
    const password = req.body.pswrd;
     const sqlSearch = "Select * from users where email = ?"
     const search_query = mysql.format(sqlSearch,[email])
     await mysqlConnection.query (search_query, async (err, result) => {
     // connection.release()
      
      if (err) throw (err)
      if (result.length == 0) {
       console.log("--------> User does not exist")
       res.sendStatus(404)
      } 
      else {
         const hashedPassword = result[0].password
         //get the hashedPassword from result
        if (await bcrypt.compare(password, hashedPassword)) {
        console.log("---------> Login Successful")
        res.send(`${email} is logged in!`)
        } 
        else {
        console.log("---------> Password Incorrect")
        res.send("Password incorrect!")
        } //end of bcrypt.compare()
      }//end of User exists i.e. results.length==0
     }) //end of connection.query()
  
    }); //end of app.post()

//add a new bus 
app.post('/addbus', (req,res) => {
    let sql = 'INSERT INTO bus SET ?'
    let post = {
        number_plate: req.body.nplate,
        manufacturer : req.body.mfact,
        model: req.body.model,
        year: req.body.year,
        capacity: req.body.capacity
    }

    mysqlConnection.query(sql, post, (err, rows) => {
        if(!err){
                    res.send(rows);
                }
                else{
                    console.log(err);
                }
        console.log('success');
       // console.log(res);
    });
});

//get all users
app.get('/getallusers', (req,res) => {
    mysqlConnection.query("SELECT * from users", (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
});

//get all buses
app.get('/getallbus', (req,res) => {
    mysqlConnection.query("SELECT * from bus", (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
});

//add a trip
app.post('/addtrip', (req,res) => {
    let sql = 'INSERT INTO trip SET ?'
    let post = {
        bus_id: req.body.bid,
        origin : req.body.origin,
        destination: req.body.dest,
        trip_date: req.body.tdate,
        fare: req.body.fare,
        status: req.body.status
    }

    mysqlConnection.query(sql, post, (err, rows) => {
        if(!err){
                    res.send(rows);
                }
                else{
                    console.log(err);
                }
        console.log('success');
       // console.log(res);
    });
});

//get all trips
app.get('/getalltrips', (req,res) => {
    mysqlConnection.query("SELECT * from trip", (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
});

//cancel a trip -----> putting the status as 0 instead of 1
app.put('/deletetrip/:id', (req,res) => {
    console.log(req.params);
    mysqlConnection.query('UPDATE `trip` SET `status`=0.00 WHERE `id`=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
	});
})

//filter trip by origin and dest
app.get('/tripbyorigin/:origin/:dest', (req,res) => {
    console.log(req.params.origin + req.params.dest);
    mysqlConnection.query("SELECT * from `trip` WHERE `origin`=? AND `destination`=?",[req.params.origin, req.params.dest], (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
});

//add a booking
app.post('/addbooking', (req,res) => {
    let sql = 'INSERT INTO booking SET ?'
    let post = {
        trip_id: req.body.tid,
        user_id : req.body.uid,
        bus_id: req.body.bid,
        trip_date: req.body.tdate,
        seat_number: req.body.sno,
        first_name: req.body.fname,
        last_name: req.body.lname,
        email: req.body.email
    }

    mysqlConnection.query(sql, post, (err, rows) => {
        if(!err){
                    res.send(rows);
                }
                else{
                    console.log(err);
                }
        console.log('success');
       // console.log(res);
    });
});

//get all bookings
app.get('/getallbookings', (req,res) => {
    mysqlConnection.query("SELECT * from booking", (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
});

//just a demo
app.get('/routes', (req,res) => {
    mysqlConnection.query("INSERT INTO buses (name, from_city, to_city) VALUES ('LIMOLINER', 'Jaipur', 'Delhi')", (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    }) 
})

module.exports = app;