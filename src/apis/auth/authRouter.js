import authControllers from "./authController";
import express from "express";
import asyncHandler from "express-async-handler";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.post("/register", asyncHandler(authControllers.register));
routes.post("/login", asyncHandler(authControllers.login));
routes.post("/refresh-token", asyncHandler(authControllers.refreshToken));
routes.post("/logout", authentication, asyncHandler(authControllers.logout));

module.exports = routes;
