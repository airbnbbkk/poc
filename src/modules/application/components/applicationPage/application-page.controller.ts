import ClientService from '../../services/client.service';
export default class ApplicationPageController implements ng.IController {
  public static $inject: Array<string> = ['$scope', 'ClientService'];

  public client: any;

  constructor(
    private $scope: ng.IScope,
    private ClientService: ClientService
  ) {
  }

  $onInit() {
    this.client = this.ClientService.get('');
  }

  public setExistingSavings(value: number) {
    this.ClientService.set('existingSaving', value);
  }

  public setOnGoingSaving(obj: number) {
    this.ClientService.set('onGoingSaving', obj['value']);
    this.client = this.ClientService.get();
    console.log('this.client', this.client);
  }

  public setDesiredIncome(value: number) {
    this.ClientService.set('desiredIncome', value);
  }
}
