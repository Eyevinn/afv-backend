import { KubeConfig } from '@kubernetes/client-node';
import { ContainerInstance, ContainerServiceInterface } from "./interface";

export class K8S implements ContainerServiceInterface {
  private kubeConfig: KubeConfig;
  private kubeConfigFile: string;

  constructor(kubeConfigFile: string) {
    this.kubeConfig = new KubeConfig();
    this.kubeConfigFile = kubeConfigFile;
  }
  initService: () => Promise<void>;
  startInstance: (customer: string) => Promise<string>;
  destroyInstance: (id: string) => Promise<void>;
  getInstance: (id: string) => Promise<ContainerInstance | undefined>;
  listInstances: (customer: string) => Promise<string[]>;  
}