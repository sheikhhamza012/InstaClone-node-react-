const User= require('../models/User')
const config = require('config')
const jwt = require('jsonwebtoken');

module.exports={
    index : (req,res)=>{
        console.log("get")
        res.send("yus")
    },

    signup:(req,res)=>{
        const {username,password,email} = req.body
        const validate= User.validate(req.body)
        if(validate.error){
            res.send(validate)
        }else{  
          User.find({$or:[{username:username},{email:email}]},(e,d)=>{
            if(!d){
                User.create(req.body).then((x)=>{
                    res.send({error:false,token:jwt.sign({username:x.username},process.env[config.get('secretKey')],{expiresIn:'2400h'})})
                }).catch((x)=>res.send(x))
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
                res.send({error:false,token:jwt.sign({username:d.username},process.env[config.get('secretKey')],{expiresIn:'2400h'})})
            }else
                res.send({error:true,msg:"username/email and password combination does not exist"})
            })
        }
    },

    updatePassword:(req,res)=>{
        const {oldPassword,newPassword} = req.body
        User.findUser(req.username,(e,d)=>{
            if(d){
                if(d.password==oldPassword&&d.password!=newPassword){
                    d.password=newPassword
                    d.save(e=>{
                        if(e){
                            return res.send({error:true,msg:e})
                        }
                        return res.send({error:false})
                    })
                }else{
                    res.send({error:true,msg:d.password==oldPassword?"new password cant be old password":"old password did not match"})
                }
            }else{
                res.send({error:true,msg:"user not found"})
            }
        })
    },

    follow:(req,res)=>{
        if(req.username==req.params.username){
            return res.send({error:true,msg:"cant follow yourself"})
        }
        User.findUser(req.username,(e,me)=>{
            if(me){
                User.findUser(req.params.username,(e,him)=>{
                    if(him){
                        if(!me.following.find((row)=>row==req.params.username)){
                            me.following.push(req.params.username)
                            him.followers.push(req.username)
                            me.save(e=>{
                                if(e){
                                    return res.send({error:true,msg:e})
                                }
                                return res.send({error:false,user:me})
                            })
                            him.save(e=>{
                                if(e){
                                    return res.send({error:true,msg:e})
                                }
                                return res.send({error:false,user:me})
                            })
                       }else{
                            res.send({error:true,msg:"user already followed"})
                       }
                    }else{
                        res.send({error:true,msg:"user to be followed not found"})
                    }
                })
            }else{
                res.send({error:true,msg:"user not found"})
            }
        })

    },

    unfollow:(req,res)=>{
        User.findUser(req.username,(e,me)=>{
            if(me){
                User.findUser(req.params.username,(e,him)=>{
                    if(him){
                        let row=me.following.find((row)=>row==req.params.username)
                        if(row){
                            me.following.splice(me.following.indexOf(row),1)
                            him.followers.splice(me.following.indexOf(req.username),1)
                            me.save(e=>{
                                if(e){
                                    return res.send({error:true,msg:e})
                                }
                                return res.send({error:false,user:me})
                            })
                            him.save(e=>{
                                if(e){
                                    return res.send({error:true,msg:e})
                                }
                                return res.send({error:false,user:me})
                            })
                       }else{
                            res.send({error:true,msg:"user not followed"})
                       }
                    }else{
                        res.send({error:true,msg:"user to be unfollowed not found"})
                    }
                })
            }else{
                res.send({error:true,msg:"user not found"})
            }
        })

    }



    
}