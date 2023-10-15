const { pool } = require("../models/db");
const axios = require("axios");
const addCardsFromApi = (req, res) => {
  const api_url =
    "https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&attribute=dark";

  fetch(api_url)
    .then((response) => response.json())
    .then((apiData) => {
      if (apiData) {
        const cardData = apiData.data[25];
        const { name, desc, card_images, archetype, atk, card_prices } =
          cardData;

        const query = `INSERT INTO cards (card_name, card_description, card_image, card_type, attack, card_prices) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;

        const data = [
          name,
          desc,
          card_images[0].image_url,
          archetype,
          atk,
          Math.round(parseFloat(card_prices[0].amazon_price) * 100),
        ];

        console.log(Math.round(parseFloat(card_prices[0].amazon_price)));
        pool
          .query(query, data)
          .then((result) => {
            res.status(200).json({
              success: true,
              message: "Card created successfully",
              result: result.rows[0],
            });
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              message: "Server error",
              err: err.message,
            });
          });
      } else {
        res.status(500).json({
          success: false,
          message: "API response does not contain card data",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Failed to fetch data from the API",
        err: err.message,
      });
    });
};

const addCard = (req, res) => {
  const {
    card_name,
    card_description,
    card_image,
    archetype,
    attack,
    card_prices,
  } = req.body;

  const query = `INSERT INTO YAMI_CARDS (card_name, card_description, card_image, archetype, attack, card_prices) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
  const data = [
    card_name,
    card_description,
    card_image,
    archetype,
    attack,
    card_prices,
  ];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Card created successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const getAllCards = async (req, res) => {
  try {
    const response = await pool.query(`SELECT * FROM cards`);
    if (response) {
      res.status(200).json(response.rows);
    } else {
      console.log("err", err.message);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err);
  }
};

const deleteCardById = (req, res) => {
  const card_id = req.params.id;
  const query = `DELETE FROM app_cards 
    WHERE card_id = $1;`;
  const data = [card_id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        res.status(200).json({
          success: true,
          message: `Card with id:  deleted successfully`,
        });
      } else {
        throw new Error("Error happened while deleting Card");
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

const buyCard = async (req, res) => {
  const { card_id, lootPrice } = req.body;
  const user_id = req.token.userId;

  try {
    const cardQuery = await pool.query(
      "SELECT card_prices FROM app_cards WHERE card_id = $1",
      [card_id, lootPrice]
    );

    if (cardQuery.rows.length === 0) {
      return res.status(400).json({ message: "Card not found" });
    }

    const userQuery = await pool.query(
      "SELECT crypto_amount FROM users WHERE id = $1",
      [user_id]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const userCryptoAmount = userQuery.rows[0].crypto_amount;

    await pool.query("BEGIN");

    if (userCryptoAmount >= cardPrice) {
      await pool.query(
        "UPDATE users SET crypto_amount = crypto_amount - $1 WHERE id = $2",
        [cardPrice, user_id]
      );

      await pool.query(
        "INSERT INTO user_cards (user_id, card_id) VALUES ($1, $2)",
        [user_id, card_id]
      );

      await pool.query("COMMIT");

      res.status(200).json({ message: "Card purchased successfully" });
    } else {
      await pool.query("ROLLBACK");
      res
        .status(400)
        .json({ message: "Insufficient crypto balance to buy this card" });
    }
  } catch (error) {
    console.error("Error buying card:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCardById = async (req, res) => {
  const cardId = req.params.id;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM app_cards WHERE card_id = $1",
      [cardId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "Card not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ----------------------------------------------------------------------
const moreCard = async (req, res) => {
  try {
    for (const card of cardData) {
      const { name, regions, assets, type, attack } = card;
      if (type === "Unit") {
        await pool.query(
          "INSERT INTO Cards  (card_name, card_regions, card_image, card_type, attack) VALUES ($1, $2, $3, $4, $5)",
          [name, regions, assets[0].gameAbsolutePath, type, attack]
        );
      }
    }

    res
      .status(200)
      .json({ message: "Data fetched and inserted successfully." });
  } catch (error) {
    console.error("Error fetching and inserting data:", error.message);
    res.status(500).json(error.message);
  }
};

const getRandomCards = async (req, res) => {
  try {
    const { lootPrice, userId } = req.body;

    if (typeof lootPrice !== "number" || isNaN(lootPrice) || lootPrice < 0) {
      return res.status(400).json({ error: "Invalid lootPrice" });
    }

    const userRows = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    console.log("SQL Query:", "SELECT * FROM users WHERE id =", userId);
    console.log("User Rows:", userRows.rows);
    if (userRows.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const cryptoAmount = userRows.rows[0].crypto_amount; // Access 'rows' property
    const newCryptoAmount = cryptoAmount - lootPrice;

    await pool.query("UPDATE users SET crypto_amount = $1 WHERE id = $2", [
      newCryptoAmount,
      userId,
    ]);

    const rows = await pool.query(
      "SELECT * FROM cards ORDER BY RANDOM() LIMIT 5"
    );
    console.log(rows.rows);
    const randomCards = rows.rows.map((row) => row.card_id); // Access 'rows' property
    const image = rows.rows.map((row) => row.card_image)
    for (const card of randomCards) {
      await pool.query(
        "INSERT INTO user_cards (user_id, card_id) VALUES ($1, $2)",
        [userId, card]
      );
    }
    res.json({ randomCards, cryptoAmount: newCryptoAmount ,image});
  } catch (error) {
    console.error("Error in getRandomCards:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  addCardsFromApi,
  getAllCards,
  deleteCardById,
  addCard,
  getCardById,
  buyCard,
  moreCard,
  getRandomCards,
};
