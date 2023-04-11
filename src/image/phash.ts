/* eslint-disable no-bitwise */
import sharp from 'sharp';

const SAMPLE_SIZE = 32;

function initSQRT(N: number) {
  const c = new Array(N);
  for (let i = 1; i < N; i++) {
    c[i] = 1;
  }
  c[0] = 1 / Math.sqrt(2.0);
  return c;
}

const SQRT = initSQRT(SAMPLE_SIZE);

function initCOS(N: number) {
  const cosines = new Array(N);
  for (let k = 0; k < N; k++) {
    cosines[k] = new Array(N);
    for (let n = 0; n < N; n++) {
      cosines[k][n] = Math.cos(((2 * k + 1) / (2.0 * N)) * n * Math.PI);
    }
  }
  return cosines;
}

const COS = initCOS(SAMPLE_SIZE);

function applyDCT(f: any[], size: number) {
  const N = size;

  const F = new Array(N);
  for (let u = 0; u < N; u++) {
    F[u] = new Array(N);
    for (let v = 0; v < N; v++) {
      let sum = 0;
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          sum += COS[i][u] * COS[j][v] * f[i][j];
        }
      }
      sum *= (SQRT[u] * SQRT[v]) / 4;
      F[u][v] = sum;
    }
  }
  return F;
}

const LOW_SIZE = 8;

export async function pHash(image: Buffer) {
  const data = await sharp(image)
    .greyscale()
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: 'fill' })
    .rotate()
    .raw()
    .toBuffer();
  // copy signal
  const s = new Array(SAMPLE_SIZE);
  for (let x = 0; x < SAMPLE_SIZE; x++) {
    s[x] = new Array(SAMPLE_SIZE);
    for (let y = 0; y < SAMPLE_SIZE; y++) {
      s[x][y] = data[SAMPLE_SIZE * y + x];
    }
  }

  // apply 2D DCT II
  const dct = applyDCT(s, SAMPLE_SIZE);

  // get AVG on high frequencies
  let totalSum = 0;
  for (let x = 0; x < LOW_SIZE; x++) {
    for (let y = 0; y < LOW_SIZE; y++) {
      totalSum += dct[x + 1][y + 1];
    }
  }

  const avg = totalSum / (LOW_SIZE * LOW_SIZE);

  // compute hash
  let fingerprint = '';

  for (let x = 0; x < LOW_SIZE; x++) {
    for (let y = 0; y < LOW_SIZE; y++) {
      fingerprint += dct[x + 1][y + 1] > avg ? '1' : '0';
    }
  }

  return fingerprint;
}

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
  const res = BigInt(a) ^ BigInt(b);
  return bigIntBitCount(res);
};

/**
 * Hamming distance between two binary strings
 * @param a - first string e.g. '101010'
 * @param b - second string e.g. '010101'
 */
export const binaryHammingDistance = (a: string, b: string) => {
  if (/^[01]+$/.test(a) && /^[01]+$/.test(b)) {
    const max = Math.max(a.length, b.length);
    let distance = 0;
    const aPadded = a.padStart(max, '0');
    const bPadded = b.padStart(max, '0');
    for (let i = 0; i < max; i++) {
      if (aPadded[i] !== bPadded[i]) {
        distance += 1;
      }
    }
    return distance;
  }
  throw new Error('Invalid binary string');
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
