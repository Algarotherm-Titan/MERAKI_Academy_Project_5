const express = require("express");
const {
    addLike,
    deleteLikeById,
    getLikesByPost
} = require("../controller/like");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");


const likeRouter = express.Router();

likeRouter.post("/:id",authentication, addLike);
likeRouter.get("/:id", getLikesByPost);
likeRouter.delete("/:id",authentication,deleteLikeById);


module.exports = likeRouter;