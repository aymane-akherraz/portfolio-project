const { Router } = require('express');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const jwt = require('jsonwebtoken');

const router = Router();

const maxAge = 60 * 60 * 24;

const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

router.post('/signup', async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync();
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    const userObj = await user.create(req.body);
    const token = genToken(userObj.id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'strict' });
    delete userObj.password;
    res.status(200).json(userObj);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json('Email address already exists !');
    }
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usr = await user.getbyEmail(email);
  if (usr === undefined) {
    return res.status(401).json('Sorry, unrecognized username or password');
  }
  try {
    const match = await bcrypt.compare(password, usr.password);
    if (match) {
      const token = genToken(usr.id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'strict' });
      delete usr.password;
      res.status(200).json(usr);
    } else {
      return res.status(401).json('Sorry, unrecognized username or password');
    }
  } catch (err) {
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});
module.exports = router;
