var cryptojs = require('crypto-js');

module.exports = (db) => {

  return {
    requireAuthentication: (req, res, next) => {
      var token = req.get('Auth') || '';

      //looking for value in database that matches the hashed value that the user has set in their header
      db.token.findOne({
        where: {
          tokenHash: cryptojs.MD5(token).toString()
        }
      }).then((tokenInstance) => { //if found, we run this code
        if (!tokenInstance) {
          throw new Error();
        };

        req.token = tokenInstance; //store token instance onto request object
        return db.user.findByToken(token); //now we can call findByToken

      }).then((user) => { //if token is found, we set the user object to the req.user object and call next
        req.user = user;
        next();
      }).catch(() => {
        res.status(401).send();
      });
    }
  };
};
