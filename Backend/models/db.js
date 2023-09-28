const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString,
});

const createTable = () => {
  pool
    .query(
      `DROP TABLE likes CASCADE;
      DROP TABLE posts;
      DROP TABLE comments CASCADE;

      CREATE TABLE posts (
        post_id serial PRIMARY KEY,
        user_id integer REFERENCES users(id),
        title varchar,
        content text,
        image_url varchar,
        created_at TIMESTAMP DEFAULT NOW(),
        is_deleted SMALLINT DEFAULT 0
    );
    
    CREATE TABLE comments (
        comment_id serial PRIMARY KEY,
        user_id integer REFERENCES users(id),
        post_id integer REFERENCES posts(post_id),
        content text,
        created_at TIMESTAMP DEFAULT NOW(),
        is_deleted SMALLINT DEFAULT 0
    
    );
    CREATE TABLE likes (
        like_id serial PRIMARY KEY,
        user_id integer REFERENCES users(id),
        post_id integer REFERENCES posts(post_id),
        is_deleted SMALLINT DEFAULT 0
    );
    `
    )
    .then((result) => {
      console.log("result", result);
    })
    .catch((err) => {
      console.log(err);
    });
};
// createTable()
module.exports = { pool, bcrypt };
