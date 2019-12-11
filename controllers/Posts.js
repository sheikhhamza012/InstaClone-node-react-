const Post= require('../models/Posts')
const User= require('../models/User')
const config = require('config')
const jwt = require('jsonwebtoken');
const {error} = require('../Error')


module.exports={
    index:(req,res)=>{
        User.findUser(req.username,(e,d)=>{
            if(e) return next()
            if(d==null) return res.send({error:true,msg:"user not found"})
            new Promise((resolve,reject)=>{
                let i = 0,posts=[]
                if(d.feed.length==0){
                    reject()
                }
                d.feed.map(row=>{
                    Post.obj.findById(row,(e,post)=>{
                        if(e) {
                            i++
                            return
                        }
                        if(d==null) {
                            i++
                            return
                        }
                        
                        posts.push(post)
                        if(i==d.feed.length-1) resolve(posts)
                        i++
                    })
                })
            }).then((d)=>{
                return res.send({error:false,obj:d})
            }).catch(e=>{
                return res.send({error:false,obj:[]})
            })
        })
    },
    new:(req,res,next)=>{
        const {caption}=req.body
        if(caption.length>0){
            Post.create({caption:caption,image:req.file.url,ownerName:req.username,time:new Date(Date.now())}).then(d=>{   
                User.findUser(req.username,(e,user)=>{
                user.posts.push(d._id)
                user.save(e=>{
                    if(!e){
                        new Promise((resolve,reject)=>{
                            let i=0
                            user.followers.map(follower=>{
                                 User.findUser(follower,(e,follower)=>{
                                     follower.feed.unshift(d._id)
                                     follower.save(e=>{
                                         if(e) return res.send({error:true,msg:e})
                                         if(i==user.followers.length-1){
                                             resolve()
                                         } 
                                        
                                         i++
                                     })
                                 })
                             })
                        }).then(()=>res.send({error:false,obj:d}))
                        return
                    }
                    next()
                })
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
                    if(d.posts.length==0){
                        reject()
                    }
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
                .catch(()=>res.send({error:false,obj:[]}))
                return
            } 
            return res.status(404).send({error:true,obj:"User not found"})
        })   
    },
    like:(req,res)=>{
        Post.obj.findById(req.params.id,(e,post)=>{
            if(post!=null&&e==null){
                if(post.likes.find(x=>x==req.username)==null){
                    post.likes.unshift(req.username)
                    post.save(e=>{
                        if(e==null) {
                        return res.send({error:false,obj:post})
                        }else 
                        res.send({error:true,msg:e})
                    })
    
                }else{
                    console.log(post.likes.indexOf(post.likes.find(x=>x==req.username)))

                    let i =post.likes.indexOf(post.likes.find(x=>x==req.username))
                    post.likes.splice(i,1)
                    post.save(e=>{
                        if(e==null) {
                        return res.send({error:false,obj:post})
                        }else 
                        res.send({error:true,msg:e})
                    })
               }
               return
            }
            return res.send({error:true,msg:"post not found"})

        })
    },
    comment:(req,res)=>{
        Post.obj.findById(req.params.id,(e,post)=>{
            if(post!=null&&e==null){
                
                    post.comments.unshift({username:req.username,msg:req.body.msg,time:new Date(Date.now())})
                    post.save(e=>{
                        if(e==null) {
                        return res.send({error:false,obj:post})
                        }else 
                        res.send({error:true,msg:e})
                    })
                
               return
            }
            return res.send({error:true,msg:"post not found"})
        })
    },
    updateComment:(req,res)=>{
        Post.obj.findById(req.params.id,(e,post)=>{
            if(post!=null&&e==null){
                let comment=post.comments.find(x=>x._id==req.params.cid)
                if(comment){
                    if(comment.username!=req.username){
                        return res.send({error:true,msg:"you are not the author of this comment"})
                    }
                    comment.msg=req.body.msg
                    post.save(err=>{
                        if(err==null){
                         return res.send({error:false,obj:post})
                        } else
                        return res.send({error:true, msg:"error occured"})
                    })
                }else
                return res.send({error:true,msg:"comment not found"})
            }else
            return res.send({error:true,msg:"post does not exist"})
        })
    },
    deleteComment:(req,res)=>{
        Post.obj.findById(req.params.id,(e,post)=>{
            if(post!=null&&e==null){
                let comment=post.comments.find(x=>x._id==req.params.cid)
                console.log(post )
                if(comment){
                    if(comment.username!=req.username){
                        return res.send({error:true,msg:"you are not the author of this comment"})
                    }
                    post.comments.splice(post.comments.indexOf(comment),1)
                    post.save(err=>{
                        if(err==null){
                         return res.send({error:false,obj:post})
                        } else
                        return res.send({error:true, msg:"error occured"})
                    })
                }else
                return res.send({error:true,msg:"comment not found"})
            }else
            return res.send({error:true,msg:"post does not exist"})
        })
    },
    deletePost:(req,res)=>{
        Post.obj.findById(req.params.id,(e,post)=>{
            if(post!=null&&e==null){
                if(req.username!=post.ownerName){
                    return res.send({error:true,msg:"you are not the author of this post "})
                }
                post.remove((e,d=>{
                    if(e==null){
                        User.findUser(req.username,(e,d)=>{
                            if(d!=null&&e==null){
                                d.posts.splice(d.posts.indexOf(d.posts.find(x=>x==req.params.id)),1)
                                d.save(e=>{
                                    if(e==null){
                                        return res.send({error:false,msg:"post deleted "})
                                    }
                                    return res.send({error:true,msg:"post ref could not be deleted "})
                                })
                            }else return res.send({error:true,msg:"could not found user to del ref from his account"})
                        })
                    }else return res.send({error:true,msg:"could not delete this post"})
                }))
            }else
            return res.send({error:true,msg:"post does not exist"})
        })
    },
    updatePost:(req,res)=>{
        Post.obj.findById(req.params.id,(e,post)=>{
            if(post!=null&&e==null){
                if(req.username!=post.ownerName){
                    return res.send({error:true,msg:"you are not the author of this post "})
                }
                post.caption=req.body.caption
                post.save(e=>{
                    if(e==null){
                        return res.send({error:false,obj:post})
                    }

                    return res.send({error:true,msg:"could not update"})
                })
            }else
            return res.send({error:true,msg:"post does not exist"})
        })
    },
}