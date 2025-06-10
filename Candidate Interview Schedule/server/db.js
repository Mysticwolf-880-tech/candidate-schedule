const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
});

db.connect((err) => {
  if (err) {
    console.error("Database not connected:", err.message);
    process.exit(1);
  }

  console.log("Connected to MySQL Database");

  db.query("CREATE DATABASE IF NOT EXISTS candidate_interviews", (err) => {
    if (err) {
      console.error("Database creation error:", err.message);
      process.exit(1);
    }

    db.changeUser({ database: "candidate_interviews" }, (err) => {
      if (err) {
        console.error("Database switch error:", err.message);
        process.exit(1);
      }
      console.log("Using 'candidate_interviews' database");
    });
  });
});

module.exports = db;
