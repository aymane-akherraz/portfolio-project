const express = require('express');
require('dotenv').config();
const authRouter = require('./routes/authRoutes');
const blogRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const cors = require('cors');

app.listen(5000);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });
app.post('/upload', upload.single('file'), async (req, res) => {
  res.json(req.file.filename);
});
app.use(authRouter);
app.use(blogRouter);
app.use(userRouter);
