import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Message } from "../models/message.model";

import { Chat } from "../models/chat.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    throw new ApiError(400, "Invalid data passed into request");
  }

  const newMessage = {
    senderId: req.user?._id,
    text: content,
    chatId: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("senderId", "userName avatar email");
    message = await message.populate({
      path: "chatId",
      populate: {
        path: "members",
        select: "userName avatar email",
      },
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message._id,
    });

    res.status(200).json(new ApiResponse(200, message, "Message sent successfully"));
  } catch (error) {
    throw new ApiError(400, "Failed to send message");
  }
});

export const allMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("senderId", "userName avatar email")
      .populate("chatId");

    res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
  } catch (error) {
    throw new ApiError(400, "Failed to fetch messages");
  }
});
