const express = require("express");

const {
  addCardsFromApi,
  getAllCards,
  deleteCardById,
  addCard,
  buyCard,
  getCardById,
  moreCard,
  getRandomCards,
  updateCrypto
} = require("../controller/cards");
const authentication = require("../middleware/authentication");

const cardRouter = express.Router();

cardRouter.post("/api", addCardsFromApi);
cardRouter.post("/", addCard);
cardRouter.get("/", getAllCards);
cardRouter.delete("/:id", deleteCardById);
cardRouter.post("/buy", authentication, buyCard);
cardRouter.get('/cardWithId',getCardById)
cardRouter.post('/moreCard',moreCard)
cardRouter.post('/getRandomCards',getRandomCards)
cardRouter.post('/updateCrypto',updateCrypto)


module.exports = cardRouter;

