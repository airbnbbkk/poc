import * as d3 from 'd3';
import RetirementCalculatorService from './retirement-calculator.service';
import ClientService from './client.service';
import {Line} from 'd3-shape';

export default class ChartService {
  public static $inject: Array<string> = ['RetirementCalculator', 'ClientService'];

  private line: Line<[number, number]>;
  private chart: Chart.IChart;

  constructor(
    private retirementCalculator: RetirementCalculatorService,
    private clientService: ClientService
  ) {
    this.line = d3.line();
  }

  public draw(chart: Chart.IChart) {
    this.chart = chart;

    this.createSvg()
        .setPoints()
        .drawGraph()
        .drawGuideLine()
        .drawYAxis();
    // .drawPoints()

    this.chart.svg.node().focus();
  }

  public redraw(chart: Chart.IChart) {
    this.chart = chart;
    this._redraw();
  }

  private _redraw() {
    if (!this.chart.svg) { return; }
    this.setPoints()
        .reDrawGraph()
        .reDrawGuideLine()
        .reDrawYAxis();
  }

  private drawPoints() {
    const points = this.chart.svg.selectAll('circle')
                       .data(this.chart.points.legend.x.concat(this.chart.points.legend.y), d => d);

    points.enter().append('circle')
          .attr('r', 10.5)
          .attr('cx', d => d[0])
          .attr('cy', d => d[1]);

    points.exit().remove();

    return this;
  }

  private createSvg() {
    this.chart.svg = d3.select('analysis-chart .chart').append('svg')
                       .attr('width', this.chart.width)
                       .attr('height', this.chart.height);
    return this;
  }

  private setPoints(): this {
    return this.setXAxisPoints()
               .setYAxisPoints()
               .setGuideLinePoints()
               .setGraphPoints();
  }

  private setXAxisPoints(): this {

    const current        = this.clientService.get('currentAge') as number,
          retirementAge  = this.clientService.get('retirementAge') as number,
          savingLostAge  = this.clientService.get('savingLostAge') as number,
          lifeExpectancy = this.clientService.get('lifeExpectancyAge') as number;


    const xAxis = d3.scaleLinear()
                    .domain([this.chart.options.maximumAge, this.chart.options.startingAge])
                    .range([1, 0]);

    const startXPoint = this.chart.points.graph.origin[0];

    this.chart.points.legend.x[0] = [Math.round(this.chart.styles.graph.width * xAxis(current) + startXPoint), this.chart.styles.graph.height, 'Current age'];
    this.chart.points.legend.x[1] =
      [Math.round(this.chart.styles.graph.width * xAxis(retirementAge) + startXPoint),
        this.chart.styles.graph.height,
        'Desired retirement age'];
    this.chart.points.legend.x[2] =
      [Math.round(this.chart.styles.graph.width * xAxis(savingLostAge) + startXPoint), this.chart.styles.graph.height, 'retirement age'];
    this.chart.points.legend.x[3] =
      [Math.round(this.chart.styles.graph.width * xAxis(lifeExpectancy) + startXPoint),
        this.chart.styles.graph.height,
        'Life expectancy age'];

    // xAxis line
    this.chart.points.line.xAxis.axis[0] = [0, this.chart.styles.graph.height];
    this.chart.points.line.xAxis.axis[1] = [this.chart.styles.graph.width, this.chart.styles.graph.height];

    return this;
  }

  private setYAxisPoints(): this {

    const neededBudget   = this.retirementCalculator.get().neededBudget(),
          existingSaving = this.retirementCalculator.get().existingSaving(),
          expectedBudget = this.retirementCalculator.get().expectedBudget();

    const yAxis = d3.scaleLinear()
                    .domain([0, 10000000])
                    .range([1, 0]);


    this.chart.points.legend.y[0] = [60, Math.round(this.chart.height * yAxis(existingSaving)), existingSaving];
    this.chart.points.legend.y[1] = [60, Math.round(this.chart.height * yAxis(expectedBudget)), expectedBudget];
    this.chart.points.legend.y[2] = [60, Math.round(this.chart.height * yAxis(neededBudget)), neededBudget];
    return this;
  }

  private setGuideLinePoints() {

    this.chart.points.line.yAxis.existingSaving[0] = [this.chart.points.legend.y[0][0] + 15, this.chart.points.legend.y[0][1]];
    this.chart.points.line.yAxis.existingSaving[1] = [this.chart.points.legend.x[0][0], this.chart.points.legend.y[0][1]];

    this.chart.points.line.yAxis.expectedBudget[0] = [this.chart.points.legend.y[0][0] + 15, this.chart.points.legend.y[1][1]];
    this.chart.points.line.yAxis.expectedBudget[1] = [this.chart.points.legend.x[1][0], this.chart.points.legend.y[1][1]];

    this.chart.points.line.yAxis.neededBudget[0] = [this.chart.points.legend.y[0][0] + 15, this.chart.points.legend.y[2][1]];
    this.chart.points.line.yAxis.neededBudget[1] = [this.chart.points.legend.x[1][0], this.chart.points.legend.y[2][1]];

    return this;
  }

  private setGraphPoints() {
    return this.setBudgetGraphPoints()
               .setShortFallGraphPoints();
  }

  private setBudgetGraphPoints() {
    const p0 = [this.chart.points.graph.origin[0], this.chart.points.legend.y[0][1]],
          p1 = [this.chart.points.legend.x[0][0], this.chart.points.legend.y[0][1]],
          p2 = [this.chart.points.legend.x[0][0], this.chart.points.legend.y[0][1]],
          p3 = [this.chart.points.legend.x[1][0] - 5, this.chart.points.legend.y[1][1]],
          p4 = [this.chart.points.legend.x[1][0] + 5, this.chart.points.legend.y[1][1]],
          p5 = [this.chart.points.legend.x[2][0], this.chart.points.legend.x[2][1]],
          p6 = [this.chart.points.graph.origin[0], this.chart.height];

    this.chart.points.graph.budget = [p0, p1, p2, p3, p4, p5, p6];

    return this;
  }

  private setShortFallGraphPoints() {
    const p0 = this.chart.points.graph.budget[1],
          p1 = [this.chart.points.legend.x[1][0] - 5, this.chart.points.legend.y[2][1]],
          p2 = [this.chart.points.legend.x[1][0] + 5, this.chart.points.legend.y[2][1]],
          p3 = [this.chart.points.legend.x[3][0], this.chart.points.legend.x[3][1]],
          p4 = this.chart.points.graph.budget[5],
          p5 = this.chart.points.graph.budget[4],
          p6 = this.chart.points.graph.budget[3],
          p7 = this.chart.points.graph.budget[2],
          p8 = this.chart.points.graph.budget[1];

    this.chart.points.graph.shortFall = [p0, p1, p2, p3, p4, p5, p6, p7, p8];

    return this;
  }

  private drawYAxis(): this {
    const legend = this.chart.svg.selectAll('.yLegend')
                       .data(this.chart.points.legend.y, d => d);

    legend.enter().append('text')
          .attr('class', 'label yLegend')
          .attr('transform', d => `translate(${d[0]},${d[1]})`)
          .attr('text-anchor', 'end')
          .text(d => d[2]);

    /*    let legend = chart.svg.append('g')
     .attr('class', 'x legend')
     .attr('transform', 'translate(100,' + 300 + ')')
     .call(ya);*/
    return this;
  }

  private reDrawYAxis(): this {
    this.chart.svg.selectAll('.yLegend')
        .text((d: any, i: number) => this.chart.points.legend.y[i][2])
        .attr('transform', (d: any, i: number) =>
          `translate(${this.chart.points.legend.y[i][0]},${this.chart.points.legend.y[i][1]})`)


    return this;
  }

  private drawGuideLine(): this {
    const points = this.chart.svg.selectAll('path')
                       .data([this.chart.points.line.yAxis.existingSaving,
                         this.chart.points.line.yAxis.expectedBudget,
                         this.chart.points.line.yAxis.neededBudget
                       ]);

    points.enter().append('path')
          .attr('class', 'guide-line line');

    return this;
  }

  private drawGraph(): this {
    this.chart.svg.append('polygon')
        .attr('class', 'graph-budget graph')
        .attr('points', `${this.chart.points.graph.budget.join(' ')}`)
        .attr('fill', 'lightblue');

    this.chart.svg.append('polygon')
        .attr('class', 'graph-short-fall graph')
        .attr('points', `${this.chart.points.graph.shortFall.join(' ')}`)
        .attr('fill', 'red');

    return this;
  };

  private reDrawGraph(): this {
    this.chart.svg
        .select('.graph-budget')
        .attr('points', `${this.chart.points.graph.budget.join(' ')}`);
    this.chart.svg
        .select('.graph-short-fall')
        .attr('points', `${this.chart.points.graph.shortFall.join(' ')}`);
    return this;
  }

  private reDrawGuideLine(): this {
    this.chart.svg
        .selectAll('path')
        .attr('d', this.line);
    return this;
  }
}
