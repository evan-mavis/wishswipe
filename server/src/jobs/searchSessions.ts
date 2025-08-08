import { SearchSessionService } from "../services/searchSessionService.js";

export async function resetOldSessions() {
  await SearchSessionService.resetOldSessions();
}
