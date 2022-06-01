const mysql = require("mysql");

const db = mysql.createConnection({
  host: "34.64.119.28",
  user: "root",
  password: "password!",
  port: 80,
  database: "dbs",
});
db.connect();
module.exports = db;
