import { Static, Type } from '@sinclair/typebox';
import Agent, { SerializedAgent } from './Agent';

export const SerializedAgents = Type.Array(SerializedAgent);

class AgentControler {
  _agents: Agent[];

  constructor() {
    this._agents = [];
  }

  async createAgent(url: string) {
    const newAgent = new Agent(url);
    await newAgent.init();
    this._agents.push(newAgent);
    return newAgent;
  }

  async deleteAgents(ids: string[]) {
    this._agents
      .filter((agent) => ids.includes(agent._id))
      ?.forEach((agent) => agent.close());
    this._agents = this._agents.filter((agent) => !ids.includes(agent._id));
  }

  get serializedAgents(): Static<typeof SerializedAgents> {
    return this._agents.map((agent) => agent.serialize());
  }
}

export default new AgentControler();
