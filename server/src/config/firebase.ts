import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

export const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
} as admin.ServiceAccount;

export default admin;
