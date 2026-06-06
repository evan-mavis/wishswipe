export async function refreshWishlistMaintenance(): Promise<void> {
  try {
    await fetch("/api/maintenance/refresh", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // maintenance is best effort and should not block the UI
  }
}

export async function refreshWishlistMaintenanceDebounced(minutes = 10) {
  try {
    const key = "ws:lastWishlistMaintenanceAt";
    const now = Date.now();
    const last = localStorage.getItem(key);

    if (last && (now - Number.parseInt(last, 10)) / (1000 * 60) < minutes) {
      return;
    }

    await refreshWishlistMaintenance();
    localStorage.setItem(key, String(now));
  } catch {
    // ignore
  }
}

export async function resetSearchSessions(): Promise<boolean> {
  try {
    const response = await fetch("/api/maintenance/reset-sessions", {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function resetSearchSessionsDebounced(minutes = 60) {
  try {
    const key = "ws:lastSearchSessionResetAt";
    const now = Date.now();
    const last = localStorage.getItem(key);

    if (last && (now - Number.parseInt(last, 10)) / (1000 * 60) < minutes) {
      return;
    }

    const ok = await resetSearchSessions();
    if (ok) localStorage.setItem(key, String(now));
  } catch {
    // ignore
  }
}
