const mysql = require('mysql');
require('dotenv').config()

const databaseClient = mysql.createConnection({
    database:"s12938_FelipeDB",
    host: "161.97.78.70",
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASSWORD
});

databaseClient.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
  });

module.exports = {
    databaseClient
}
