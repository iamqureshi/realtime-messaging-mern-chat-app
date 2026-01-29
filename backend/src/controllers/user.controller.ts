import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";


export const allUsers = asyncHandler(async (req: Request, res: Response) => {
  const keyword = req.query.search
    ? {
        $or: [
          { userName: { $regex: req.query.search as string, $options: "i" } },
          { email: { $regex: req.query.search as string, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find({ ...keyword, _id: { $ne: req.user?._id } });
  res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});
