const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')

const Meme = require('../models/Meme')

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @ desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
      const memes = await Meme.find({ owner: req.user.id }).lean()
      res.render('dashboard', {
        name: req.user.firstName,
        memes,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

// multer static upload file
const upload = multer({
    dest: 'public/img',
    limits: {
        fileSize: 1000000
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

// @ desc Dashboard meme upload
// @route POST /dashboard/upload
router.post('/dashboard/upload', ensureAuth, upload.single('meme'), async(req, res) => {
    try {
        await Meme.create({
            image: '/img/' + req.file.filename,
            owner: req.user._id
        })
        res.redirect('/dashboard')
      } catch (err) {
        console.error(err)
        res.render('error/500')
      }
})

// @ desc Dashboard meme delete
// @route POST /dashboard/delete
// tbd

module.exports = router