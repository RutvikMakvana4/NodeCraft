import express from "express";
import authRoutes from "../src/apis/auth/authRouter";
import userRoutes from "../src/apis/users/userRouter";
import postRoutes from "../src/apis/posts/postRouter";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/post", postRoutes);

module.exports = routes;
