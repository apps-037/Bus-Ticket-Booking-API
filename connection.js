const mysql = require('mysql');
//creating the db connection 
var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Paytm_Bus_Services",
    multipleStatements:true
});

//sql connection 
mysqlConnection.connect((err) => {
    if(!err){
        console.log("Connected");
    }
    else{
        console.log("Connection Failed");
    }
});

module.exports = mysqlConnection;