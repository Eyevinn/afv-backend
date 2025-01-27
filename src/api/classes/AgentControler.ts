import { Static, Type } from '@sinclair/typebox';
import Agent, { AgentHealthCheck, SerializedAgent } from './Agent';

export const SerializedAgents = Type.Array(SerializedAgent);

export const AgentsHealthCheck = Type.Array(AgentHealthCheck);

class AgentControler {
  _agents: Agent[];

  constructor() {
    this._agents = [];
  }

  async createAgent(url: string, name: string) {
    const newAgent = new Agent(url, name);
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

  get healthcheck(): Static<typeof AgentsHealthCheck> {
    return this._agents.map((agent) => agent.healthcheck);
  }

  get serializedAgents(): Static<typeof SerializedAgents> {
    return this._agents.map((agent) => agent.serialize());
  }
}

export default new AgentControler();
