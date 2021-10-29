import crypto from 'crypto';

/**
 * Hash a string. get sha1
 * @param originVal
 * @param salt
 */
export const sha1 = (originVal: string | Buffer, salt?: string) => {
  if (salt) {
    return crypto.createHmac('sha1', salt).update(originVal).digest('hex');
  }
  return crypto.createHash('sha1').update(originVal).digest('hex');
};

/**
 * Hash a string. get sha512
 * @param originVal
 * @param salt
 */
export const sha512 = (originVal: string | Buffer, salt?: string) => {
  if (salt) {
    return crypto.createHmac('sha512', salt).update(originVal).digest('hex');
  }
  return crypto.createHash('sha512').update(originVal).digest('hex');
};

/**
 * generate random string
 */
export const generateRandomString = (length: number = 10) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
