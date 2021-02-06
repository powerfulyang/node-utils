import { isIP, isIPv6, Socket } from 'net';
import { VoidFunction } from '@powerfulyang/utils';
import { toBuffer } from 'ip';
import { EventEmitter } from 'events';

export interface Socks5ClientOptions {
  host?: string;
  hostname?: string;
  port?: number;
  username?: string;
  password?: string;
}

export interface CreateConnectionOptions {
  host: string;
  port: number;
}

export class Socks5Client extends EventEmitter {
  private readonly hostname: string;

  private readonly port: number;

  private readonly username?: string;

  private readonly password?: string;

  private targetHost: string;

  private targetPort: number;

  socket = new Socket();

  write: any;

  read: any;

  cork: any;

  uncork: any;

  resume: any;

  writable: boolean;

  readable: boolean;

  destroy: any;

  pause: any;

  authorized: any;

  constructor(options: Socks5ClientOptions = {}) {
    super();
    const { host, hostname, port, username, password } = options;
    this.hostname = hostname || host?.split(':')[0] || 'localhost';
    this.port = Number(port || host?.split(':')[1] || 1080);
    this.username = username;
    this.password = password;
  }

  end(data: string | Uint8Array, encoding: (() => void) | undefined) {
    const ret = this.socket.end(data, encoding);
    this.writable = this.socket.writable;
    return ret;
  }

  destroySoon() {
    // @ts-ignore
    const ret = this.socket.destroySoon();
    this.writable = this.socket.writable;
    return ret;
  }

  proxyConnect(options: CreateConnectionOptions, onProxy?: VoidFunction) {
    this.targetHost = options.host;
    this.targetPort = options.port;
    this.write = this.socket.write.bind(this.socket);
    this.on('error', () => {
      if (!this.socket.destroyed) {
        this.socket.destroy();
      }
    });
    this.socket.on('error', (error) => {
      this.emit('error', error);
    });
    this.on('end', this.end);

    this.socket.connect(
      {
        host: this.hostname,
        port: this.port,
      },
      () => {
        this.authenticate(() => {
          this.connectToHost(() => {
            if (onProxy) {
              onProxy(this.onProxy);
            } else {
              this.onProxy();
            }
          });
        });
      },
    );
    return this;
  }

  onProxy() {
    this.cork = this.socket.cork.bind(this.socket);
    this.uncork = this.socket.uncork.bind(this.socket);
    this.resume = this.socket.resume.bind(this.socket);
    this.destroy = this.socket.destroy.bind(this.socket);
    this.pause = this.socket.pause.bind(this.socket);
    this.write = this.socket.write.bind(this.socket);
    this.read = this.socket.read.bind(this.socket);
    this.socket.on('data', (data) => {
      this.emit('data', data);
    });

    this.socket.on('close', (had_error) => {
      this.emit('close', had_error);
    });

    this.socket.on('end', () => {
      this.emit('end');
    });
    // @ts-ignore
    this.socket._httpMessage = this._httpMessage;
    // @ts-ignore
    this.socket.parser = this.parser;
    this.writable = true;
    this.readable = true;
    this.emit('connect');
  }

  private authenticate(cb: VoidFunction) {
    const authMethods = [0x00];

    this.socket.once('data', (data) => {
      let error: string = '';
      if (data.length !== 2) {
        error = 'Unexpected number of bytes received.';
      } else if (data[0] !== 0x05) {
        error = `Unexpected SOCKS version number: ${data[0]}.`;
      } else if (data[1] === 0xff) {
        error = 'No acceptable authentication methods were offered.';
      } else if (!authMethods.includes(data[1])) {
        error = `Unexpected SOCKS authentication method: ${data[1]}.`;
      }
      if (error) {
        this.emit('error', new Error(`SOCKS authentication failed. ${error}`));
      }
      let request;
      if (data[1] === 0x02) {
        // 需要验证账号密码
        this.socket.once('data', (data2) => {
          let error2 = '';

          if (data2.length !== 2) {
            error2 = 'Unexpected number of bytes received.';
          } else if (data2[0] !== 0x01) {
            error2 = `Unexpected authentication method code: ${data2[0]}.`;
          } else if (data2[1] !== 0x00) {
            error2 = `Username and password authentication failure: ${data2[1]}.`;
          }

          if (error2) {
            this.emit('error', new Error(`SOCKS authentication failed. ${error2}`));
          }
        });

        request = [0x01];
        request = [
          ...request,
          this.username!.length,
          ...Buffer.from(this.username!),
          this.password!.length,
          ...Buffer.from(this.password!),
        ];
        this.write(Buffer.from(request));
        cb();
      } else {
        cb();
      }
    });
    if (this.username) {
      authMethods.push(0x02);
    }

    const buffer = Buffer.alloc(2 + authMethods.length);
    buffer[0] = 0x05; // SOCKS version.
    buffer[1] = authMethods.length; // Number of authentication methods.

    authMethods.forEach((authMethod, i) => {
      buffer[2 + i] = authMethod;
    });

    this.write(buffer);
  }

  private static getErrorMessage(code: number) {
    switch (code) {
      case 1:
        return 'General SOCKS server failure';
      case 2:
        return 'Connection not allowed by ruleset';
      case 3:
        return 'Network unreachable';
      case 4:
        return 'Host unreachable';
      case 5:
        return 'Connection refused';
      case 6:
        return 'TTL expired';
      case 7:
        return 'Command not supported';
      case 8:
        return 'Address type not supported';
      default:
        return `Unknown status code ${code}`;
    }
  }

  private addIPv4Section(request: any[]) {
    request.push(toBuffer(this.targetHost));
  }

  private addIPv6Section(request: any[]) {
    const bool = isIPv6(this.targetHost);
    if (!bool) {
      this.emit('error', new Error('IPv6 host parsing failed. Invalid address.'));
    }
    const buffer = toBuffer(this.targetHost);
    return request.push(...buffer);
  }

  private connectToHost(cb: VoidFunction) {
    let request = [];

    this.socket.once('data', (data) => {
      let error;

      if (data[0] !== 0x05) {
        error = `Unexpected SOCKS version number: ${data[0]}.`;
      } else if (data[1] !== 0x00) {
        error = `${Socks5Client.getErrorMessage(data[1])}.`;
      } else if (data[2] !== 0x00) {
        error = 'The reserved byte must be 0x00.';
      }

      if (error) {
        this.emit('error', new Error(`SOCKS connection failed. ${error}`));
        return;
      }

      cb();
    });

    request.push(0x05); // SOCKS version.
    request.push(0x01); // Command code: establish a TCP/IP stream connection.
    request.push(0x00); // Reserved - must be 0x00.

    switch (isIP(this.targetHost)) {
      // Add a hostname to the request.
      case 0:
        request.push(0x03);
        request = request.concat(this.targetHost.length, ...Buffer.from(this.targetHost));
        break;
      // Add an IPv4 address to the request.
      case 4:
        request.push(0x01);
        this.addIPv4Section(request);
        break;
      case 6:
        request.push(0x04);
        this.addIPv6Section(request);
        break;
      default:
    }

    // Add a placeholder for the port bytes.
    request.length += 2;

    const buffer = Buffer.from(request);
    buffer.writeUInt16BE(this.targetPort, buffer.length - 2);

    this.write(buffer);
  }
}
