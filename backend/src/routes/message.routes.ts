import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { sendMessage, allMessages } from "../controllers/message.controller";

const router = Router();

router.use(verifyJWT);

router.route("/").post(sendMessage);
router.route("/:chatId").get(allMessages);

export default router;
