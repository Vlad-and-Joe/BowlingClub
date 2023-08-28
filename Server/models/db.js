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

// Create accounts table
accounts_table_sql = "CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)"

messages_table_sql = "CREATE TABLE IF NOT EXISTS messages (\
    id INTEGER PRIMARY KEY,\
    sender_id INTEGER REFERENCES accounts(id),\
    recipient_id INTEGER REFERENCES accounts(id),\
    message TEXT NOT NULL,\
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"

group_messages_table_sql = "CREATE TABLE IF NOT EXISTS group_messages (\
    id INTEGER PRIMARY KEY,\
    sender_id INTEGER REFERENCES accounts(id),\
    group_id INTEGER REFERENCES groups(id),\
    message TEXT NOT NULL,\
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"

groups_table_sql = "CREATE TABLE IF NOT EXISTS groups (\
    id INTEGER PRIMARY KEY,\
    group_name TEXT NOT NULL UNIQUE,\
    creator_id INTEGER REFERENCES accounts(id))"

group_members_table_sql = "CREATE TABLE IF NOT EXISTS group_members (\
    group_id INTEGER REFERENCES groups(id),\
    user_id INTEGER REFERENCES accounts(id),\
    PRIMARY KEY (group_id, user_id))"


db.run(accounts_table_sql);
db.run(messages_table_sql);
db.run(group_messages_table_sql);
db.run(groups_table_sql);
db.run(group_members_table_sql);

module.exports = db;