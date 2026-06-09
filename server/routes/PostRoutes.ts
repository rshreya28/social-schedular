import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import { getGenerations, getPosts, schedulePosts, generatePost } from "../controllers/postController.js";
import { upload } from "../config/multer.js";

const postRouter = express.Router();

postRouter.get('/', protect, getPosts);
postRouter.get('/generations', protect, getGenerations);
postRouter.post('/', protect, upload.single("media"), schedulePosts);
postRouter.post('/generate', protect, generatePost);

export default postRouter;
