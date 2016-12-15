import * as d3 from 'd3';
import RetirementCalculatorService from '../../services/retirement-calculator.service';
import ChartService from '../../services/chart.service';

export default class AnalysisChartController implements ng.IController {
    public static $inject: Array<string> = ['RetirementCalculator', 'ChartService'];

    // bindings
    public client: any;

    private svg: any;
    private width: number;
    private height: number;

    constructor(
        private RetirementCalculator: RetirementCalculatorService,
        private Chart: ChartService
    ) {}

    $onInit() {
        console.log('client', this.client);

        this.width = 800;
        this.height = 500;
    }

    $postLink() {
        this.svg = d3.select('analysis-chart').append('svg')
                     .attr('width', this.width)
                     .attr('height', this.height);
        this.Chart.draw(this.svg);
    }

    $onChanges(value: any) {
        console.log('onchange', value);
    }

    $doCheck() {
        this.svg && this.Chart.redraw(this.svg);
    }
}