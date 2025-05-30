// Copyright 2018-2025 the Deno authors. MIT license.

import { expect } from "./expect.ts";
import { addSerializer, getSerializer } from "./_serializer.ts";
import type { SnapshotPlugin } from "./_types.ts";

const foo: SnapshotPlugin = {
  serialize() {
    return "foot";
  },
  test() {
    return false;
  },
};

Deno.test("initial serializer", () => {
  expect(getSerializer()).toHaveLength(0);
});

Deno.test("add serializer", () => {
  addSerializer(foo);
  expect(getSerializer()).toHaveLength(1);
});
