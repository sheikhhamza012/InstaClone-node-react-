const User= require('../models/User')
module.exports={
    index : (req,res)=>{
        console.log("get")
        res.send("Live")
    },
    
}