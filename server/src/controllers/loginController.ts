import type { Request, Response } from "express";
import { z } from "zod";
import * as userRepo from "../db/repositories/userRepository.js";

// zod schema for login/create user
const loginUserSchema = z.object({
  firebase_uid: z.string().min(1),
  email: z.string().email(),
  display_name: z.string().optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
});

// endpoint to handle google login
export const loginOrCreateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parseResult = loginUserSchema.safeParse(req.body);

  if (!parseResult.success) {
    res
      .status(400)
      .json({ error: "invalid request", details: parseResult.error.flatten() });
    return;
  }

  const { firebase_uid, email, display_name, photo_url } = parseResult.data;

  try {
    const user = await userRepo.findByFirebaseUid(firebase_uid);

    if (user) {
      const updatedUser = await userRepo.updateLastLogin(user.id);
      res.json({ user: updatedUser, created: false });
      return;
    }

    const newUser = await userRepo.createUser({
      firebaseUid: firebase_uid,
      email,
      displayName: display_name ?? undefined,
      photoUrl: photo_url ?? undefined,
    });

    res.status(201).json({ user: newUser, created: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};
