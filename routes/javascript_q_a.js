const express = require('express')
const router = express.Router()
const {Questions} = require('../db/conn')

router.get('/',async(req,resp)=>{
    const data = await Questions.find()
    const result = data.map((val)=>{
        return val
    })
    console.log(result)
    resp.send({result}).status(200)
})

module.exports = router