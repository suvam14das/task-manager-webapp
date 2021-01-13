const mongoose = require('mongoose') 
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name : {
        type : String, 
        required : true, 
        trim : true  
    }, 
    email : {
        type : String,
        unique : true, 
        required : true, 
        trim : true, 
        lowercase : true,  
        validate(value) {
            if(!validator.isEmail(value)) 
                throw new Error("Email id is not valid !")
        }
    },
    password: {
        type : String, 
        required : true, 
        minLength : [7, "Password too small !"],  
        trim : true, 
        validate(value) {
            if(value.toLowerCase().search('password')>=0) 
                throw new Error("Cannot set password that contains \'password\' !")
        }
    }, 
    age: {
        type : Number, 
        default : 0, 
        validate(value) {
            if(value<0) 
                throw new Error("Age is not valid")
        }
    }, 
    tokens: [{
        token : {
            type : String, 
            required : true 
        }
    }]

}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task', 
    localField: '_id', 
    foreignField: 'owner'
})

// verify email and password before login 
userSchema.statics.findByCredentials = async (email, password) => {
    const user =  await User.findOne({ email }) 
    if(!user) 
        throw new Error('Unable to login') 
    
    const ismatch = await bcrypt.compare(password, user.password) 
    if(!ismatch) 
        throw new Error('Unable to login')
    return user

}

//generating authentication token
userSchema.methods.generateAuthToken = async function() {
    const user = this 
    const token = jwt.sign({_id : user._id}, process.env.SECRET_TOKEN, {expiresIn : '1 day'} ) 

    user.tokens = user.tokens.concat({token})
    await user.save() 

    return token 
}

// hiding sensitive data fields 
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject() 
    delete userObject.tokens 
    delete userObject.password 
    
    return userObject 
}

// hash password before saving 
userSchema.pre('save', async function(next) {    
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8) 
    }
    next()
})

// delete user cascade delete tasks
userSchema.pre('remove', async function(next) {

    const user = this 
    await Task.deleteMany({owner : user._id}) 
    next()
})



const User = mongoose.model('User', userSchema)
 
module.exports = User