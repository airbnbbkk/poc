import ClientService from '../../services/client.service';
import RetirementCalculatorService from '../../services/retirement-calculator.service';
export default class ApplicationPageController implements ng.IController {
  public static $inject: Array<string> = ['$element', '$scope', 'ClientService', 'RetirementCalculator'];

  public client: any;

  public valueDialWidth: number;

  constructor(
    private $element: ng.IAugmentedJQuery,
    private $scope: ng.IScope,
    private ClientService: ClientService,
    private retirementCalculator: RetirementCalculatorService
  ) {
  }

  $onInit() {
    this.client = this.ClientService.get('');
  }

  private setExistingSaving(obj: {}) {
    this.ClientService.set('existingSaving', obj['value']);
  }

  private setOnGoingSaving(obj: {}) {
    this.ClientService.set('onGoingSaving', obj['value']);
  }

  private setDesiredIncome(obj: {}) {
    this.ClientService.set('desiredIncome', obj['value']);
  }

  private getNeededBudget(): number {
    return this.retirementCalculator.get().neededBudget();
  }

  private getShortfall(): number {
    return this.retirementCalculator.get().shortFall();
  }

  private getSavingLostAge(): number {
    return this.retirementCalculator.get().savingLostAge();
  }

  private getSavingLastYrs(): number {
    return this.retirementCalculator.get().savingLastYrs();
  }
}
