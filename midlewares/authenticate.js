
let jwt = require('jsonwebtoken');
const config = require('../constants/config');
module.exports = {
  verifyToken: (req, res, next) => {
    let token = req.headers['authorization']; 
    if (token) {
      jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
          return res.json({error: true,msg: 'Token is invalid'});
        } else {
          req.username = decoded.username;
          next();
        }
      });
    } else {
      return res.json({error: true,message: 'Auth token is not supplied'});
    }
  }
}