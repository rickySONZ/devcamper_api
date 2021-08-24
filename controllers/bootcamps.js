// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public  
export function getBootcamps(req, res, next) {
    res.status(200).json({ success: true, msg: 'Show all bootcamps'})
}

// @desc    Get one bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public  
export function getBootcamp(req, res, next) {
    res.status(200).json({ success: true, msg: `Display bootcamp ${req.params.id}`})
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
export function createBootcamp(req, res, next) {
    res.status(200).json({ success: true, msg: 'Create new bootcamp'})
}

// @desc    Update bootcamp
// @route   PATCH /api/v1/bootcamps
// @access  Private
export function updateBootcamp(req, res, next) {
    res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}`})
}

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps
// @access  Private
export function deleteBootcamp(req, res, next) {
    res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}`})
}



