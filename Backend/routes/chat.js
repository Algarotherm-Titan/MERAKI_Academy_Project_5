const express = require("express");
const { sendMessage, getMessagesForUsers } = require("../controller/chat");

const chatRouter = express.Router();
chatRouter.post("/", sendMessage);

chatRouter.get("/:sender_id/:receiver_id", getMessagesForUsers);

module.exports = chatRouter;
