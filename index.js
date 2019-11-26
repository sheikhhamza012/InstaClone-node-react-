const express = require("express")
const routes =require("./routes")
const morgan = require('morgan')

const app= express()
app.use(express.json())
app.use(morgan(':method :url :status :req[header] - :req[body] :response-time ms'))

routes(app)
app.listen(8888,()=>{
    console.log("server up on port 8888...")
})