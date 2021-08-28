const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @route   GET api/v1/bootcamps/:bootcampId/courses
// @access  Public  

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if(req.params.bootcampId){
        query = Course.find({ bootcamp: req.params.bootcampId})
    } else {
        //Optionally displays the bootcamp data with courses
        //Select indicates the required fields
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }

    const courses = await query
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public  

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if(!course){
        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404))
    }
    
    res.status(200).json({
        success: true,
        count: course.length,
        data: course
    })
})