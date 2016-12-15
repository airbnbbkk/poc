import ClientService from '../../services/client.service';
export default class ApplicationPageController implements ng.IController {
    public static $inject: Array<string> = ['$scope', 'ClientService'];

    public client: any;

    constructor(
        private $scope: ng.IScope,
        private ClientService: ClientService
    ) {}

    $onInit() {}

    public setExistingSavings(value: number) {
        this.ClientService.set('existingSaving', value);
        this.$scope.$digest();
    }

    public setOnGoingSaving(value: number) {
        this.ClientService.set('onGoingSaving', value);
        this.$scope.$digest();
    }

    public setDesiredIncome(value: number) {
        this.ClientService.set('desiredIncome', value);
        this.$scope.$digest();
    }
}