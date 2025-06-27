import admin from "firebase-admin";

export function getServiceAccount(): admin.ServiceAccount {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  } as admin.ServiceAccount;
}

export default admin;
