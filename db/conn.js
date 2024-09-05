const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
mongoose.connect(process.env.MONGODB_URL)

const Questions = mongoose.model('q_a', new mongoose.Schema({}, { strict: false }), 'q_a')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    count: Number,
    status: Object,
    questions : Object,
    question_id_from_db : Object,
    refreshToken : Object,
    createdAt: Object
})

const UserModel = mongoose.model('user', userSchema, 'users')

module.exports = {
    Questions,
    UserModel
}