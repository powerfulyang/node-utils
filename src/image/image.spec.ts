import {
  bigIntHammingDistance,
  binaryHammingDistance,
  binaryStringHammingDistance,
  wasmBinaryStringHammingDistance,
} from '@/image/hammingDistance';
import fs, { readFileSync } from 'fs';
import { calculate_hamming_distances } from '@/binary_hamming_distance/pkg';
import { pHash } from '@/image/phash';
import type { Assets } from '@/image';
import { csvPath, test_img_1, test_img_2 } from '@test/index';

describe('test images phash', () => {
  let images: string[] = [];
  let assets: Assets = [];

  beforeAll(() => {
    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split(/[\r\n]/);
    images = lines.filter((line) => line);
    assets = images.map((image, index) => {
      return { id: index, p_hash: image };
    });
  });

  it('phash and hammingDistance', async () => {
    const buf1 = readFileSync(test_img_1);
    const buf2 = readFileSync(test_img_2);
    const phash1 = await pHash(buf1);
    const phash2 = await pHash(buf2);
    const hammingDistance = binaryHammingDistance(phash1, phash2);
    const hammingDistance2 = binaryStringHammingDistance(phash1, phash2);
    expect(hammingDistance2).toBe(hammingDistance);
    const hammingDistance3 = wasmBinaryStringHammingDistance(phash1, phash2);
    expect(hammingDistance3).toBe(hammingDistance2);
  });

  it('timing', () => {
    const start = Date.now();
    for (let i = 0; i < images.length; i++) {
      for (let j = i + 1; j < images.length; j++) {
        binaryHammingDistance(images[i], images[j]);
      }
    }
    const end = Date.now();
    const start2 = Date.now();
    for (let i = 0; i < images.length; i++) {
      for (let j = i + 1; j < images.length; j++) {
        binaryStringHammingDistance(images[i], images[j]);
      }
    }
    const end2 = Date.now();
    const start3 = Date.now();
    for (let i = 0; i < images.length; i++) {
      for (let j = i + 1; j < images.length; j++) {
        wasmBinaryStringHammingDistance(images[i], images[j]);
      }
    }
    const end3 = Date.now();
    const stringTiming = end - start;
    const bigIntTiming = end2 - start2;
    const wasmTiming = end3 - start3;
    expect(stringTiming).toBeLessThan(wasmTiming);
    expect(wasmTiming).toBeLessThan(bigIntTiming);
  });

  it('用 wasm 生成 map', () => {
    expect(calculate_hamming_distances(assets)).toBeDefined();
  });

  it('用 js 生成 map', () => {
    const distanceMap = new Map();
    const _assets = assets.map((asset) => {
      return {
        ...asset,
        p_hash: BigInt(`0b${asset.p_hash}`),
      };
    });
    while (_assets.length) {
      // yield
      const next = _assets.pop();
      if (next) {
        _assets.forEach((asset) => {
          const distance = bigIntHammingDistance(asset.p_hash, next.p_hash);
          if (distance <= 10) {
            const arr = distanceMap.get(asset.id) || [];
            if (arr[distance]) {
              arr[distance].push(next.id);
            } else {
              arr[distance] = [next.id];
            }
            distanceMap.set(asset.id, arr);
            const arr2 = distanceMap.get(next.id) || [];
            if (arr2[distance]) {
              arr2[distance].push(asset.id);
            } else {
              arr2[distance] = [asset.id];
            }
            distanceMap.set(asset.id, arr);
            distanceMap.set(next.id, arr2);
          }
        });
      }
    }
    expect(distanceMap).toBeDefined();
  });
});
