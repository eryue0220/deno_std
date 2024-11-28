// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { expect } from "./expect.ts";
import { AssertionError, assertThrows } from "@std/assert";

Deno.test("expect().toHaveProperty()", () => {
  expect({ a: 1 }).toHaveProperty("a");
  expect({ a: 1 }).toHaveProperty("a", 1);
  expect({ a: { b: 1 } }).toHaveProperty("a.b", 1);
  expect({ a: { b: 1 } }).toHaveProperty(["a", "b"], 1);
  expect({ a: { b: { c: { d: 5 } } } }).toHaveProperty("a.b.c", { d: 5 });
  expect({ a: { b: { c: { d: 5 } } } }).toHaveProperty("a.b.c.d", 5);

  expect({ a: { b: { c: { d: 5 } } } }).not.toHaveProperty("a.b.c", { d: 6 });

  assertThrows(() => {
    expect({ a: { b: { c: { d: 5 } } } }).toHaveProperty("a.b.c", { d: 6 });
  }, AssertionError);

  assertThrows(() => {
    expect({ a: { b: { c: { d: 5 } } } }).not.toHaveProperty("a.b.c", { d: 5 });
  }, AssertionError);
});

Deno.test("expect().toHaveProperty() handles null and undefined", () => {
  expect(null).not.toHaveProperty("foo");
  expect(undefined).not.toHaveProperty("foo");
});

Deno.test("expect().toHaveProperty() with custom error message", () => {
  const msg = "toHaveProperty Custom Error";

  assertThrows(
    () => {
      expect({ a: { b: { c: { d: 5 } } } }, msg).toHaveProperty("a.b.c", {
        d: 6,
      });
    },
    AssertionError,
    msg,
  );

  assertThrows(
    () => {
      expect({ a: { b: { c: { d: 5 } } } }, msg).not.toHaveProperty("a.b.c", {
        d: 5,
      });
    },
    AssertionError,
    msg,
  );
});
