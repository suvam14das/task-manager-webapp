const express = require('express')
const User = require('../models/user') 
const auth = require('../middleware/auth')

const router = new express.Router() 



//create new user
router.post('/users', (req, res) => { 

    const newuser = new User(req.body)    
    newuser.save().then(async () => {
        const token = await newuser.generateAuthToken() 
        res.status(201).send({newuser, token})
    }).catch((error) => {
        res.status(400).send(error)
    })
})




// login user by email and password
router.post('/users/login', async (req, res) => {
    
    try{  
        const user = await User.findByCredentials(req.body.email, req.body.password) 
        const token = await user.generateAuthToken() 
        res.send({user, token}) 
    }catch(e){
        res.status(400).send(e) 
    }   
    
})




// logout user session 
router.post('/users/logout',auth, async (req, res) => {

try{        
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    })
    await req.user.save()
    res.send("Logged out")

    }catch(e){
        res.status(500).send()
    } 
})


//logout user of all sessions
router.post('/users/logoutall',auth, async (req, res) => {

    try{        
        req.user.tokens = []
        await req.user.save()
        res.send("Logged out of all sessions")
        
        }catch(e){
            res.status(500).send()
        } 
    })



// get current user profile 
router.get('/users/me', auth, (req,res) => {

    res.send(req.user)
})



// get user by id
// router.get('/users/:id', (req,res) => {
    
//     const _id = req.params.id     
//     User.findById(_id).then((user) => {
//         if(!user)
//         return res.status(404).send()

//         res.send(user)
        
//     }).catch((error) => {
//         res.status(500).send(error)
//     })
// })



// Update user details
router.patch('/users/me',auth, async (req, res) => {
    
    updates = Object.keys(req.body) 
    const allowedUpdate = ['name', 'email', 'password', 'age']
    isValidUpdate = updates.every((update) => allowedUpdate.includes(update))
    
    if(!isValidUpdate) 
        return res.status(400).send({error : 'Invalid Update !'})
    
    try{
        //const user = await User.findById(req.params.id) 

        updates.forEach((update) => {
            req.user[update] = req.body[update] 
        })
        await req.user.save() 

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators:true}) 
        // if(!user)
        //     return res.status(404).send()   
             
        res.send(req.user) 
    } catch(e){     
        res.status(400).send(e) 
    }
})




// delete user details
router.delete('/users/me',auth, async (req, res) => {

    try{
        // const user =  await User.findByIdAndDelete(req.user._id)
        // if(!user) 
        //     return res.status(404).send()
        
        await req.user.remove()
        res.send(req.user) 

    }catch(e){
        res.status(500).send() 
    }
})

module.exports = router 