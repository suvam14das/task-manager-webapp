const express = require('express')
const Task = require('../models/task') 
const auth = require('../middleware/auth')

const router = new express.Router() 

//create task
router.post('/tasks',auth, async (req, res) => {    
    
    //const newtask = new Task(req.body)

    const newtask = new Task({
        ...req.body, 
        owner: req.user._id
    })

    newtask.save().then(() => {
        res.status(201).send(newtask)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

//get all tasks | search by completed value | pagenation using limit and skip
router.get('/tasks',auth, async (req,res) => {
        
    const match={}
    if(req.query.completed)
        match.completed = req.query.completed==='true'
    try{        
        const user = req.user
        await user.populate({
            path: 'tasks', 
            match, 
            options: {
            limit : parseInt(req.query.limit), 
            skip : parseInt(req.query.skip)
        }
    }).execPopulate() 
        res.send(user.tasks)
        

    }catch(error) {
        res.status(500).send(error)
    }
})

// get task by id
router.get('/tasks/:id',auth , async (req,res) => {   
    
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        if(!task)
        return res.status(404).send()
       
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

// update task 
router.patch('/tasks/:id',auth, async (req, res) => {
    
    updates = Object.keys(req.body) 
    const allowedUpdate = ['description', 'completed']
    isValidUpdate = updates.every((update) => allowedUpdate.includes(update))
    
    if(!isValidUpdate) 
        return res.status(400).send({error : 'Invalid Update !'})
    
    try{
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators:true}) 

        const task = await Task.findOne({_id : req.params.id, owner : req.user._id})  
        if(!task)
            return res.status(404).send()   

        updates.forEach((update) => {
            task[update] = req.body[update] 
        })
        task.save() 

        res.send(task) 
    } catch(e){     
        res.status(400).send(e) 
    }
})

// delete task
router.delete('/tasks/:id',auth, async (req, res) => {

    try{
        const task =  await Task.findOne({_id : req.params.id, owner : req.user._id})
        if(!task) 
            return res.status(404).send()
        await task.remove()
        res.send(task)  

    }catch(e){
        res.status(500).send() 
    }
})

module.exports = router 