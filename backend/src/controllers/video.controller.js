const Video = require('../models/video.model');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const User = require('../models/user.model');

exports.uploadVideo = async (req, res) => {
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      folder: 'tiktik_videos',
    });

    // Save metadata to DB
    const newVideo = await Video.create({
      user: req.userId,
      caption: req.body.caption,
      videoUrl: result.secure_url,
      publicId: result.public_id,
    });

    // Delete local file
    fs.unlinkSync(req.file.path);

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ msg: 'Video upload failed', error: err.message });
  }
};

exports.getFeed = async (req, res) => {
    try {
      const videos = await Video.find()
        .populate('user', 'username') // Only get username of uploader
        .sort({ createdAt: -1 }); // Newest first
  
      res.json(videos);
    } catch (err) {
      res.status(500).json({ msg: 'Failed to fetch feed', error: err.message });
    }
  };

  exports.toggleLike = async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ msg: 'Video not found' });
  
      const userId = req.userId;
      const alreadyLiked = video.likes.includes(userId);
  
      if (alreadyLiked) {
        // Remove like
        video.likes.pull(userId);
      } else {
        // Add like
        video.likes.push(userId);
      }
  
      await video.save();
      res.json({ liked: !alreadyLiked, totalLikes: video.likes.length });
    } catch (err) {
      res.status(500).json({ msg: 'Like action failed', error: err.message });
    }
  };
  

  exports.addComment = async (req, res) => {
    try {
      const { body } = req.body;
      if (!body) return res.status(400).json({ msg: 'Comment cannot be empty' });
  
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ msg: 'Video not found' });
  
      const comment = { body, user: req.userId };
      video.comments.push(comment);
      await video.save();
  
      const savedComment = video.comments[video.comments.length - 1];
  
      res.status(201).json({ msg: 'Comment added', comment: savedComment });
    } catch (err) {
      res.status(500).json({ msg: 'Failed to comment', error: err.message });
    }
  };
  
  