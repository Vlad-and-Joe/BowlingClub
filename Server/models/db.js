////////////////////////////////////////////////
//                                            //
// File:   db.js                              //
// Type:   module                             //
// Author: Vladimir Hugec                     //
// Desc:   Uses sqlite3 library,              //
//         creates a DB /Server/messages.db   //
//                                            //
////////////////////////////////////////////////

const sqlite3 = require('sqlite3').verbose();

// Setting Up SQLite Database
const db = new sqlite3.Database('./database.db');

// Create messages table
db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, sender TEXT, recipient TEXT, message TEXT, group_id INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");

// Create groups table
db.run("CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, name TEXT)");
db.run("CREATE TABLE IF NOT EXISTS group_members (user_id TEXT, group_id INTEGER, FOREIGN KEY (group_id) REFERENCES groups(id))")

module.exports = db;