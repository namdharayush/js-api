const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config();
const {Questions,UserModel} = require('../db/conn')
const { mongoose } = require('mongoose')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const React = require('react')
const ReactDOMServer = require('react-dom/server');
const EmailTemplate = require("../public/EmailTemplate")
const AcceptRequestEmail = require('../public/AcceptRequestEmail')
const RejectRequestEmail = require('../public/RejectrequestEmail')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASSWORD,
    },
    tls : {
        rejectUnauthorized : false
    },
    secure:true
})


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY



router.post('/', async (req, resp) => {
    const { name, email, ...rest } = req.body
    const accessToken = jwt.sign({email , question_id : rest.user_question_id},JWT_SECRET_KEY , {expiresIn : '7d'})
    const refreshToken = jwt.sign({email , question_id : rest.user_question_id},JWT_SECRET_KEY ,{expiresIn : '60d'})
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
        React.createElement(EmailTemplate,{...rest,accessToken})
    )
    try{
        const exitingUser = await UserModel.findOne({email})
        if(exitingUser){
            const newCount = exitingUser.count + 1
            await UserModel.updateOne({email},{$set : {count:newCount,question_id_from_db : {...exitingUser.question_id_from_db , [rest.user_question_id] : ''},questions : {...exitingUser.questions,[rest.user_question_id]:rest},refreshToken : {...exitingUser.refreshToken,[rest.user_question_id]:refreshToken},status:{...exitingUser.status, [rest.user_question_id]:'PENDING'}},createdAt : {...exitingUser.createdAt,[rest.user_question_id]:Date.now()}})
        }
        else{
            await UserModel.create({name,email,count:1,question_id_from_db : {[rest.user_question_id] : ''},questions : {[rest.user_question_id]:rest},refreshToken : {[rest.user_question_id]:refreshToken},status:{[rest.user_question_id]:'PENDING'},createdAt : {[rest.user_question_id]:Date.now()}})
        }
        try{
            const mailOptions = {
                from : email,
                to:process.env.EMAIL_USER,
                subject:name+"js_questions",
                html : htmlContent
            }
            await transporter.sendMail(mailOptions)
            resp.status(200).send("Email sent successfully!")
        }
        catch(error){
            return resp.status(500).send('Error sending email');
        }
    }
    catch(err){
        console.log(err)
    }
    
})

router.get("/accepted",async(req,resp)=>{
    const token = req.query.token
    try{
        const decoded = jwt.verify(token,JWT_SECRET_KEY)
        const {email,question_id} = decoded
        const findDataWith_Email = await UserModel.findOne({email})
        const {user_question_id , ...rest} = findDataWith_Email.questions[question_id]
        if(findDataWith_Email.status[question_id] == 'ACCEPT'){
            return resp.status(202).send("Already Accepted")
        }
        else if(findDataWith_Email.status[question_id] == 'REJECT'){
            return resp.status(500).send("This request has already rejected!")
        }
        try{
            const addData = await Questions.create(rest)
            await UserModel.updateOne({email},{$set : {question_id_from_db : {...findDataWith_Email.question_id_from_db,[question_id]:addData._id.toString()},status : {...findDataWith_Email.status , [question_id]:"ACCEPT"}}})
            const htmlContent = ReactDOMServer.renderToStaticMarkup(
                React.createElement(AcceptRequestEmail)
            )
            const mailOptions = {
                from : process.env.EMAIL_USER,
                to:email,
                subject:"accept_js_questions",
                html : htmlContent
            }
            await transporter.sendMail(mailOptions)
            resp.send("This request has been Accepted!")
        }
        catch(err){
            resp.status(500).send("Internal Server Error")
        }
    }
    catch(err){
        const {email,question_id} = jwt.decode(token)
        if(err.name == 'TokenExpiredError'){
            const findDataWith_Email = await UserModel.findOne({email})
            const refreshToken = findDataWith_Email.refreshToken[question_id]
            try{
                const decodedRefreshToken = jwt.verify(refreshToken , JWT_SECRET_KEY)
                if(findDataWith_Email.status[question_id] == 'ACCEPT'){
                    return resp.status(202).send("Already Accepted")
                }
                else if(findDataWith_Email.status[question_id] == 'REJECT'){
                    return resp.status(500).send("This request has already rejected!")
                }
                try{
                    const addData = await Questions.create(rest)
                    await UserModel.updateOne({email},{$set : {question_id_from_db : {...findDataWith_Email.question_id_from_db,[question_id]:addData._id.toString()},status : {...findDataWith_Email.status , [question_id]:"ACCEPT"}}})
                    const htmlContent = ReactDOMServer.renderToStaticMarkup(
                        React.createElement(AcceptRequestEmail)
                    )
                    const mailOptions = {
                        from : process.env.EMAIL_USER,
                        to:email,
                        subject:"accept_js_questions",
                        html : htmlContent
                    }
                    await transporter.sendMail(mailOptions)
                    resp.send("This request has been Accepted!")
                }
                catch(err){
                    resp.status(500).send("Internal Server Error")
                }
            }
            catch(err){
                return resp.status(401).send("Refresh token expired. Please resubmit the form.");
            }
        }
    }
})

router.get("/rejected",async(req,resp)=>{
    const token = req.query.token
    try{
        const decoded = jwt.verify(token , JWT_SECRET_KEY)
        const {email,question_id} = decoded
        const findDataWith_Email = await UserModel.findOne({email})
        if(findDataWith_Email.status[question_id] == 'REJECT'){
            return resp.status(202).send("Your request has already Rejected!")
        }
        else if(findDataWith_Email.status[question_id] == 'PENDING'){
            await UserModel.updateOne({email},{$set : {status : {...findDataWith_Email.status , [question_id] : "REJECT"}}})
            const htmlContent = ReactDOMServer.renderToStaticMarkup(
                React.createElement(RejectRequestEmail)
            )
            const mailOptions = {
                from : process.env.EMAIL_USER,
                to:email,
                subject:"reject_js_questions",
                html : htmlContent
            }
            await transporter.sendMail(mailOptions)
            resp.status(500).send("Your request has been rejected!")
        }
    }
    catch(err){
        const {email,question_id} = jwt.decode(token)
        if(err.name == 'TokenExpiredError'){
            const findDataWith_Email = await UserModel.findOne({email})
            const refreshToken = findDataWith_Email.refreshToken[question_id]
            try{
                const decodedRefreshToken = jwt.verify(refreshToken , JWT_SECRET_KEY)
                if(findDataWith_Email.status[question_id] == 'REJECT'){
                    return resp.status(202).send("Your request has already Rejected!")
                }
                else if(findDataWith_Email.status[question_id] == 'PENDING'){
                    await UserModel.updateOne({email},{$set : {status : {...findDataWith_Email.status , [question_id] : "REJECT"}}})
                    const htmlContent = ReactDOMServer.renderToStaticMarkup(
                        React.createElement(RejectRequestEmail)
                    )
                    const mailOptions = {
                        from : process.env.EMAIL_USER,
                        to:email,
                        subject:"reject_js_questions",
                        html : htmlContent
                    }
                    await transporter.sendMail(mailOptions)
                    resp.status(500).send("Your request has been rejected!")
                    
                }
            }
            catch(err){
                return resp.status(401).send("Refresh token expired. Please resubmit the form.");
            }
        }
    }
})


module.exports = router



















// router.post('/', async (req, resp) => {
//     const { name, email, ...rest } = req.body
//     try{
//         const question = await Questions.create(rest)
//         const existingUser = await UserModel.findOne({email});
//         if(existingUser){
//             const newCount = existingUser.count+1
//             const generateQuestionId = crypto.randomBytes(16).toString('hex')
//             existingUser.status[generateQuestionId] = "PENDING"
//             existingUser.questions[generateQuestionId] = rest
//             console.log(generateQuestionId)
//             await UserModel.updateOne({_id : existingUser._id},{$set : {count : newCount, status : existingUser.status, questions : existingUser.questions}})
//             console.log("This Email Id Exists.")
//         }
//         else{
//             const generateQuestionId = crypto.randomBytes(16).toString('hex')
//             console.log(generateQuestionId)
//             await UserModel.create({name,email,count : 1,question_id : new mongoose.Types.ObjectId(question._id.toString()),status : {[generateQuestionId] : "PENDING"},questions  : {[generateQuestionId] : rest}});
//         }
        
//         // resp.status(200).json({question})
//     }
//     catch(error){
//         console.log("Error Occurred : ",error)
//         resp.status(500).json({message : 'Internal Server Error.'})
//     }
// })