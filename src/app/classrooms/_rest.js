const express = require('express');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.put('/classroom/:id', auth, (req, res) => {
  res.send('EDITING');
});


router.get('/classroom/:id', auth, (req, res) => {
  res.send('OK');
});


router.get('/classrooms', auth, (req, res) => {
  res.send('OK');
});


router.post('/classroom', auth, (req, res) => {
  res.send('LOADING');
});


router.delete('/classroom/:id', auth, (req, res) => {
  res.send('DELETING');
});

module.exports = router;