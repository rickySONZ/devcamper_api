const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET api/v1/bootcamps/:bootcampId/courses
// @access  Public  

exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId })
        //Giving this a separate response because pagination does not make sense when just searching the bootcamp courses
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        //access to advanced results is because route is wrapped in middleware
        res.status(200).json(res.advancedResults)
    }

})

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public  

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        count: course.length,
        data: course
    })
})

// @desc    Add course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Public 

exports.addCourse = asyncHandler(async (req, res, next) => {
    //This pulls the bootcamp param from the URL and enables the course to built off of that
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 404))
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        count: course.length,
        data: course
    })
})

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
    //This pulls the bootcamp param from the URL and enables the course to built off of that
    let course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404))
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        count: course.length,
        data: course
    })
})

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    //This pulls the bootcamp param from the URL and enables the course to built off of that
    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404))
    }

    await course.remove()

    res.status(200).json({
        success: true,
        count: course.length,
        data: {}
    })
})