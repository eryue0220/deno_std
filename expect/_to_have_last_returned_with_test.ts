// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { expect } from "./expect.ts";
import { fn } from "./fn.ts";
import { AssertionError, assertThrows } from "@std/assert";

Deno.test("expect().toHaveLastReturnedWith()", () => {
  const mockFn = fn((x: number) => x + 3);

  mockFn(1);
  mockFn(4);

  expect(mockFn).toHaveLastReturnedWith(7);

  expect(mockFn).not.toHaveLastReturnedWith(4);

  assertThrows(() => {
    expect(mockFn).toHaveLastReturnedWith(4);
  }, AssertionError);

  assertThrows(() => {
    expect(mockFn).not.toHaveLastReturnedWith(7);
  }, AssertionError);
});

Deno.test("expect().toHaveLastReturnedWith() with custom error message", () => {
  const msg = "toHaveLastReturnedWith custom error message";
  const mockFn = fn((x: number) => x + 3);

  mockFn(1);
  mockFn(4);

  assertThrows(
    () => {
      expect(mockFn, msg).toHaveLastReturnedWith(4);
    },
    AssertionError,
    msg,
  );

  assertThrows(
    () => {
      expect(mockFn, msg).not.toHaveLastReturnedWith(7);
    },
    AssertionError,
    msg,
  );
});
