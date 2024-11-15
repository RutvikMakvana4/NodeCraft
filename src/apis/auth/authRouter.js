import authControllers from "./authController";
import express from "express";
import asyncHandler from "express-async-handler";

const routes = express.Router();

routes.post("/register", asyncHandler(authControllers.register));

module.exports = routes;
