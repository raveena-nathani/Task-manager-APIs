//keep the server running: 
// /Users/Raveena_Nathani/mongodb/bin/mongod --dbpath=/Users/Raveena_Nathani/mongodb-data

const mongoose = require('mongoose');
//mongoose helps to provide validation

const validator = require('validator'); //npm library for validation

//task-manager-api is database name
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    autoIndex: true,
} )
