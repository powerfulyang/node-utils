import { Agent } from 'http';
import { CreateConnectionOptions, Socks5Client } from './client';

export interface OptionInterface {
  type: 'http' | 'https';
  proxyHost?: string;
  proxyPort?: number;
}

export interface AgentOptions extends Omit<OptionInterface, 'type'> {}

export class HttpAgent extends Agent {
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
    return this.socket.proxyConnect(options);
  }
}
