import ClientService from '../../services/client.service';
import RetirementCalculatorService from '../../services/retirement-calculator.service';
export default class ApplicationPageController implements ng.IController {
  public static $inject: Array<string> = ['$scope', 'ClientService', 'RetirementCalculator'];

  public client: any;

  constructor(
    private $scope: ng.IScope,
    private ClientService: ClientService,
    private retirementCalculator: RetirementCalculatorService
  ) {
  }

  $onInit() {
    this.client = this.ClientService.get('');
  }

  public setExistingSaving(obj: {}) {
    this.ClientService.set('existingSaving', obj['value']);
  }

  public setOnGoingSaving(obj: {}) {
    this.ClientService.set('onGoingSaving', obj['value']);
  }

  public setDesiredIncome(obj: {}) {
    this.ClientService.set('desiredIncome', obj['value']);
  }

  public getNeededBudget(): number {
    return this.retirementCalculator.get().neededBudget();
  }
}
