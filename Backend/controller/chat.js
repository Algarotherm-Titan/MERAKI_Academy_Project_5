const { pool } = require("../models/db");

const sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message_text } = req.body;

    const query =
      "INSERT INTO messages (sender_id, receiver_id, message_text) VALUES ($1, $2, $3) RETURNING message_id";
    const values = [sender_id, receiver_id, message_text];
    const result = await pool.query(query, values);

    res
      .status(201)
      .json({
        message: "Message created",
        message_id: result.rows[0].message_id,
      });
  } catch (error) {
    console.error("Error in sendMessage function:", error.message);
    throw error;
  }
};
const getMessagesForUsers = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;
    const query =
      "SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)";

    const values = [sender_id, receiver_id];

    const result = await pool.query(query, values);
    res.status(200).json({ messages: result.rows });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error retrieving messages" });
  }
};

module.exports = {
  sendMessage,
  getMessagesForUsers,
};
