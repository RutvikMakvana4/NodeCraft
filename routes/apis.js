import express from "express";
import authRoutes from "../src/apis/auth/authRouter";
import userRoutes from "../src/apis/users/userRouter";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);

module.exports = routes;
