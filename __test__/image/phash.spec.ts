import { readFileSync } from 'fs';
import { join } from 'path';
import { hammingDistance, pHash } from '../../dist/main';

describe('test images phash', () => {
  it('get phash', async () => {
    const buf1 = readFileSync(join(__dirname, '2e7d394191b41f8bdedf0a0901dcde883d1b9420.jpg'));
    const buf2 = readFileSync(join(__dirname, 'd047ad7bd219d954c2f1290e3e57d62b34a2dbeb.jpg'));
    const phash1 = await pHash(buf1);
    const phash2 = await pHash(buf2);
    expect(hammingDistance(phash1, phash2)).toBe(10);
  });
});
