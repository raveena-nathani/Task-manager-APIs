const express = require('express');
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
       await task.save();
       res.status(201).send(task); 
    }catch(error){
        res.status(400).send(error);
    }
})

router.get('/tasks', auth, async (req, res) => {
    // let match = {};

    // if(req.query.completed){
    //     match.completed = req.query.completed === 'true'
    // }
    
    let searchObj = {owner: req.user._id}
    if(req.query.completed){
        searchObj = {
            ...searchObj,
            completed: req.query.completed === 'true'
        }
    }

    let sortObj = {};
    let parts;
    if(req.query.sortBy){
        parts = req.query.sortBy.split(':');
        sortObj[parts[0]] = parts[1];
    }


   try{
    // const tasks = await Task.find({});

    const tasks = await Task.find(searchObj)
    .limit(req.query.limit ? parseInt(req.query.limit) : undefined)
    .skip(req.query.skip ? parseInt(req.query.skip) : undefined)
    .sort(sortObj);
    //OR
    // await req.user.populate({
    //     path: 'tasks',
    //     match,
    //     options: {
    //         limit: parseInt(req.query.limit),
    //         skip: parseInt(req.query.skip)
    //     }
    // }).execPopulate();

    // res.send(req.user.tasks);
    res.send(tasks);
   }catch(error){
    res.status(500).send()
   }
   
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({_id, owner: req.user._id})
    if(!task){
        return res.status(404).send(); //not working! sending 500 status code from catch block
    }
    res.send(task);
  } catch(error){
    res.status(500).send()
  }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperations = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperations){
        return res.status(400).send({error: 'Invalid updates!'});
    }

    try{
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send(); //not working
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true});
       
        res.send(task);
    }catch(error){
        res.status(500).send(); 
    }
})


router.delete('/tasks/:id', auth, async(req, res) => {
    try{
    //    const task = await Task.findByIdAndDelete(req.params.id);
       const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id});
       if(!task){
        return res.status(404).send(); //not working
    }
    res.send(task);
    }catch(error){
        res.status(500).send(); 
    }
})

module.exports = router;