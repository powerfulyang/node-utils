import type { Assets } from '@/image';
import { calculateHammingDistances } from '@/image';

const asyncCalculateHammingDistances = (assets: Assets) => {
  return calculateHammingDistances(assets);
};

export default asyncCalculateHammingDistances;
