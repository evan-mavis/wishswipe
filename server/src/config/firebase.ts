import admin from "firebase-admin";

export function getServiceAccount(): admin.ServiceAccount {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
  // convert escaped newlines to real newlines for hosts that require single-line envs
  privateKey = privateKey.replace(/\\n/g, "\n");
  // strip accidental wrapping quotes if present
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  } as admin.ServiceAccount;
}

export default admin;
