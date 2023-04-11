import {
  binaryHammingDistance,
  binaryStringHammingDistance,
  decimalHammingDistance,
} from '@/image/phash';
import * as fs from 'fs';
import * as path from 'path';

describe('images', () => {
  it('decimal hamming distance', () => {
    const a = '1234';
    const b = '4321';
    const hammingDistance = decimalHammingDistance(a, b);
    expect(hammingDistance).toBe(6);
    const _a = Number(a).toString(2);
    const _b = Number(b).toString(2);
    const _hammingDistance = binaryStringHammingDistance(_a, _b);
    expect(hammingDistance).toBe(_hammingDistance);
    const _hammingDistance2 = binaryHammingDistance(_a, _b);
    expect(_hammingDistance2).toBe(hammingDistance);
  });

  it('timing', () => {
    const data = fs.readFileSync(path.join(__dirname, 'test_public_asset.csv'), 'utf8');
    const lines = data.split(/[\r\n]/);
    const images = lines.filter((line) => line);
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
    const diff = end - start;
    const diff2 = end2 - start2;
    expect(diff).toBeLessThan(diff2);
  });
});
