import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { accessChat, fetchChats, createGroupChat } from "../controllers/chat.controller";

const router = Router();

router.use(verifyJWT); // Protect all routes

router.route("/").post(accessChat);
router.route("/").get(fetchChats);
router.route("/group").post(createGroupChat);

export default router;
