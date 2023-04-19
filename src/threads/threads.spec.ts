import { asyncCalculateHammingDistances, threadPool } from '@/threads/index';
import type { Assets } from '@/image';
import { calculateHammingDistances } from '@/image';
import { join } from 'node:path';
import process from 'node:process';
import { csvPath } from '@test/index';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

describe('test threads', () => {
  let assets: Assets = [];

  beforeAll(() => {
    const data = readFileSync(csvPath, 'utf8');
    const lines = data.split(/[\r\n]/);
    const images = lines.filter((line) => line);
    assets = images.map((image, index) => {
      return { id: index, p_hash: image };
    });
  });

  afterAll(() => {
    threadPool.destroy();
  });

  it('run threads', async () => {
    const start = Date.now();
    const workerPath = join(process.cwd(), 'dist/threads/worker.cjs');
    await Promise.all(
      Array.from({
        length: 100,
      }).map(() => {
        return asyncCalculateHammingDistances(assets, {
          filename: workerPath,
        });
      }),
    );
    const end = Date.now();
    const time = end - start;

    const start2 = Date.now();
    await Promise.all(
      Array.from({
        length: 100,
      }).map(() => {
        return calculateHammingDistances(assets);
      }),
    );
    const end2 = Date.now();
    const time2 = end2 - start2;

    expect(time).toBeLessThan(time2);
  });
});
