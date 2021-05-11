const mongoose = require('mongoose')
const validator = require('validator')

const SeatInfo = mongoose.model('seatinfo',{
    seatno: {
        type: Number,
        required: true
    },
    seatownedby: {
        type: String,
        trim: true,
        required: true
    },
    seatbookedby: {
        type: String,
        trim: true,
    },
    bookingdate: {
        type: Date
    },
    leavestartdate:{
        type: Date
    },
    leaveenddate:{
        type: Date
    },
    bookingstatus:{
        type: String,
        trim: true,
        required: true
    }
})

module.exports = SeatInfo