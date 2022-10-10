import { binaryHammingDistance, decimalHammingDistance } from '@/image/phash';

describe('images', () => {
  const a = '1234';
  const b = '4321';

  it('decimal hamming distance', () => {
    const hammingDistance = decimalHammingDistance(a, b);
    expect(hammingDistance).toBe(6);
  });

  it('binary hamming distance', () => {
    const hammingDistance = binaryHammingDistance(Number(a).toString(2), Number(b).toString(2));
    expect(hammingDistance).toBe(6);
  });
});
