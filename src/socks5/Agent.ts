import type { OptionInterface } from './HttpAgent';
import { HttpAgent } from './HttpAgent';
import { HttpsAgent } from './HttpsAgent';

export class AgentFactory {
  static create(initialOption: OptionInterface) {
    let agent;
    if (initialOption.type === 'http') {
      agent = new HttpAgent(initialOption);
    } else {
      agent = new HttpsAgent(initialOption);
    }
    return agent;
  }
}
