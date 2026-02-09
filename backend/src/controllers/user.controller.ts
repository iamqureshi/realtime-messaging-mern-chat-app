import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";


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

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, bio } = req.body;
  const userId = req.user?._id;

  const updateData: any = { firstName, lastName, bio };
  
  if (req.file) {
      let filePath = req.file.path.replace(/\\/g, "/");
      filePath = filePath.replace("public/", ""); 
      // Ensure leading slash
      if (!filePath.startsWith("/")) filePath = "/" + filePath;
      
      updateData.avatar = filePath;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
  
  if(!updatedUser) {
      throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
