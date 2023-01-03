const express = require("express");
require('./db/mongoose'); //it means run this file


const usersRouter = require("./routers/users");
const tasksRouter = require("./routers/tasks");
 
const app = express();

const port = process.env.PORT;

//parse incoming JSON as an object so that it can be acccessible in request handlers
app.use(express.json());  
app.use(usersRouter);
app.use(tasksRouter);

//without middleware -> new request - run route handler
//with middleware -> new request - do something - run route handler

app.listen(port, () => {
    console.log("Server is up on port:", port)
})
