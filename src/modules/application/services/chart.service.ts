import * as d3 from 'd3';
import ClientService from './client.service';
import RetirementCalculatorService from './retirement-calculator.service';
import {ScaleLinear} from 'd3-scale';
export default class ChartService {
    public static $inject: Array<string> = ['ClientService', 'RetirementCalculator'];

    // Chart
    private svg: any;
    private points: Chart.IPoints = {interactive: [], fixed: {yAxis: []}};

    constructor(
        private Client: ClientService,
        private RetirementCalculator: RetirementCalculatorService
    ) {}

    public getPoints(): Chart.IPoints {
        this.setPoints();
        return this.points;
    }


    private setSvg() {
        this.svg = d3.select('analysis-chart').append('svg')
                     .attr('width', 500)
                     .attr('height', 500);
    }

    private setPoints() {
        const yAxis = this.getFixedYAxis();
        const neededBudget   = this.RetirementCalculator.get().neededBudget(),
              existingSaving = this.RetirementCalculator.get().existingSaving(),
              expectedBudget = this.RetirementCalculator.get().expectedBudget();

        console.log('neededBudget', neededBudget);
        console.log('expectedBudget', expectedBudget);

        this.points.fixed.yAxis.push([0, 0]);
        this.points.fixed.yAxis.push([0, yAxis(existingSaving)]);
        this.points.fixed.yAxis.push([0, yAxis(expectedBudget)]);
        this.points.fixed.yAxis.push([0, 1]);
    }

    private getFixedYAxis(): ScaleLinear<number, number> {
        const neededBudget = this.RetirementCalculator.get().neededBudget();

        return d3.scaleLinear()
                 .domain([0, neededBudget])
                 .range([0, 1]);
    }
}