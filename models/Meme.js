const mongoose = require('mongoose')

const MemeSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  })

  module.exports = mongoose.model('Meme', MemeSchema)