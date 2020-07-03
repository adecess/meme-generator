const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { ensureAuthMeme } = require('../middleware/auth')
const router = express.Router()

// @ desc Upload page
// @route GET /upload
router.get('/', (req, res) => {
    if (req.isAuthenticated()){
        res.render('upload', {
            layout: 'main'
        })
    } else {
        res.render('upload', {
            layout: 'login'
        })
    }   
})

// multer function
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }

        cb(undefined, true);
    }
});

// @ desc Upload page
// @route POST /upload/portfolio
router.post('/meme', ensureAuthMeme, upload.single('meme'), async (req, res) => {
    console.log(req.user)
    
    // res.send()

    // res.redirect('/dashboard')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router