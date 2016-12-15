import ClientService from '../../services/client.service';
export default class ApplicationPageController implements ng.IController {
    public static $inject: Array<string> = ['$scope', 'ClientService'];

    public client: any;

    constructor(
        private $scope: ng.IScope,
        private ClientrService: ClientService
    ) {}

    $onInit() {}

    public setExistingSavings(value: number) {
        this.ClientrService.set('existingSaving', value);
        this.$scope.$digest();
    }

    public setOnGoingSaving(value: number) {
        this.ClientrService.set('existingSaving', value);
    }

    public setDesiredIncome(value: number) {
        this.ClientrService.set('existingSaving', value);
    }
}