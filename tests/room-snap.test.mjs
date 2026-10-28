import assert from "node:assert/strict";
import test from "node:test";
import { roomSnapTarget } from "../lib/gallery-nav.ts";

test("settles near an entrance from either direction", () => {
  assert.equal(roomSnapTarget(2100, [1000, 2000, 4000], 1440), 2000);
  assert.equal(roomSnapTarget(1900, [1000, 2000, 4000], 1440), 2000);
});

test("leaves visitors free to explore the middle of wide rooms", () => {
  assert.equal(roomSnapTarget(2700, [1000, 2000, 4000], 1440), null);
});

test("caps proximity and includes the threshold", () => {
  assert.equal(roomSnapTarget(2160, [2000], 1440), 2000);
  assert.equal(roomSnapTarget(2161, [2000], 1440), null);
  assert.equal(roomSnapTarget(2100, [2000], 500), null);
});

test("does not restart a settled snap, including subpixel differences", () => {
  assert.equal(roomSnapTarget(2000, [2000], 1440), null);
  assert.equal(roomSnapTarget(2000.5, [2000], 1440), null);
});

test("supports a single room or empty gallery", () => {
  assert.equal(roomSnapTarget(1050, [1000], 1440), 1000);
  assert.equal(roomSnapTarget(1050, [], 1440), null);
});
