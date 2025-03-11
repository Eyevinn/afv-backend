import { Static, Type } from '@sinclair/typebox';
import Agent, { SerializedAgent } from './Agent';
import { MessageTranslatorOptions } from './MessageTranslator';

export const SerializedAgents = Type.Array(SerializedAgent);

class AgentControler {
  _agents: Agent[];

  constructor() {
    this._agents = [];
  }

  private isUniqueUrl(url: string) {
    return !this._agents.find((agent) => agent._url === url);
  }

  async createAgent(
    url: string,
    name: string,
    options?: Partial<MessageTranslatorOptions>
  ) {
    if (!this.isUniqueUrl(url)) throw new Error('WebSocket URL already in use');
    const newAgent = new Agent(url, name, options);
    await newAgent.connect();
    this._agents.push(newAgent);
    return newAgent;
  }

  async deleteAgents(ids: string[]) {
    this._agents
      .filter((agent) => ids.includes(agent._id))
      ?.forEach((agent) => agent.delete());
    this._agents = this._agents.filter((agent) => !ids.includes(agent._id));
  }

  public findAgent(id: string) {
    return this._agents.find((agent) => agent._id === id);
  }

  get serializedAgents(): Static<typeof SerializedAgents> {
    return this._agents.map((agent) => agent.serialize());
  }
}

export default new AgentControler();
