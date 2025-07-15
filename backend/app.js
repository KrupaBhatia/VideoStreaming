const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth.routes'));

const auth = require('./src/middleware/auth.middleware');

app.get('/api/protected', auth, (req, res) => {
  res.json({ msg: `Hello user ${req.userId}` });
});

app.use('/api/user', require('./src/routes/user.routes'));

app.use('/api/video', require('./src/routes/video.routes'));

module.exports = app;
