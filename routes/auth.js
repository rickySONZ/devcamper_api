const express = require('express')
const { register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword, 
    logout} = require('../controllers/auth')

const router = express.Router()

const { protect } = require('../middleware/auth')

router.post('/register', register)

router.post('/login', login)

router.get('/logout', protect, logout)

router.get('/me', protect, getMe)

router.put('/updateDetails', protect, updateDetails)

router.put('/updatePassword', protect, updatePassword)

router.post('/forgotPassword', forgotPassword)

router.put('/resetPassword/:resetToken', resetPassword)

module.exports = router