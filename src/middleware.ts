import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

export const validateEnvVariables = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.NODE_URL || !process.env.GATEWAY_URL) {
    return res.status(500).send("Missing required environment variables.");
  }
  next();
};

export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100, 
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false
});
