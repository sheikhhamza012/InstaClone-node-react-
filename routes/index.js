const UserCtrl= require("../controllers/User")
module.exports = (app)=>{
    app.get('/', UserCtrl.index)
}