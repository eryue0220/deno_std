// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { expect } from "./expect.ts";
import { AssertionError, assertThrows } from "@std/assert";

Deno.test("expect().toMatchObject()", () => {
  const house0 = {
    bath: true,
    bedrooms: 4,
    kitchen: {
      amenities: ["oven", "stove", "washer"],
      area: 20,
      wallColor: "white",
    },
  };
  const house1 = {
    bath: true,
    bedrooms: 4,
    kitchen: {
      amenities: ["oven", "stove"],
      area: 20,
      wallColor: "white",
    },
  };
  const desiredHouse = {
    bath: true,
    kitchen: {
      amenities: ["oven", "stove", "washer"],
      wallColor: "white",
    },
  };

  expect(house0).toMatchObject(desiredHouse);
  expect([house0]).toMatchObject([desiredHouse]);

  expect(house1).not.toMatchObject(desiredHouse);
  expect([house1]).not.toMatchObject([desiredHouse]);

  assertThrows(() => {
    expect(house1).toMatchObject(desiredHouse);
  }, AssertionError);
  assertThrows(() => {
    expect([house1]).toMatchObject([desiredHouse]);
  }, AssertionError);

  assertThrows(() => {
    expect(house0).not.toMatchObject(desiredHouse);
  }, AssertionError);
  assertThrows(() => {
    expect([house0]).not.toMatchObject([desiredHouse]);
  }, AssertionError);
});

Deno.test("expect().toMatchObject() with array", () => {
  const fixedPriorityQueue = Array.from({ length: 5 });
  fixedPriorityQueue[0] = { data: 1, priority: 0 };

  expect(fixedPriorityQueue).toMatchObject([
    { data: 1, priority: 0 },
  ]);
});

Deno.test("expect(),toMatchObject() with asyAsymmetric matcher", () => {
  expect({ position: { x: 0, y: 0 } }).toMatchObject({
    position: {
      x: expect.any(Number),
      y: expect.any(Number),
    },
  });
});

Deno.test("expect().toMatchObject() with custom error message", () => {
  const house0 = {
    bath: true,
    bedrooms: 4,
    kitchen: {
      amenities: ["oven", "stove", "washer"],
      area: 20,
      wallColor: "white",
    },
  };
  const house1 = {
    bath: true,
    bedrooms: 4,
    kitchen: {
      amenities: ["oven", "stove"],
      area: 20,
      wallColor: "white",
    },
  };
  const desiredHouse = {
    bath: true,
    kitchen: {
      amenities: ["oven", "stove", "washer"],
      wallColor: "white",
    },
  };
  const msg = "toMatchObject Custom Error";

  assertThrows(
    () => {
      expect([house1], msg).toMatchObject([desiredHouse]);
    },
    AssertionError,
    msg,
  );

  assertThrows(
    () => {
      expect(house0, msg).not.toMatchObject(desiredHouse);
    },
    AssertionError,
    msg,
  );

  assertThrows(
    () => {
      expect(null, msg).toMatchObject([desiredHouse]);
    },
    AssertionError,
    msg,
  );
});
