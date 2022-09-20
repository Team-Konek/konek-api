const express = require('express');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.get('/user/:id', auth, (req, res) => {
  res.send('OK');
});

router.put('/user/:id', auth, (req, res) => {
  res.send('OK1');
});

router.delete('/user/:id', auth, (req, res) => {
  res.send('OK2');
});

router.post('/user', auth, (req, res) => {
  res.send('OK3');
});

router.get('/users', auth, (req, res) => {
  res.send('OK');
});

module.exports = router;