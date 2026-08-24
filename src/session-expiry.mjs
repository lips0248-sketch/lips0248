const DEFAULT_CLOCK_TOLERANCE_MS = 30_000;

export function isSessionExpired({
  expiresAt,
  now = Date.now(),
  clockToleranceMs = DEFAULT_CLOCK_TOLERANCE_MS,
}) {
  if (!Number.isFinite(expiresAt)) {
    throw new TypeError("expiresAt must be a finite number");
  }

  if (!Number.isFinite(now)) {
    throw new TypeError("now must be a finite number");
  }

  if (!Number.isFinite(clockToleranceMs)) {
    throw new TypeError("clockToleranceMs must be a finite number");
  }

  if (clockToleranceMs < 0) {
    throw new RangeError("clockToleranceMs must be non-negative");
  }

  return now - expiresAt >= clockToleranceMs;
}
