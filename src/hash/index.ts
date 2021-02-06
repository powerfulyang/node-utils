import crypto from 'crypto';

export const getRandomString = (length: number = 8) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

export const sha1 = (originVal: string | Buffer, salt?: string) => {
  if (salt) {
    return crypto.createHmac('sha1', salt).update(originVal).digest('hex');
  }
  return crypto.createHash('sha1').update(originVal).digest('hex');
};

export const sha512 = (originVal: string | Buffer, salt?: string) => {
  if (salt) {
    return crypto.createHmac('sha512', salt).update(originVal).digest('hex');
  }
  return crypto.createHash('sha512').update(originVal).digest('hex');
};
