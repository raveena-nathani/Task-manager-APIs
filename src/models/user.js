const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//mongoose helps to provide validation

const validator = require('validator'); //npm library for validation

const jwt = require("jsonwebtoken");

const Task = require('../models/task');

//helps to set up middleware
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, //built in validator
        trim: true //trimming value before saving
    },
    age: {
        type: Number,
        default: 0,
        validate(val){ //custom validator
            if(val < 0){
                throw new Error("Age must be a positive number")
            }
        }
    },
    email: {
        type: String,
        unique: true, //not working
        trim: true,
        required: true,
        lowercase: true, //setting value to lowercase before saving
        validate(val){
            if(!validator.isEmail(val)){
                 throw new Error('Email is unvalid!');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minLength: 7,
        validate(val){
            if(val.toLowerCase().includes('password')){
                throw new Error("Password should not contain 'password");
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar: {
        type: Buffer 
    }
}, {
    timestamps: true
});

//tasks is a virtual property in user which isn't stored in database but has a relationship of user with tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

//userSchema.methods to set methods on instances
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});
    await user.save(); //save the token to database
    return token;
}

//userSchema.statics to set methods on the model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to login");
    }

    return user;
}

//Hash the plain text password before saving
userSchema.pre('save',  async function(next){
    const user = this;
    if(user.isModified('password') ){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

//delete the tasks when user is removed
userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})

//first argument name of the model, second is for fields
//User is model
const User = mongoose.model('User', userSchema );

module.exports = User;



//Example 1
//model instance
/*const me = new User({
    name: 'Raveena',
    age: 26
})

//to save model instances on database
me.save().then((me) => {
    console.log(me);
}).catch(error => {
    console.log("Error", error);
})*/


//Example:2

// const newUser = new User({
//     name: 'Mike',
//     age: -1
// })

// newUser.save().then((me) => {
//     console.log(me);
// }).catch(error => {
//     console.log("Error", error);
// })


//Example 3

// const newUser1 = new User({
//     name: 'Bhavi',
//     email: "   Bhavika@gmail.com ",
//     password: " bhavi123"
// })

// newUser1.save().then((me) => {
//     console.log(me);
// }).catch(error => {
//     console.log("Error", error);
// })