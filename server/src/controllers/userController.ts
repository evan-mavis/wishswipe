import { Request, Response } from "express";

export const getUsers = (req: Request, res: Response) => {
  res.json({ message: "Get all users" });
};

export const getUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({ message: `Get user ${id}` });
};
