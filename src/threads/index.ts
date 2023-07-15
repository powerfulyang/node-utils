import Piscina from 'piscina';
import './worker';
import type { Assets } from '@/image';
import { join } from 'node:path';

const _default = join(__dirname, 'worker.cjs');

export class Thread extends Piscina {
  asyncCalculateHammingDistances(
    assets: Assets,
    options?: Parameters<typeof Piscina.prototype.run>[1],
  ) {
    return this.run(assets, {
      filename: _default,
      ...options,
    });
  }
}
