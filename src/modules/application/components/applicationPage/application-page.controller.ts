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

  public setExistingSaving(obj: {}) {
    this.ClientService.set('existingSaving', obj['value']);

  }

  public setOnGoingSaving(obj: {}) {
    this.ClientService.set('onGoingSaving', obj['value']);
  }

  public setDesiredIncome(obj: {}) {
    this.ClientService.set('desiredIncome', obj['value']);
  }
}
