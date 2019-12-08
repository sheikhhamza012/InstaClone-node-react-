
let jwt = require('jsonwebtoken');
const config = require('config');
const {error} = require('../Error');
module.exports = {
  verifyToken: (req, res, next) => {
    let token = req.headers['authorization']; 
  
    if (token) {
      jwt.verify(token, process.env[config.get('secretKey')], (err, decoded) => {
        if (err!=null) {
           throw new error(400,'Token is invalid');
        }
          req['username'] = decoded.username;
          next();
          
      });
      return
    }
     throw new error(400,'Token required');    
  }
}