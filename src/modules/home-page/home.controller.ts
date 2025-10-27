
import { Router } from "express";
import { verifyToken } from "../../middlwares";
import homeServices from "./home.services";
const homeRouter = Router()

homeRouter.get("/search",verifyToken,homeServices.search)
homeRouter.get("/", verifyToken, homeServices.getFeedsPosts)
homeRouter.get("/search/:userId",verifyToken,homeServices.getUserPosts)

export {homeRouter}