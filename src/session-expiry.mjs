export function isSessionExpired({ expiresAt, now = Date.now() }) {
  if (!Number.isFinite(expiresAt)) {
    throw new TypeError("expiresAt must be a finite number");
  }

  if (!Number.isFinite(now)) {
    throw new TypeError("now must be a finite number");
  }

  return now >= expiresAt;
}
