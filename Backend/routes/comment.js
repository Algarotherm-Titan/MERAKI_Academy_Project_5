const express = require("express");
const {
    addcomment,
    getCommentByPost,
    updateCommentsById,
    deleteCommentById
} = require("../controller/comment");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const notification = require("../controller/notification")


const commentRouter = express.Router();

<<<<<<< HEAD
commentRouter.post("/:id",authentication, addcomment,);
commentRouter.get("/:id",authentication, getCommentByPost);
=======
commentRouter.post("/:id",authentication, addcomment);
commentRouter.get("/:id", getCommentByPost);
>>>>>>> 0a84f5bec3b67af9ba6459a122fad0ee164814fb
commentRouter.put("/:id", updateCommentsById);
commentRouter.delete("/:id",deleteCommentById);


module.exports = commentRouter;
