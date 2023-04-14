/* eslint-disable no-bitwise */
import { binary_hamming_distance } from '@/binary_hamming_distance/pkg';

export const bitCount = (n: number) => {
  let result = 0;
  let tmp = n;

  while (tmp) {
    result += 1;
    tmp &= tmp - 1;
  }

  return result;
};

export const bigIntBitCount = (n: bigint) => {
  let result = 0;
  let tmp = n;

  while (tmp) {
    result += 1;
    tmp &= tmp - 1n;
  }

  return result;
};

/**
 * Hamming distance between two strings or numbers
 * @param a - first string or number e.g. '123456'
 * @param b - second string or number e.g. '654321'
 */
export const decimalHammingDistance = (a: string | number, b: string | number) => {
  const res = Number(a) ^ Number(b);
  return bitCount(res);
};

export const bigIntHammingDistance = (a: bigint, b: bigint) => {
  const res = a ^ b;
  return bigIntBitCount(res);
};

/**
 * Hamming distance between two binary strings
 * @param a - first string e.g. '101010'
 * @param b - second string e.g. '010101'
 */
export const binaryHammingDistance = (a: string, b: string) => {
  if (a.length !== b.length) {
    throw new Error('Hamming distance between two binary strings requires equal length strings');
  }
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      distance += 1;
    }
  }
  return distance;
};

/**
 * Hamming distance between two binary strings
 * @param a - first string e.g. '101010'
 * @param b - second string e.g. '010101'
 */
export const binaryStringHammingDistance = (a: string, b: string) => {
  const _a = BigInt(`0b${a}`);
  const _b = BigInt(`0b${b}`);
  const res = _a ^ _b;
  return bigIntBitCount(res);
};

export const wasmBinaryStringHammingDistance = (a: string, b: string) => {
  return binary_hamming_distance(a, b);
};
