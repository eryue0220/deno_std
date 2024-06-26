// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

import { Schema } from "../_schema.ts";
import { JSON_SCHEMA } from "./json.ts";

/**
 * Standard YAML's core schema.
 *
 * @see {@link http://www.yaml.org/spec/1.2/spec.html#id2804923}
 */
export const CORE_SCHEMA: Schema = new Schema({
  include: [JSON_SCHEMA],
});
