import { Socks5Client } from './client';
import { toBuffer } from 'ip';

describe('test socks5 client', function () {
  it('authenticate', function (done) {
    const client = new Socks5Client();
    client.proxyConnect({
      host: 'powerfulyang.com',
      port: 443,
    });
    client.on('connect', () => {
      client.write('GET / HTTP/1.1\r\n' + 'Host: powerfulyang.com\r\n\r\n');
    });
    client.on('data', (data) => {
      const serverResponse = data.toString();
      done(serverResponse);
    });
  });

  it('ipv6 to buffer', function () {
    const buffer = toBuffer('::1');
    expect(buffer.join()).toStrictEqual('0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1');
  });

  it('ipv4 to buffer', function () {
    const buffer = toBuffer('127.0.0.1');
    expect(buffer.join()).toStrictEqual('127,0,0,1');
  });
});
