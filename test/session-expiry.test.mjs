import assert from "node:assert/strict";
import test from "node:test";

import { isSessionExpired } from "../src/session-expiry.mjs";

test("a session remains active before its expiry time", () => {
  assert.equal(isSessionExpired({ expiresAt: 1_000, now: 999 }), false);
});

test("a session expires exactly at its expiry time", () => {
  assert.equal(isSessionExpired({ expiresAt: 1_000, now: 1_000 }), true);
});

test("a session expires after its expiry time", () => {
  assert.equal(isSessionExpired({ expiresAt: 1_000, now: 1_001 }), true);
});

test("invalid expiry times are rejected", () => {
  assert.throws(
    () => isSessionExpired({ expiresAt: Number.NaN, now: 1_000 }),
    /expiresAt must be a finite number/,
  );
});

test("invalid current times are rejected", () => {
  assert.throws(
    () => isSessionExpired({ expiresAt: 1_000, now: Number.POSITIVE_INFINITY }),
    /now must be a finite number/,
  );
});
