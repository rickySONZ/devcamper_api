const express = require('express')
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
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
    //Prevents bootcamp publishers from leaving false reviews
    .post(protect, authorize('user', 'admin'), createReview)

router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = router