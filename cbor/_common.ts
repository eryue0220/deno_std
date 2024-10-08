// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

export type ReleaseLock = (value?: unknown) => void;

export function numberToArray(bytes: number, x: number | bigint): Uint8Array {
  const view = new DataView(new ArrayBuffer(8));
  if (typeof x === "bigint" || x % 1 === 0) view.setBigUint64(0, BigInt(x));
  else view.setFloat64(0, x);
  return new Uint8Array(view.buffer.slice(-bytes));
}

export function arrayToNumber(
  buffer: ArrayBufferLike & { BYTES_PER_ELEMENT?: never },
  isInteger: true,
): number | bigint;
export function arrayToNumber(
  buffer: ArrayBufferLike & { BYTES_PER_ELEMENT?: never },
  isInteger: false,
): number;
export function arrayToNumber(
  buffer: ArrayBufferLike & { BYTES_PER_ELEMENT?: never },
  isInteger: boolean,
): number | bigint {
  const view = new DataView(buffer);
  if (isInteger) {
    switch (buffer.byteLength) {
      case 1:
        return view.getUint8(0);
      case 2:
        return view.getUint16(0);
      case 4:
        return view.getUint32(0);
      default:
        return view.getBigUint64(0);
    }
  }
  switch (buffer.byteLength) {
    case 2:
      return view.getFloat16(0);
    case 4:
      return view.getFloat32(0);
    default:
      return view.getFloat64(0);
  }
}

// To be removed if https://github.com/denoland/std/pull/6046 merges.
export function toByteStream(
  readable: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  try {
    const reader = readable.getReader({ mode: "byob" });
    reader.releaseLock();
    return readable;
  } catch {
    const reader = readable.getReader();
    return new ReadableStream({
      type: "bytes",
      async pull(controller) {
        const value = await async function () {
          while (true) {
            const { done, value } = await reader.read();
            if (done) return undefined;
            if (value.length) return value;
          }
        }();

        if (value == undefined) {
          controller.close();
          return controller.byobRequest?.respond(0);
        }

        if (controller.byobRequest?.view) {
          const buffer = new Uint8Array(controller.byobRequest.view.buffer);
          const offset = controller.byobRequest.view.byteOffset;
          const size = buffer.length - offset;
          if (value.length > size) {
            buffer.set(value.slice(0, size), offset);
            controller.byobRequest.respond(size);
            controller.enqueue(value.slice(size));
          } else {
            buffer.set(value, offset);
            controller.byobRequest.respond(value.length);
          }
        } else controller.enqueue(value);
      },
      async cancel(reason) {
        await reader.cancel(reason);
      },
    });
  }
}
