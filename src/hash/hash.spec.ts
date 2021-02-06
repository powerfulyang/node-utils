import { sha1 } from './index';

describe('hash test', function () {
  it('sha1', function () {
    expect(sha1('1b61ef04', '1b61ef04')).toBe('08c80ceab745e5c6f0c394bb35b1506634b89e36');
  });
});
