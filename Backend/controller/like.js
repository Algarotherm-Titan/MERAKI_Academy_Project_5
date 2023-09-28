const { pool } = require("../models/db");

const addLike = async (req, res) => {
  const user_id = req.token.userId;
  const post_id = req.params.id;

  try {
    const likeQuery = `INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *`;
    const likeData = [user_id, post_id];
    const likeResult = await pool.query(likeQuery, likeData);
    const result = likeResult.rows[0];

    res.status(200).json({
      success: true,
      message: "Like created successfully",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};

const getLikesByPost = (req, res) => {
  const post_id = req.params.id;
  const query = `SELECT * FROM likes WHERE post_id = $1;`;
  const data = [post_id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `The post: ${post_id} has no likes`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All likes for the post: ${post_id}`,
          result: result.rows,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const deleteLikeById = async (req, res) => {
    const user_id = req.token.userId;
    const like_id = req.params.id;
  
    try {
      
      const deleteLikeQuery = `
        DELETE FROM likes
        WHERE user_id = $1 AND like_id = $2
        RETURNING *
      `;
      const deleteLikeData = [user_id, like_id];
      const deletedLikeResult = await pool.query(deleteLikeQuery, deleteLikeData);
      const deletedLike = deletedLikeResult.rows[0];
  
      res.status(200).json({
        success: true,
        message: "Like deleted successfully",
        result: deletedLike,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    }
};

module.exports = {
  addLike,
  deleteLikeById,
  getLikesByPost,
};
