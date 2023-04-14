import { calculate_hamming_distances } from '@/binary_hamming_distance/pkg';

export * from './phash';
/**
 * 由于 BigInt 性能太差，其余的方法不导出
 */
export { wasmBinaryStringHammingDistance, decimalHammingDistance } from './hammingDistance';

export type Assets = Array<{
  id: number;
  p_hash: string;
}>;

export function calculateHammingDistances(assets: Assets) {
  return calculate_hamming_distances(assets);
}
