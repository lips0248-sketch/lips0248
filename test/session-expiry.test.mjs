import assert from "node:assert/strict";
import test from "node:test";

import { isSessionExpired } from "../src/session-expiry.mjs";

test("a session remains active before its expiry time", () => {
  assert.equal(isSessionExpired({ expiresAt: 1_000, now: 999 }), false);
});

test("the default clock tolerance prevents expiry up to 30 seconds early", () => {
  assert.equal(isSessionExpired({ expiresAt: 1_000, now: 1_000 }), false);
  assert.equal(isSessionExpired({ expiresAt: 1_000, now: 30_999 }), false);
});

test("a session expires when the default clock tolerance is exhausted", () => {
  assert.equal(isSessionExpired({ expiresAt: 1_000, now: 31_000 }), true);
});

test("a custom clock tolerance is honored", () => {
  assert.equal(
    isSessionExpired({ expiresAt: 1_000, now: 1_499, clockToleranceMs: 500 }),
    false,
  );
  assert.equal(
    isSessionExpired({ expiresAt: 1_000, now: 1_500, clockToleranceMs: 500 }),
    true,
  );
});

test("a zero clock tolerance preserves exact-expiry behavior", () => {
  assert.equal(
    isSessionExpired({ expiresAt: 1_000, now: 1_000, clockToleranceMs: 0 }),
    true,
  );
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

test("negative clock tolerances are rejected", () => {
  assert.throws(
    () =>
      isSessionExpired({
        expiresAt: 1_000,
        now: 1_000,
        clockToleranceMs: -1,
      }),
    /clockToleranceMs must be non-negative/,
  );
});

test("non-finite clock tolerances are rejected", () => {
  for (const clockToleranceMs of [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ]) {
    assert.throws(
      () =>
        isSessionExpired({
          expiresAt: 1_000,
          now: 1_000,
          clockToleranceMs,
        }),
      /clockToleranceMs must be a finite number/,
    );
  }
});

test("non-number clock tolerances are rejected", () => {
  assert.throws(
    () =>
      isSessionExpired({
        expiresAt: 1_000,
        now: 1_000,
        clockToleranceMs: "30000",
      }),
    /clockToleranceMs must be a finite number/,
  );
});
