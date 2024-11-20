import userControllers from "./userController";
import express from "express";
import authentication from "./../../common/middleware/authentication";
import asyncHandler from "express-async-handler";

const routes = express.Router();

routes.get(
  "/profile",
  authentication,
  asyncHandler(userControllers.profileDetails)
);

routes.get("/list", authentication, asyncHandler(userControllers.userList));

module.exports = routes;
