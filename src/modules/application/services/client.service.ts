export default class ClientService {

  private client: any;

  constructor() {
    this.client = {
      existingSaving: 2000000,
      onGoingSaving: 10000,
      desiredIncome: 25000,
      currentAge: 42,
      desiredRetirementAge: 61,
      retirementAge: 71,
      lifeExpectancyAge: 80
    };
  }

  public get(key?: string): IClient | number {
    return key ? this.client[key] : this.client as IClient;
  }

  public set(key: string, value: number): void {
    this.client[key] = value;
  }
}
