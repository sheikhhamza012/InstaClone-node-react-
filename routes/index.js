const UserCtrl= require("../controllers/User") 
const PostCtrl= require("../controllers/Posts") 
const AppCtrl= require("../controllers/app")
const Authenticate= require("../midlewares/authenticate")
const {uploadfile}= require("../midlewares/helpers")
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/')
    }
  })
const upload = multer({ storage:storage })
module.exports = (app)=>{
    app.get('/', Authenticate.verifyToken, PostCtrl.index)
    app.post('/signup', UserCtrl.signup)
    app.post('/login',UserCtrl.login)
    app.post('/user/update/password',Authenticate.verifyToken,UserCtrl.updatePassword)
    app.get('/user/follow/:username',Authenticate.verifyToken,UserCtrl.follow)
    app.get('/user/unfollow/:username',Authenticate.verifyToken,UserCtrl.unfollow)

    // app.get('/posts',Authenticate.verifyToken,PostCtrl.index)
    app.post('/posts/new',Authenticate.verifyToken, upload.single('image'),uploadfile,PostCtrl.new)
    app.get('/posts/:username',Authenticate.verifyToken,PostCtrl.userPosts)
    app.delete('/posts/:id',Authenticate.verifyToken,PostCtrl.deletePost)
    app.patch('/posts/:id',Authenticate.verifyToken,PostCtrl.updatePost)

    app.get('/posts/:id/like',Authenticate.verifyToken,PostCtrl.like)
    app.post('/posts/:id/comment',Authenticate.verifyToken,PostCtrl.comment)
    app.patch('/posts/:id/comment/:cid',Authenticate.verifyToken,PostCtrl.updateComment)
    app.delete('/posts/:id/comment/:cid',Authenticate.verifyToken,PostCtrl.deleteComment)
}