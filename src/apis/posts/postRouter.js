import postControllers from "./postController";
import express from "express";
import authentication from "./../../common/middleware/authentication";
import asyncHandler from "express-async-handler";

const routes = express.Router();

routes.post(
  "/upload",
  authentication,
  asyncHandler(postControllers.uploadPost)
);

routes.post(
  "/comment/:id",
  authentication,
  asyncHandler(postControllers.giveCommentOnPost)
);

routes.get("/all", authentication, asyncHandler(postControllers.getAllPosts));

module.exports = routes;
