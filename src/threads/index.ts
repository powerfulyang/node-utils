import Piscina from 'piscina';
import './worker';
import type { Assets } from '@/image';
import { join } from 'node:path';

export const threadPool = new Piscina();

const _default = join(__dirname, 'worker.cjs');
export const asyncCalculateHammingDistances = (
  assets: Assets,
  options?: Parameters<typeof threadPool.run>[1],
) => {
  return threadPool.run(assets, {
    filename: _default,
    ...options,
  });
};
