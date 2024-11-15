import authControllers from "./authController";
import express from "express";
import asyncHandler from "express-async-handler";

const routes = express.Router();

routes.post("/register", asyncHandler(authControllers.register));
routes.post("/login", asyncHandler(authControllers.login));

module.exports = routes;
