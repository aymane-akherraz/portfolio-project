const { Router } = require('express');
const blog = require('../models/blog');
const authmiddleware = require('../Middlewares/authMiddleware');
const fs = require('fs').promises;
const router = Router();

router.get('/', async (req, res) => {
  try {
    const blogs = await blog.all();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});
router.get('/blog/:id', async (req, res) => {
  try {
    const blogInfo = await blog.getBlog(req.params.id);
    res.status(200).json(blogInfo);
  } catch (error) {
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});
router.get('/blogs/:id', async (req, res) => {
  try {
    const content = await blog.getBlogContent(req.params.id);

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});
router.use(authmiddleware);

router.get('/myblogs/:id', async (req, res) => {
  try {
    const blogList = await blog.userBlogs(req.params.id);
    res.status(200).json(blogList);
  } catch (error) {
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});

router.post('/blogs/create', async (req, res) => {
  try {
    const r = await blog.create(req.body);
    res.status(201).json(r);
  } catch (error) {
    console.log(error);
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});

router.delete('/myblogs/:id', async (req, res) => {
  try {
    const imgName = await blog.getImg(req.params.id);
    if (imgName) {
      const filePath = `public/images/${imgName}`;
      await fs.unlink(filePath);
    }
    const r = await blog.deleteBlog(req.params.id);
    if (r === 1) {
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});
router.put('/myblogs/:id', async (req, res) => {
  try {
    const r = await blog.update(req.body, req.params.id);
    if (r === 1) {
      res.status(200).json('Successfully updated !');
    }
  } catch (error) {
    res.status(500).json('Oops! Something went wrong, please try again later');
  }
});
module.exports = router;
