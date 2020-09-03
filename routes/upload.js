const express = require('express');
const router = express.Router();

// @ desc Upload page
// @route GET /upload
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('upload', {
      layout: 'main',
    });
  } else {
    res.render('upload', {
      layout: 'login',
    });
  }
});

module.exports = router;
