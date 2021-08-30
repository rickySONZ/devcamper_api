const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
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

    const token = await user.getJwtToken()

    res.status(200).json({
        success: true,
        token
    })
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

    // Create token
    const token = await user.getJwtToken()

    res.status(200).json({
        success: true,
        token
    })
})