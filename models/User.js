const db=require('mongoose')
db.connect('mongodb+srv://sheikhhamza012:lahore012@cluster0-qcvsy.mongodb.net/test?retryWrites=true&w=majority')
    .then(()=>console.log("connected"))
    .catch(err=>console.log(err))
const schema= new db.Schema({
    username:{type:String,unique:true,required:[true,'username is required']},
    email:{type:String,unique:true,required:[true,'email is required']},
    password:{type:String,required:[true,'Password cant be empty']},
    posts:[],
    followers:[],
    following:[]
})
const User = db.model('User',schema)
module.exports={
    create:async(data)=>{
        return new Promise((resolve,reject)=>{
            var user= new User(data),obj = user.validateSync()
            if(obj){
                reject({error:true,msg:obj.message})
            }
                resolve(user.save())
        })  
    },
    find:(v,callback)=>{
        return User.findOne(v,callback)
    }
}