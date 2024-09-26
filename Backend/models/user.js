const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  database: 'blogs_db',
  password: 'user_pwd'
});

const show = async (id) => {
  const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return user;
};
const getbyEmail = async (email) => {
  const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return user;
};
const create = async (user) => {
  const [r] = await pool.query('INSERT INTO users VALUES(null, ?, ?, ?)', [user.name, user.email, user.password]);
  if (r.affectedRows === 1) {
    return show(r.insertId);
  }
};
const update = async (user, id) => {
  const fields = [];
  const values = [];
  Object.entries(user).forEach(([key, value]) => {
    if (key) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });
  values.push(id);
  const [r] = await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return r.affectedRows;
};

module.exports = { create, update, show, getbyEmail };
