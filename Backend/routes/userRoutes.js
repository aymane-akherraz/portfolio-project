const { Router } = require('express');
const user = require('../models/user');
const authmiddleware = require('../Middlewares/authMiddleware');
const router = Router();

router.use(authmiddleware);
router.get('/checkAuth', async (req, res) => {
  const userInfo = await user.show(req.decoded);
  if (userInfo) {
    delete userInfo.password;
    return res.status(200).json(userInfo);
  }
  res.status(500).json('Oops! Something went wrong, please try again later');
});

router.put('/profile/update/:id', async (req, res) => {
  const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)*$/;
  try {
    if (req.body.email && !emailRe.test(req.body.email)) {
      return res.status(400).json('Invalid email address !');
    } else {
      const rows = await user.update(req.body, req.params.id);
      if (rows === 1) {
        return res.status(200).json('Successfully updated !');
      }
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json('Email address already exists !');
    } else {
      res.status(500).json('Oops! Something went wrong, please try again later');
    }
  }
});

router.get('/logout', async (req, res) => {
  res.status(200).cookie('jwt', '', { maxAge: 1 }).send('');
});

module.exports = router;
