const express = require('express');
const auth = require('../../middlewares/auth');
const db = require('../../middlewares/db');
const dao = require('./users-dao');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');


// Register a new user
router.post('/register', db, dao, asyncHandler (async (req, res) => {
  const user = req.body;
  // Validate input
  if (!user.username || !user.password) {
    return res.status(400).send({ 
      message: 'Username and password are required' 
    });
  }
  // Check if the user already exists
  const hasUser = await req.db('users').where('username', user.username).first();
    if (hasUser) {
      return res.status(400).send({ 
        message: 'Username already exists' 
      });
    }
    // Hash the password
    try {
      const hash = await bcrypt.hash(user.password, 10);
      // Insert the new user into the database
      const result = await req.db('users')
        .insert({
          USERNAME: user.username,
          PASSWORD: hash,
          FIRSTNAME: user.firstname,
          LASTNAME: user.lastname,
          EMAIL: user.email,
          ROLE: user.role
        });
        const userId = result[0];
        await req.db('users_logs')
        .insert({
          CREATED_ACC_AT: req.db.fn.now(),
          USER_ID: userId
        });
      // Create a JWT token (optional)
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(201).send({
        success: true,
        message: 'Registration successful',
        data: {
          uuid: result[0],
          ...user
        },
        token: token
      });
    } catch (error) {
      return res.status(500).send({
        success: false, 
        message: 'Error registering user',
        error: error
      });
    }
}));

// User login
router.post('/login', db, dao, asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ 
      message: 'Username and password are required' 
    });
  }

  const user = await req.db('users').where({username}).first();
  if (!user) {
    return res.status(400).send({
      message: 'Username not found'
    });
  }
  // Validate user's hashed password
  try {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({
        valid: false,
        message: 'Invalid login credentials'
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false, 
      message: 'Error checking password',
      error: error
    });
  }
  // Create logs
  await req.db('users_logs')
  .where({user_id: user.uuid})
  .update({logged_in_at: req.db.fn.now()})
  // Create a JWT token
  const token = jwt.sign({ id: user.uuid }, process.env.JWT_SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
  res.status(200).send({
    valid: true,
    message: 'Login successful',
    data: user,
    token: token
  });
}));

// Get all users
router.get('/users', db, auth, asyncHandler(async (req, res) => {
  try {
    const users = await req.db('users').select();
    res.status(200).send({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).send({ 
      success: false,
      message: 'Error fetching users',
      error: error
    });
  }
}));


// Get User info
router.get('/user/:uuid', db, auth, asyncHandler(async (req, res) => {
  const uuid = req.params.uuid;
  const user = await req.db('users').select().where('UUID', uuid).first();
  if(!user){
    return res.status(404).send({
      success: false,
      message: 'User not found'
    });
  }
  res.status(200).send({
    success: true,
    data: user
  });
}));

// Update user info
router.put('/user/:uuid', db, auth, asyncHandler(async (req, res) => {
  const uuid = req.params.uuid;
  const user = req.body;
  const id = await req.db('users').select().where('UUID', uuid).first();
  console.log(id);
  if(!id){
    return res.status(404).send({
      success: false,
      message: 'User not found'
    });
  }
  
  try{
    const result = await req.db('users')
      .where('UUID', uuid)
      .update({
        USERNAME: user.username,
        PASSWORD: user.password,
        FIRSTNAME: user.firstname,
        LASTNAME: user.lastname,
        EMAIL:user.email,
        ROLE: user.role
      });
    if (result === 0) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    return res.status(500).send({ 
      success: false,
      message: 'Error updating user',
      error: error
    });
  }
  
  res.status(200).send({
    success: true,
    data: {
      uuid, ...user
    }
  });
}));

// Delete a user
router.delete('/user/:uuid', db, auth, asyncHandler(async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const result = await req.db('users')
      .where('UUID', uuid)
      .del();
    if (result === 0) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    return res.status(500).send({ 
      success: false,
      message: 'Error deleting user',
      error: error
    });
  }
  res.status(202)({
    success: true,
    message: 'User has been deleted'
  });
}));


module.exports = router;