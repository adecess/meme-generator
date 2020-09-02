const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const aws = require("aws-sdk")
const multer = require('multer')
const multerS3 = require("multer-s3")
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

// Initialize S3 connection and config
const s3 = new aws.S3()
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "eu-west-3"
});

// File type validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
}

// multer static upload file
const upload = multer({
  fileFilter,
  limits: { fileSize: 1000000 },
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  }),
})

// @ desc Dashboard meme upload
// @route POST /dashboard/upload
router.post('/dashboard/upload', ensureAuth, upload.single('meme'), async(req, res) => {
    try {
        await Meme.create({
            image: req.file.location,
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
router.delete('/memes/:id', ensureAuth, async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id)
    if (!meme) {
      res.status(404).send
    }
    
    const params = await {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: meme.image.match(/meme-\d+\.(jpg|png)/)[0]
    }
    await s3.headObject(params).promise()
    console.log("File Found in S3")
    try {
      await s3.deleteObject(params).promise()
      console.log("file deleted Successfully")
    }
    catch (err) {
        console.log("ERROR in file Deleting : " + JSON.stringify(err))
    }

    await meme.remove()

    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router