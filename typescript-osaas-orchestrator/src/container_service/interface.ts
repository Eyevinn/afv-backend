export type ContainerInstanceId = string;

export interface ContainerInstance {
  id: ContainerInstanceId;
  customer: string;
}

export interface ContainerServiceInterface {
  initService: () => Promise<void>;

  startInstance: (
    customer: string
  ) => Promise<ContainerInstanceId>;

  destroyInstance: (id: ContainerInstanceId) => Promise<void>;

  getInstance: (
    id: ContainerInstanceId
  ) => Promise<ContainerInstance | undefined>;
  
  listInstances: (customer: string) => Promise<ContainerInstanceId[]>;
}