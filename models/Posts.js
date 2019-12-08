const db = require('mongoose')
const Joi = require('joi')
const schema= new db.Schema({
    caption:{type:String},
    image:{type:String},
    likes:[],
    comments:[{
        user:{type:String},
        msg:{type:String},
        time : { type : Date, default: Date.now }
    }],
    time : { type : Date, default: Date.now }
})
const Post = db.model('Post',schema)
module.exports={
    obj:Post,
    create:(data)=>{
        return new Promise((resolve,reject)=>{
            var post= new Post(data)
                resolve(post.save())
        })  
    },
   
}