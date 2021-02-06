import { AgentFactory } from './Agent';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';

describe('test agent', function () {
  it('http agent', function (done) {
    const agent = AgentFactory.create({ type: 'http' });
    httpRequest(
      {
        agent,
        host: 'google.com',
      },
      (res) => {
        res.on('data', (data) => {
          const dataStr = data.toString();
          expect(dataStr).toBeDefined();
          done();
        });
      },
    ).end();
  });

  it('https agent', function (done) {
    const agent = AgentFactory.create({ type: 'https' });
    httpsRequest(
      {
        agent,
        host: 'google.com',
        port: 443,
      },
      (res) => {
        res.on('data', (data) => {
          const dataStr = data.toString();
          expect(dataStr).toBeDefined();
          done();
        });
      },
    ).end();
  });
});
