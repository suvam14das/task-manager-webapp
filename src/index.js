const express = require('express') 
require('./db/mongoose.js')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path = require('path') 
const hbs = require('hbs')


const app = express() 
const port = process.env.PORT

// Define paths 
const pathToAsset = path.join(__dirname, "../public")
const pathToViews = path.join(__dirname, "../templates/views")
const pathToPartials = path.join(__dirname, "../templates/partials")

// Setting path to static assets 
app.use(express.static(pathToAsset)) 

// Setup handlebars engine and views location 
app.set("view engine", "hbs")
app.set("views", pathToViews)  
hbs.registerPartials(pathToPartials)

// middleware
// app.use((req, res, next) => {
//     res.status(503).send('Site under maintenance !')
// })

app.use(express.json()) 
app.use(userRouter)
app.use(taskRouter) 

app.get('', (req,res) => {
    res.render('login')
})

app.get('/signup', (req,res) => {
    res.render('signup')
})

app.get('/profile', (req,res) => {
    res.render('profile', {
        title : 'My Profile', 
        name : 'Suvam Das' })
})

app.get('/task', (req,res) => {
    res.render('task', {
        title : 'My Tasks', 
        name : 'Suvam Das' })
})

app.get('/createtask', (req,res) => {
    res.render('createtask', {
        title : 'Create a Task', 
        name : 'Suvam Das' })
})

app.get('/logout', (req, res) => {
    res.render('logout', {
        title : 'Logout', 
        name : 'Suvam Das'
    })
})

app.listen(port, () => {
    console.log("Connected to port ", port)

})

