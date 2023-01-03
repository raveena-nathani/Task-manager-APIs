const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');



router.post('/users', async (req, res) => {
    const user = new User(req.body); 
   
    try{
        await user.save();
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken();

        res.status(201).send({user, token});
    }catch(error){
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res) => {
    try{
        //findByCredentials is custom method
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(error){
        res.status(400).send();  
    }
})

router.post('/users/logout', auth, async (req, res) => {
  try{
    req.user.tokens = req.user.tokens.filter(token => {
        return token.token !== req.token
    })
    await req.user.save();

    res.send();
  }catch(e){
    res.status(500).send();
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
})

router.get('/users/me',auth, async (req, res) => {
   res.send(req.user);
})

/*router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try{
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send(); //not working
          }
        res.send(user);
    }catch(error){
        res.status(500).send()
    }
})*/

router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperations = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperations){
        return res.status(400).send({error: 'Invalid updates!'});
    }

    try{
        //to make middleware work, commented below line and adding other
        // const user = await User.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true});
        
        // const user = await User.findById(req.params.id);


        // if(!req.user){
        //     return res.status(404).send(); //not working
        // }
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save(); //before saving we have created the middleware in user model file
        res.send(req.user);
    }catch(error){
        res.status(500).send(); 
    }
})


router.delete('/users/me',auth, async(req, res) => {
    try{
    //    const user = await User.findByIdAndDelete(req.user._id);
    //    if(!user){
    //     return res.status(404).send(); //not working
    //    }

    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);

    res.send(req.user);
    }catch(error){
        res.status(500).send(); 
    }
})

const upload = multer({
    //dest: 'avatars', //stores in avatars folder

    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload images file.'))
        }
        cb(undefined, true);
    }
})


//Upload profile picture

//auth and upload.single('avatar') are middlewares
//avatar is the key where in value of file will be added
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //using resize()- we can resize the image before uploading it to database
    //png() - converts all other types to png
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    // req.user.avatar = req.file.buffer;
    
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

//how to check correct image uploaded in database
//use any online code editor such as jsbin and add img tag
//after base64, is the value or image from database
//<img src="data:image/jpg;base64, value />



// Delete profile picture / avatar

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

//Fetch profile picture/avatar
router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send();
    }
})

module.exports = router;