import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { ActivityLog } from "../models/ActivityLog.js";

// GET /api/activity
export const getActivity = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const activity = await ActivityLog.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(activity);
  } catch (error: any) {
    console.error("Activity Error:", error);

    res.status(500).json({
      message: error?.message || "Server Error",
    });
  }
};