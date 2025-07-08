import { Request, Response, NextFunction, RequestHandler } from "express";
import admin from "firebase-admin";
import * as userRepo from "../db/repositories/userRepository.js";
import logger from "../utils/logger.js";

export const authenticateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // look up the user in our database once here
    const user = await userRepo.findByFirebaseUid(decodedToken.uid);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // attach both firebase token and our db user
    req.firebaseUserToken = decodedToken;
    req.dbUser = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};
