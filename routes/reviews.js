const express = require('express')
const {
    getReviews,
    getReview
} = require('../controllers/reviews')
const Review = require('../models/Review')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')
//Merge params is necessary here to merge the reviews with bootcamps
const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)

router.route('/:id')
    .get(getReview)

module.exports = router