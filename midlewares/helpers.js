const fs = require('fs')
const cloudinary = require('cloudinary').v2

module.exports={
    uploadfile:(req,res,next)=>{
        cloudinary.config({
            cloud_name: 'doxy1o5vn',
            api_key: '227219311134932',
            api_secret: 'IhTyHtsxUX6GjSulM-kmcyT0XC0'
        })
        if(req.file){
            const {path}=req.file
            cloudinary.uploader.upload(
                path,
                {public_id: `posts/${req.file.filename}`}, // directory and tags are optional
                (err, image) =>{
                  if (err) return res.send({error:true,msg:err})
                  fs.unlinkSync(path)
                  req.file = {url:image.secure_url}
                  next()
                }
              )
        }else{
            req.file = {url:null}
            next()
        }       
    }

}