const mongoose = require('mongoose');

// 1️⃣ Define comment subdocument schema
const commentSchema = new mongoose.Schema(
  {
    body: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true } 
);

// 2️⃣ Define video schema
const videoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    videoUrl: { type: String, required: true },
    publicId: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
