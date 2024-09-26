const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  database: 'blogs_db',
  password: 'user_pwd'
});

const getBlog = async (id) => {
  const [[r]] = await pool.query('SELECT title, created_at AS "creationDate", name AS "author", img FROM blogs join users on author_id = users.id WHERE blogs.id = ?', [id]);
  return r;
};
const all = async () => {
  const [r] = await pool.query('SELECT blogs.id, title, summary, created_at, name, img FROM blogs join users on author_id = users.id');
  return r;
};
const getBlogContent = async (id) => {
  const [[r]] = await pool.query('SELECT content FROM blogs WHERE id = ?', [id]);
  return r.content;
};
const userBlogs = async (id) => {
  const [r] = await pool.query('SELECT blogs.id, title, summary, created_at, name, img FROM blogs join users on author_id = users.id where author_id = ?', [id]);
  return r;
};
const getDate = async (id) => {
  const [[r]] = await pool.query('SELECT created_at FROM blogs WHERE blogs.id = ?', [id]);
  return r;
};
const create = async (blog) => {
  let sqlqy = 'INSERT INTO blogs(author_id, title, summary, content) VALUES(?, ?, ?, ?)';
  const values = [blog.author_id, blog.title, blog.summary, blog.content];

  if (blog.img) {
    sqlqy = 'INSERT INTO blogs(author_id, title, summary, content, img) VALUES(?, ?, ?, ?, ?)';
    values.push(blog.img);
  }
  const [r] = await pool.query(sqlqy, values);
  if (r.affectedRows === 1) {
    const d = await getDate(r.insertId);
    return { id: r.insertId, date: d };
  }
};
const deleteBlog = async (id) => {
  const [r] = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
  return r.affectedRows;
};
const update = async (blog, id) => {
  const fields = [];
  const values = [];
  Object.entries(blog).forEach(([key, value]) => {
    if (key) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });
  values.push(id);
  const [r] = await pool.query(`UPDATE blogs SET ${fields.join(', ')} WHERE id = ?`, values);
  return r.affectedRows;
};
const getImg = async (id) => {
  const [[r]] = await pool.query('SELECT img FROM blogs WHERE blogs.id = ?', [id]);
  return r.img;
};
module.exports = { getBlog, all, getBlogContent, userBlogs, create, deleteBlog, update, getImg };
