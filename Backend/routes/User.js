const express = require("express");
const userRouter = express.Router();
const { register, login, getAllUsers ,userByUserName,getUserById,updateUserById,updateUserImage} = require("../controller/Users");
const authentication = require("../middleware/authentication");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/getAllUser", getAllUsers);
userRouter.get("/:username", userByUserName);
userRouter.get("/:id", getUserById);
userRouter.put("/",authentication, updateUserById);
userRouter.put("/image",authentication, updateUserImage);

module.exports = userRouter;
