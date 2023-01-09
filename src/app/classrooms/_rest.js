const express = require('express');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.get('/classroom/:id', auth, (req, res) => {
  res.send('OK');
});

router.put('/classroom/:id', auth, (req, res) => {
  res.send('EDITING');
});

router.delete('/classroom/:id', auth, (req, res) => {
  res.send('DELETING');
});

router.post('/classroom', auth, (req, res) => {
  res.send('LOADING');
});

router.get('/classrooms', auth, (req, res) => {
  res.send('OK');
});

module.exports = router;