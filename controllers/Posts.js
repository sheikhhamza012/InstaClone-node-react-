const Post= require('../models/Posts')
const User= require('../models/User')
const config = require('config')
const jwt = require('jsonwebtoken');
const {error} = require('../Error')


module.exports={
    index:(req,res)=>{
        
    },
    new:(req,res,next)=>{
        const {caption}=req.body
        if(caption.length>0){
            Post.create({caption:caption,image:req.file.url,time:new Date(Date.now())}).then(d=>{   
                User.findUser(req.username,(e,user)=>{
                user.posts.shift(d._id)
                user.save(e=>!e?res.send({error:false,obj:d}):next)
               })
             })
        }else
        throw new error(400,"nothing to post")
    },
    userPosts: (req,res)=>{
        User.findUser(req.params.username,async(e,d)=>{
            if(d!=null&&e==null){
                posts=[]
                new Promise((resolve,reject)=>{
                    let i=0
                    d.posts.map(row=>{
                        Post.obj.findById(row,(e,doc)=>{
                            posts.push(doc)                         
                            if(i==d.posts.length-1){
                                resolve()
                            }
                            i++
                        })
                     })

                }).then(x=>res.send({error:false,obj:posts})) 
                return
            } 
            return res.status(404).send({error:true,obj:"User not found"})
        })   
    },
    like:(req,res)=>{

    },
    comment:(req,res)=>{

    }
}