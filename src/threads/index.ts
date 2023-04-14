import Piscina from 'piscina';
import './worker';
import type { Assets } from '@/image';
import { join } from 'node:path';

const piscina = new Piscina();

const _default = join(__dirname, 'worker.cjs');
export const asyncCalculateHammingDistances = (
  assets: Assets,
  options?: Parameters<typeof piscina.run>[1],
) => {
  return piscina.run(assets, {
    filename: _default,
    ...options,
  });
};
