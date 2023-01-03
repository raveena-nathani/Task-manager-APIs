const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: { //connect tasks with logged in user
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})
//mongoose takes the model name in lowercase and pluralizes it
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;




//Example 1

// const newTask = new Task({
//     description:'Read a book',
//     completed: true
// })

// newTask.save().then(task => {
//     console.log(task)
// }).catch(error => console.log("Error", error))




//Example 2

// const newTask1 = new Task({
//     description:'Clean the kitchen    ',
// })

// newTask1.save().then(task => {
//     console.log(task)
// }).catch(error => console.log("Error", error))