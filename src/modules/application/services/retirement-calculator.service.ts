import ClientService from './client.service';
export default class RetirementCalculatorService {
  public static $inject: Array<string> = ['ClientService'];

  private client: IClient;

  constructor(
    private Client: ClientService
  ) {
    this.client = this.Client.get() as IClient;
  }

  // below formulas are pure imaginations for POC

  public get() {
    this.client = this.Client.get() as IClient;
    const result = {
      existingSaving: this.existingSaving.bind(this),
      neededBudget: this.neededBudget.bind(this),
      expectedBudget: this.expectedBudget.bind(this),
      shortFall: this.shortFall.bind(this)
    };
    return result;
  }

  private existingSaving(): number {
    return this.client.existingSaving;
  }

  private neededBudget(): number {
    return this.client.existingSaving + (this.getMonthsLeft() * this.client.desiredIncome);
  }

  private expectedBudget(): number {
    return this.client.existingSaving + (
      (this.getMonthsLeft() * this.client.desiredIncome) -
      (this.getMonthsLeft() * this.client.onGoingSaving));
  }

  private shortFall(): number {
    return 0;
  }

  private getMonthsLeft(): number {
    return (this.client.retirementAge - this.client.currentAge) * 12;
  }
}
