var mysql = require('mysql');
var dbconfig = require('../dbconfig/config');
require('dotenv').config()

// Database setup
//var pool = mysql.createPool(dbconfig.connection.connection);

var pool  = mysql.createPool({
  //connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASS,
  database        : process.env.DB_NAME
});
pool.getConnection(function(err, conn) {

  console.log("Err => ",err);

  conn.query('USE ' + dbconfig.database, function() {
    conn.release();
  });
});
// Returns a connection to the db
var getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
    if(!err){console.log("test");}
    callback(err, conn);
  });
};

// Helper function for querying the db; releases the db connection
// callback(err, rows)
var query = function(queryString, params, callback) {
  getConnection(function(err, conn) {
    conn.query(queryString, params, function(err, rows) {
      conn.release();

      if (err)
        return callback(err);

      return callback(err, rows);
    });
  });
};

exports.query = query;