const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('Login', {
        layout: 'login'
    })
})

// @ desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {
        name: req.user.firstName
    })
})

// @ desc Dashboard meme upload
// @route POST /dashboard/upload
router.get('/dashboard/upload', ensureAuth, (req, res) => {
    
})

module.exports = router