const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
require('./db/conn')
const js_questions = require('./routes/javascript_q_a.js')
const add_question = require('./routes/add_questions.js')

const app = express()
app.use(express.json())
app.use(cors());


app.use('/all-questions',js_questions)
app.use('/send-email',add_question)

app.listen(process.env.PORT,()=>{
    console.log("Successfully Run")
})


