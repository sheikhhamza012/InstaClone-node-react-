const express = require("express")
const routes =require("./routes")
const morgan = require('morgan')
const dotenv = require('dotenv')
const config = require('config')
const mongoose = require('mongoose')
const multer = require('multer')
const cloudinary = require('cloudinary').v2


const app= express()
dotenv.config()
app.use(express.json())
app.use(morgan(':method :url :status :req[header] - :req[body] :response-time ms'))

routes(app)

app.use((err, req, res, next) => {
    res.status(err.status||500).send({error:err.error||true,msg:err.msg})
});
process.on('uncaughtException', (reason) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
})
mongoose.connect(process.env[config.get('db')])
    .then(()=>console.log("connected"))
    .catch(err=>console.log(err))

app.listen(process.env.port,()=>{
    console.log("server up on port "+process.env.PORT||8080+"...")
})