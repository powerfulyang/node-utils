import { Agent } from 'https';
import { connect } from 'tls';
import { CreateConnectionOptions, Socks5Client } from './client';
import { AgentOptions } from './HttpAgent';

export class HttpsAgent extends Agent {
  private readonly socket;

  constructor(options: AgentOptions = {}) {
    super();
    const { proxyHost, proxyPort } = options;
    this.socket = new Socks5Client({
      host: proxyHost,
      port: proxyPort,
    });
  }

  createConnection(options: CreateConnectionOptions) {
    return this.socket.proxyConnect(options, (call) => {
      this.socket.socket = connect(
        {
          servername: options.host,
          socket: this.socket.socket,
        },
        () => {
          // @ts-ignore
          this.socket.authorized = this.socket.socket.authorized;
          call.call(this.socket);
        },
      );
    });
  }
}
