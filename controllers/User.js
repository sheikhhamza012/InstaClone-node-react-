const User= require('../models/User')
const config = require('../constants/config')
let jwt = require('jsonwebtoken');

module.exports={
    index : (req,res)=>{
        console.log("get")
        res.send("yus")
    },

    signup:(req,res)=>{
        const {username,password,email} = req.body
        if(password.length<6||!(/\S+@\S+\.\S+/).test(email)){
            res.send({error:true,msg:"validation failed:"+(password.length<6?"password must be more than 6 letters":"email invalid")})
        }else{  
          User.find({$or:[{username:username},{email:email}]},(e,d)=>{
            if(!d){
                User.create(req.body).then((x)=>res.send({error:false,token:jwt.sign({username:x.username},config.secretKey,{expiresIn:'2400h'})})).catch((x)=>res.send(x))
            }else
                res.send({error:true,msg:"user with this "+(d.username==username?"username":"email")+" exists"})
            })
        }
    },

    login: (req,res)=>{
        const {username,password} = req.body
        if(!password||!username||password.length==0||username.length==0){
            res.send({error:true,msg:(password.length==0?"password missing":"email/username missing")})
        }else{
          User.find({$and:[{$or:[{username:username},{email:username}]},{password:password}]},(e,d)=>{
            if(d){
                res.send({error:false,token:jwt.sign({username:d.username},config.secretKey,{expiresIn:'2400h'})})
            }else
                res.send({error:true,msg:"username/email and password combination does not exist"})
            })
        }
    }



    
}