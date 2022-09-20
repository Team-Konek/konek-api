const express = require('express');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.get('/classroom/:id', auth, (req, res) => {
  res.send('OK');
});

router.put('/classroom/:id', auth, (req, res) => {
  res.send('OK');
});

router.delete('/classroom/:id', auth, (req, res) => {
  res.send('OK');
});

router.post('/classroom', auth, (req, res) => {
  res.send('OK');
});

router.get('/classrooms', auth, (req, res) => {
  res.send('OK');
});

module.exports = router;