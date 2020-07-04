const mongoose = require('mongoose')

const MemeSchema = new mongoose.Schema({
    image: {
      type: String,
      required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  })

  module.exports = mongoose.model('Meme', MemeSchema)