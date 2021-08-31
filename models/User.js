const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email : {
        type: String,
        required: [true, 'Please add an email'] ,
        match: [
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            'Please add a valid email'
        ]
    },
    role : {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false //Prevents password from being returned in JSON
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) next()
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getJwtToken = function(){
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET)
}

//Match user enter password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Generate a hash password and token
UserSchema.methods.getResetPasswordToken = function(){
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    //Set expire 
    this.resetPasswordExpire = Date.now() + (10 * 60 * 1000)
    return resetToken
}

module.exports = mongoose.model('User', UserSchema)