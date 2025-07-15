const router = require('express').Router();
const { getCurrentUser ,toggleFollow } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.get('/me', auth, getCurrentUser);

router.post('/:id/follow', auth, toggleFollow);



module.exports = router;
