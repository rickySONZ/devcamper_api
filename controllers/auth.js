const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const asyncHandler = require('../middleware/async')
const path = require('path')


//@desc     Register user
//@route    GET /api/v1/auth/register
//@access   Public

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)
})

//@desc     Login user
//@route    GET /api/v1/auth/login
//@access   Public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    //Validate email and password

    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    //Check for user
    const user = await User.findOne({email: email}).select('+password')

    if(!user){
        return next(new ErrorResponse('Invalid Credentials', 401))
    }

    //Check if password matches 
    const isMatch = await user.matchPassword(password)

    if(!isMatch){
        return next(new ErrorResponse('Invalid Credentials', 401))
    }

    sendTokenResponse(user, 200, res)

})


exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
})

//@ desc    Forgot Password
//@route    POST /api/v1/auth/forgotPassword
//@access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new ErrorResponse(`There is no user with that email`, 404))
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})

    //Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password.
    PUT request to: \n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token', 
            message
        })
        res.status(200).json({
            success: true,
            data: 'Email sent'
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse('Email could not be sent', 500))
    }

})

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getJwtToken()

    const options = {
        expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}