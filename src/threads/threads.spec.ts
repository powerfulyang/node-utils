import type { Assets } from '@/image';
import { calculateHammingDistances } from '@/image';
import { Thread } from '@/threads/index';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { csvPath } from '@test/index';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

describe('test threads', () => {
  let assets: Assets = [];
  let thread: Thread;

  beforeAll(() => {
    thread = new Thread();
    const data = readFileSync(csvPath, 'utf8');
    const lines = data.split(/[\r\n]/);
    const images = lines.filter((line) => line);
    assets = images.map((image, index) => {
      return { id: index, p_hash: image };
    });
  });

  afterAll(() => {
    thread.destroy();
  });

  it('run threads', async () => {
    const taskCount = 100;
    const workerPath = join(process.cwd(), 'dist/threads/worker.cjs');
    await Promise.all(
      Array.from({
        length: taskCount,
      }).map(() => {
        return thread.asyncCalculateHammingDistances(assets, {
          filename: workerPath,
        });
      }),
    );

    await Promise.all(
      Array.from({
        length: taskCount,
      }).map(() => {
        return calculateHammingDistances(assets);
      }),
    );

    expect(1).toBe(1);
  });
});
