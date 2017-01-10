export default class ClientService {

  private client: IClient;

  constructor() {
    this.client = {
      existingSaving: 2000000,
      onGoingSaving: 10000,
      desiredIncome: 25000,
      currentAge: 42,
      retirementAge: 61,
      savingLostAge: 71,
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
