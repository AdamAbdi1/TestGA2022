const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    first: {type: String, required: true}, 
    last: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: String, required: true},
    image: String,
    morning: String,
    evening: String
})

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee