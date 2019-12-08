const db = require('mongoose')
const Joi = require('joi')
const schema= new db.Schema({
    username:{type:String,unique:true,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    posts:[],
    followers:[],
    following:[]
})
const User = db.model('User',schema)
module.exports={
    create:(data)=>{
        return new Promise((resolve,reject)=>{
            var user= new User(data)
                resolve(user.save())
        })  
    },
    find:(v,callback)=>{
        return User.findOne(v,callback)
    },
    findUser:(v,callback)=>{
        return User.findOne({username:v},callback)
    },
    updatePassword:(v,user)=>{
        User.findOneAndUpdate({username:username},{password:v})
    },
    validate:(user) => {
        const schema = {
          username: Joi.string()
            .min(5)
            .max(20)
            .required(),
          email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
          password: Joi.string()
            .min(5)
            .max(255)
            .required()
        };
        const validate=  Joi.validate(user, schema)
        if(validate.error!==null){
            return ({error:true,msg:validate.error.details[0].message})
        }else{
            return ({error:false})
        }
      },
      obj:User

}