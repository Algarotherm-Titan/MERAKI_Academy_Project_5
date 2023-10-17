const { pool, bcrypt } = require("../models/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, password, email, image, role_id } = req.body;
    const theEmail = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(theEmail, [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = `INSERT INTO users
    (username,password,email,image,role_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id`;
    const userData = await pool.query(newUser, [
      username,
      hashedPassword,
      email,
      image,
      role_id,
    ]);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      userId: userData.rows[0].id,
    });
  } catch (error) {
    console.error(`Error creating acount`, error);
    return res.status(500).json({
      message: "Error creating acount",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await pool.query(`SELECT * FROM users WHERE email =$1`, [
      email,
    ]);
    if (findUser.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
      });
    }
    const user = findUser.rows[0];

    const thePassword = await bcrypt.compare(password, user.password);
    if (!thePassword) {
      return res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
      });
    }
    const payload = {
      userId: user.id.toString(),
      role: user.role,
      username: user.username,
      user: user,
    };
    const secretKey = process.env.SECRET || "dark";
    const token = jwt.sign(payload, secretKey, { expiresIn: "900m" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      userId: user.id,
      role: user.role,
      user: user,
    });
  } catch (error) {
    console.error(`Error creating acount`, error);
    return res.status(500).json({
      message: "Error login acount",
      success: false,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await pool.query(`SELECT users.* ,  
    (SELECT JSON_AGG(user_cards.*) FROM user_cards WHERE user_cards.user_id = users.id) AS user_cards 
    FROM users`);
    if (response) {
      res.status(200).json(response.rows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
};

const userByUserName = (req, res) => {
  try {
    const username = req.params.username;
    const query = `SELECT * FROM users WHERE username LIKE $1`;
    const data = ["%" + username + "%"];
    pool.query(query, data).then((result) => {
      if (result) {
        res.status(201).json({
          success: true,
          data: result.rows,
          // name: result,
        });
      }
    });
  } catch (err) {
    res.status(401);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

const getUserById = (req, res) => {
  try {
    const id = req.params.id;
    const query = `SELECT * FROM users WHERE id = $1`;
    const data = [id];
    pool.query(query, data).then((result) => {
      if (result) {
        res.status(201).json({
          success: true,
          message: `The posts with id: ${id}`,
          data: result.rows[0],
        });
      }
    });
  } catch (err) {
    res.status(401);
    res.json({
      success: false,
      message: "Server error",
      message: err.message,
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const user_id = req.token.userId;
    const { password, confirm_password, old_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const { rows } = await pool.query("SELECT password FROM users WHERE id = $1", [user_id]);

    if (rows.length === 1) {
      const currentHashedPassword = rows[0].password;

      const passwordsMatch = await bcrypt.compare(old_password, currentHashedPassword);

      if (passwordsMatch) {
        const hashedPassword = await bcrypt.hash(password, 10); 

        const updateQuery = `
          UPDATE users
          SET
          password = COALESCE($1, password)
          WHERE id = $2
          RETURNING *;
        `;

        const data = [hashedPassword || null, user_id];

        const result = await pool.query(updateQuery, data);

        if (result.rows.length !== 0) {
          return res.status(200).json({
            success: true,
            message: `User with id: ${user_id} updated successfully`,
            result: result.rows[0],
          });
        } else {
          throw new Error("Error happened while updating user");
        }
      } else {
        throw new Error("Old password does not match the current password");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};

//since when we change image in facebook and make ask about my name !!
const updateUserImage = async (req, res) => {
  try {
    const user_id = req.token.userId;
    const { image, username, confirm_username } = req.body;
    console.log("Received request data:", { image, username, confirm_username });

    if (username !== confirm_username) {
      return res.status(400).json({
        success: false,
        message: "New username and confirm username do not match",
      });
    }

    const query = `
      UPDATE users
      SET
      image = COALESCE($1, image),
      username = COALESCE($2, username)
      WHERE id = $3
      RETURNING *;
    `;

    const data = [image || null, username || null, user_id];

    const result = await pool.query(query, data);

    if (result) {
      res.status(200).json({
        success: true,
        message: `User with id: ${user_id} updated successfully`,
        result: result.rows[0],
      });
    }
    console.log("Updated user data:", result.rows[0]);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
}
module.exports = {
  register,
  login,
  getAllUsers,
  userByUserName,
  getUserById,
  updateUserById,
  updateUserImage,
};
