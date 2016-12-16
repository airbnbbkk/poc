import * as d3 from 'd3';
import RetirementCalculatorService from './retirement-calculator.service';
import { Line } from 'd3-shape';
export default class ChartService {
  public static $inject: Array<string> = ['RetirementCalculator'];

  // Chart
  private chart = {
    width: 800,
    height: 500
  };
  private points: Chart.IPoints = {interactive: [], fixed: {yAxis: []}};
  private line: Line<[number, number]>;

  constructor(
    private RetirementCalculator: RetirementCalculatorService
  ) {
  }

  public draw(svg: any) {
    this.setPoints();
    this.setLine();
    this.setRect(svg);
    //this.setPath();
    svg.node().focus();
  }

  public redraw(svg: any) {

    this.setPoints();

    svg.select('path').attr('d', this.line);

    const circle = svg.selectAll('circle')
                      .data(this.points.fixed.yAxis, function (d) {
                        console.log('data', d);
                        return d;
                      });

    circle.enter().append('circle')
          .attr('r', 10.5)
          .attr('cx', function (d) {
            console.log('cx', d);
            return d[0];
          })
          .attr('cy', function (d) {
            console.log('cy', d);
            return d[1];
          });

    circle.exit().remove();
  }

  public getPoints(): Chart.IPoints {
    this.setPoints();
    return this.points;
  }

  private setRect(svg: any) {
    svg.append('rect')
       .attr('width', this.chart.width)
       .attr('height', this.chart.height);
    // .on('mousedown', mousedown);
  }

  private setPath(svg: any) {
    svg.append('path')
       .datum(this.points.fixed.yAxis)
       .attr('class', 'line')
       .call(this.redraw.bind(this));
  }

  private setLine() {
    this.line = d3.line();
  }

  private setPoints() {
    this.getFixedYAxis();
  }

  private getFixedYAxis(): void {
    console.log('getFixed', this.RetirementCalculator.get());
    const neededBudget   = this.RetirementCalculator.get().neededBudget(),
          existingSaving = this.RetirementCalculator.get().existingSaving(),
          expectedBudget = this.RetirementCalculator.get().expectedBudget();

    const yAxis = d3.scaleLinear()
                    .domain([0, neededBudget])
                    .range([0, 1]);

    console.log('neededBudget', neededBudget);
    console.log('expectedBudget', expectedBudget);

    this.points.fixed.yAxis = [];
    this.points.fixed.yAxis.push([240, 0]);
    this.points.fixed.yAxis.push([240, this.chart.height * yAxis(existingSaving)]);
    this.points.fixed.yAxis.push([240, this.chart.height * yAxis(expectedBudget)]);
    this.points.fixed.yAxis.push([240, this.chart.height]);
  }
}
