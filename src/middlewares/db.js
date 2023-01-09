const db = (req, res, next) => {
  try {
    const knex = require('knex')({
      client: 'mysql',
      connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'root',
        password : '',
        database : 'konek'
      }
    });
  
    req.db = knex;
    next();
  } catch (error) {
    return res.status(500).send({ 
      success: false,
      message: 'Error connecting to the database',
      error: error
    });
  }
};

module.exports = db;
