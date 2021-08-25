const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')


// Route files
const bootcamps = require('./routes/bootcamps')
const { request } = require('express')
//Load environment
dotenv.config({ path: './config/config.env'})

connectDB()

const app = express()

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Mount routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
})