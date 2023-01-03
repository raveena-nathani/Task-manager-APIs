//To run the mongodb server
///Users/Raveena_Nathani/mongodb/bin/mongod --dbpath=/Users/Raveena_Nathani/mongodb-data

const mongodb = require("mongodb"); //native driver created by mongodb company to connect node.js to mongodb
const MongoClient = mongodb.MongoClient; // gives the access to the function necessary to connect to the database.
const ObjectId = mongodb.ObjectId;


const databaseName = "task-manager";

MongoClient.connect(process.env.CONNECTION_URL,{useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log("Unable to connect to database!")
    }

    //console.log("Connected correctly!")
    const db = client.db(databaseName);

    //insertOne is asynchronous 
    // db.collection('users').insertOne({
    //     name:"Raveena",
    //     age: 26
    // }, (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert user.")
    //     }

    //      console.log(result.ops); //prints the documents in the database
    // })


    // db.collection('users').insertMany(
    //     [
    //         {
    //             name:"Jen",
    //             age: 26
    //         },
    //         {
    //             name: "Bhavi",
    //             age: 22
    //         }
    //     ], 
    //     (error, result) => {

    //         if(error){
    //             return console.log("Unable to insert documents.")
    //         }
    //         //console.log(result.ops); //prints the documents in the database
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: "Read a book",
    //         completed: true
    //     },
    //     {
    //         description: "Clean the kitchen",
    //         completed: true
    //     },
    //     {
    //         description: "Run an errand",
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert tasks.");
    //     }
    // })

    // db.collection('users').findOne({
    //     _id: ObjectId("63aaec6e1457c3834665a91d"),
    // }, (error, user) => {
    //     if(error){
    //         return console.log("Unable to fetch!");
    //     }

    //     console.log(user);
    // })

    // db.collection('users').find({
    //     age: 26,
    // }).toArray((error, users) => {
    //     if(error){
    //         return console.log("Unable to fetch!");
    //     }
    //     console.log(users);
    // })

    // const update = db.collection('users').updateOne({
    //     _id: new ObjectId("63aae70622a25dc7b72d0430")
    // },{
    //     $set: {
    //         name: 'Mike2'
    //     },
    //     $inc: {
    //         age: 5
    //     }
    // });

    // update.then(result => {
    //     console.log(result);
    // })
    // .catch((error) => {
    //     console.log(error);
    // })
})