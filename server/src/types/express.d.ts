import { DecodedIdToken } from "firebase-admin/auth";
import { DbUser } from "./user.js";

declare global {
  namespace Express {
    interface Request {
      firebaseUserToken: DecodedIdToken;
      dbUser: DbUser;
    }
  }
}

export {};
