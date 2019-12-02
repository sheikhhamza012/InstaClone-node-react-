const UserCtrl= require("../controllers/User")
const AppCtrl= require("../controllers/app")
const Authenticate= require("../midlewares/authenticate")

module.exports = (app)=>{
    app.get('/', Authenticate.verifyToken, AppCtrl.index)
    app.post('/signup', UserCtrl.signup)
    app.post('/login',UserCtrl.login)
    app.post('/user/update/password',Authenticate.verifyToken,UserCtrl.updatePassword)
    app.post('/user/follow/:username',Authenticate.verifyToken,UserCtrl.follow)
}