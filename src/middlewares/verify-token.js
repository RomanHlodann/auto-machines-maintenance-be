require('dotenv/config');

const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    token = token.replace('Bearer ', '');
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
};