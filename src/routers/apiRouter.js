import express from "express";
import { registerView, createComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView); // localhost:4000/api/videos/:id/view
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment); // localhost:4000/api/videos/:id/comment

export default apiRouter;
