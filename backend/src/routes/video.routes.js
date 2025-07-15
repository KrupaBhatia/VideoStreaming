const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const fs = require('fs');
const { uploadVideo, getFeed,toggleLike,addComment} = require('../controllers/video.controller');

// Define upload path
const uploadPath = 'uploads';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/upload', auth, upload.single('video'), uploadVideo);

router.get('/feed', auth, getFeed);

router.post('/:id/like', auth, toggleLike);

router.post('/:id/comment', auth, addComment);

module.exports = router;
