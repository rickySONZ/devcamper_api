const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {

    console.log(err)

    let error = {...err}
    //Log to console for dev
    console.log(err.stack.red)
    error.message = err.message

    if(err.name === 'CastError'){
        const message = `Bootcamp not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    //Duplicate key
    if(err.code === 11000) {
        let message = 'Duplicate field value'
        error = new ErrorResponse(message, 400)
    }

    //Mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(value => value.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler