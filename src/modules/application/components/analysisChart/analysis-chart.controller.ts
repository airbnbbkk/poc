import RetirementCalculatorService from '../../services/retirement-calculator.service';
import ChartService from '../../services/chart.service';

export default class AnalysisChartController implements ng.IController {
    public static $inject: Array<string> = ['RetirementCalculator', 'ChartService'];

    // bindings
    public client: any;

    constructor(
        private RetirementCalculator: RetirementCalculatorService,
        private Chart: ChartService
    ) {}

    $onInit() {
        console.log('client', this.client);
    }

    $postLink() {
        console.log('getPoints', this.Chart.getPoints());
        //this.setSvg();
    }

    $onChanges(value: any) {
        console.log('onchange', value);
    }
}