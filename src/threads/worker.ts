import type { Assets } from '@/image';
import { calculateHammingDistances } from '@/image';

const _asyncCalculateHammingDistances = (assets: Assets) => {
  return calculateHammingDistances(assets);
};

export default _asyncCalculateHammingDistances;
