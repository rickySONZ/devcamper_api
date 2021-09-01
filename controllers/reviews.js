const Review = require('../models/Review')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId })
        //Giving this a separate response because pagination does not make sense when just searching the bootcamp courses
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        //access to advanced results is because route is wrapped in middleware
        res.status(200).json(res.advancedResults)
    }

})