import express from "express";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerview); // localhost:4000/api/videos/:id/view

export default apiRouter;
