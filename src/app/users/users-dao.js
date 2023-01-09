const db = require('../../middlewares/db');
const asyncHandler = require('express-async-handler');

const userDao = (db, asyncHandler(async (req, res, next) => {
  const hasTable = async () => {
    try {
      await req.db.raw(`SELECT * FROM users LIMIT 1`)
      return true;
    } catch (error) {
      return false;
    }
  }
  
  const createTable = async () => {
    try {
      await req.db.schema.createTable('classroom', async (table) => {
        table.increments('uuid').primary();
        table.string('subject').notNullable().unique();
        table.string('description').nullable();
      })
      .then(async () => {
        await req.db.schema.createTable('users', async (table) => {
          table.increments('uuid').primary();
          table.string('username').notNullable().unique();
          table.string('password').notNullable();
          table.string('firstname').notNullable();
          table.string('lastname').notNullable();
          table.string('email').notNullable();
          table.string('role').notNullable();
        })
      })
      .then(async () => {
        await req.db.schema.createTable('users_logs', async (table) => {
          table.increments('log_id').primary();
          table.timestamp('created_acc_at').notNullable();
          table.timestamp('updated_acc_at').nullable();
          table.timestamp('logged_in_at').nullable();
          table.timestamp('logged_out_at').nullable();
          table.timestamp('joined_room_at').nullable();
          table.timestamp('left_room_at').nullable();
          table.timestamp('created_quiz_at').nullable();
          table.timestamp('submitted_at').nullable();
          table.integer('user_id')
          .unsigned()
          .notNullable()
          .references('uuid')
          .inTable('users')
          .onDelete('CASCADE');
        })
      })
    } catch (error) {
      return res.status(500).send({ 
        error: 'Error creating user tables' 
      });
    }
  }
  
  const main = async () => {
    if (!await hasTable()) {
      await createTable();
    }
    req.userDao = userDao;
    next();
  }

  main();
}));

module.exports=userDao;
