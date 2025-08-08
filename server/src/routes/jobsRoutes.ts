import { Router } from "express";
import { runExpiredItemsCheck } from "../jobs/expiredItems.js";
import { resetOldSessions } from "../jobs/searchSessions.js";

const router = Router();

function verifyJobToken(req: any, res: any, next: any) {
  const token = req.header("X-Job-Token");
  if (token && token === process.env.JOB_TOKEN) return next();
  return res.status(401).json({ error: "unauthorized" });
}

router.post("/expired-items", verifyJobToken, async (_req, res) => {
  const summary = await runExpiredItemsCheck();
  res.json({ ok: true, summary });
});

router.post("/reset-sessions", verifyJobToken, async (_req, res) => {
  await resetOldSessions();
  res.json({ ok: true });
});

export default router;
