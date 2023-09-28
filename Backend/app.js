const express = require("express");
const app = express();
require("dotenv").config();
require("./models/db");
app.use(express.json());
const cors = require("cors");


const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const postsRouter = require("./routes/posts");
const roleRouter = require("./routes/role");
const permissionRouter = require("./routes/permission");
const userRouter = require("./routes/User");
const friendRoutes = require('./routes/friends');
const commentRouter = require('./routes/comment');
const notificationRouter = require('./routes/notification');
const likeRouter = require('./routes/like');



app.use(cors(corsOptions));
app.use("/permission", permissionRouter);
app.use("/posts", postsRouter);
app.use("/", roleRouter);
app.use("/", userRouter);
app.use("/", friendRoutes);
app.use("/comment", commentRouter);
app.use("/notif", notificationRouter);
app.use("/like", likeRouter);


app.use("*", (req, res) => res.status(404).json("No content at this path"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
