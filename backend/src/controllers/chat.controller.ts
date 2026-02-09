import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Chat } from "../models/chat.model";

import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";


export const accessChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "UserId param not sent with request");
  }


  let isChat = await Chat.find({
    isGroup: false,
    $and: [
      { members: { $elemMatch: { $eq: req.user?._id } } },
      { members: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("members", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "senderId",
        select: "userName avatar email",
      },
    });


  if (isChat.length > 0) {
    res.status(200).json(new ApiResponse(200, isChat[0], "Chat retrieved successfully"));
  } else {
    // Create new chat
    const chatData = {
      chatName: "sender",
      isGroup: false,
      members: [req.user?._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "members",
        "-password"
      );
      res.status(200).json(new ApiResponse(200, FullChat, "Chat created successfully"));
    } catch (error) {
      throw new ApiError(400, "Failed to create chat");
    }
  }
});

export const fetchChats = asyncHandler(async (req: Request, res: Response) => {
  try {
    let results = await Chat.find({
      members: { $elemMatch: { $eq: req.user?._id } },
    })
      .populate("members", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "senderId",
          select: "userName avatar email",
        },
      })
      .sort({ updatedAt: -1 });

   
    results = results.filter((c) => {
        if (c.isGroup) return true;
        return !!c.latestMessage;
    });


    res.status(200).json(new ApiResponse(200, results, "Chats fetched successfully"));
  } catch (error) {
    throw new ApiError(400, "Failed to fetch chats");
  }
});


export const createGroupChat = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.users || !req.body.name) {
    throw new ApiError(400, "Please fill all the fields");
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    throw new ApiError(400, "More than 2 users are required to form a group chat");
  }

  // Add current user to group
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroup: true,
      members: users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(new ApiResponse(200, fullGroupChat, "Group Chat Created"));
  } catch (error) {
    throw new ApiError(400, "Failed to create group chat");
  }
});
