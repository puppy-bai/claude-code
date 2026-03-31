declare module 'bun:ffi' {
  export function dlopen(path: string, symbols: Record<string, any>): any
  export function ptr(buffer: ArrayBuffer | TypedArray): number
  export function toBuffer(ptr: number, offset?: number, length?: number): Buffer
  export function toArrayBuffer(ptr: number, offset?: number, length?: number): ArrayBuffer
  export function CString(ptr: number, offset?: number, length?: number): string
  export const FFIType: Record<string, number>
  export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array
}
