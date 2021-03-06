const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
// const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.avatar
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await JWT.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '1 day'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
} 

userSchema.statics.findByCredentials = async (email, password) => {
        const user = await User.findOne({email})
        if(!user) {
            throw new Error('User not authenticated')
        } 
        const isMatched = await bcrypt.compare(password, user.password)
        if(!isMatched) {
            throw new Error('User not authenticated')
        }
        return user
}

// password encryption through bcryptjs
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete tasks when users are deleted
userSchema.pre('remove', async function(next) {
    const user = this
    const deletedTasks = await Task.deleteMany({owner: user._id})
    console.log(deletedTasks,"deletedTasks")
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User