/**
 * IPv4 address to long
 * @param ipAddress
 */
export const ip2long = (ipAddress: string): number => {
  const ip = ipAddress.split('.');
  return (
    parseInt(ip[0], 10) * 16777216 +
    parseInt(ip[1], 10) * 65536 +
    parseInt(ip[2], 10) * 256 +
    parseInt(ip[3], 10)
  );
};

/**
 * Long to IPv4 address
 * @param ipLong
 */
export const long2ip = (ipLong: number): string => {
  // eslint-disable-next-line no-bitwise
  return `${ipLong >>> 24}.${(ipLong >>> 16) & 255}.${(ipLong >>> 8) & 255}.${ipLong & 255}`;
};
