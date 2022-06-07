// db
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db={};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.user = require("./user.js")(sequelize, Sequelize);
db.enroll = require("./enroll.js")(sequelize, Sequelize);

/*
const mysql = require("mysql2/promise")

const db = mysql.createConnection({
    host : "localhost", // 실제로는 mysql 외부 서버 주소 넣기
    user: 'cct',
    password: "password",
    port: 3306,
    database: mechurialdb,
    waitForConnections: true,
    insecureAuth: ture
});

db.connect();
*/
module.exports = db;