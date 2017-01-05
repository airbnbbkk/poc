import * as d3 from 'd3';
import RetirementCalculatorService from './retirement-calculator.service';
import ClientService from './client.service';
export default class ChartService {
  public static $inject: Array<string> = ['RetirementCalculator', 'ClientService'];


  private line = d3.line();

  private points: any;

  constructor(
    private RetirementCalculator: RetirementCalculatorService,
    private clientService: ClientService
  ) {
  }

  public draw(chart: Chart.IChart) {
    this.drawSvg(chart);
    this.setPoints(chart);
    this.drawPoints(chart);
    this.setLine();
    this.setRect(chart);
    this.drawXAxis(chart);
    this.drawYAxis(chart);
    this.drawLines(chart);
    chart.svg.node().focus();
  }

  public redraw(chart: Chart.IChart) {
    if (!this.points) { return; }
    this.setPoints(chart);
    this.drawPoints(chart);
    this.drawXAxis(chart);
    this.drawYAxis(chart);
    this.reDrawLines(chart);

    /*    let legend = chart.svg.append('g')
     .attr('class', 'x legend')
     .attr('transform', 'translate(100,' + 300 + ')')
     .call(ya);*/

    /*this.points.data(chart.points.legend.y, d => d)
     .interrupt()
     .transition()
     .delay(0)
     .duration(0)
     .attr('cx', d => {
     console.log(d);
     return d[0];
     })
     .attr('cy', d => d[1]);*/
  }

  private drawSvg(chart: Chart.IChart) {
    chart.svg = d3.select('analysis-chart').append('svg')
                  .attr('width', chart.width)
                  .attr('height', chart.height);
  }

  private drawPoints(chart: Chart.IChart) {
    const points = chart.svg.selectAll('circle')
                        .data(chart.points.legend.x.concat(chart.points.legend.y), d => d);

    this.points = points;
    points.enter().append('circle')
          .attr('r', 10.5)
          .attr('cx', d => d[0])
          .attr('cy', d => d[1]);

    points.exit().remove();
  }

  private setRect(chart: Chart.IChart) {
    chart.svg.append('rect')
         .attr('width', chart.width)
         .attr('height', chart.height);
    // .on('mousedown', mousedown);
  }

  private setLine() {
    this.line = d3.line();
  }

  private setPoints(chart: Chart.IChart): void {
    this.getXAxis(chart);
    this.getYAxis(chart);
  }

  private getXAxis(chart: Chart.IChart): void {

    const current            = this.clientService.get('currentAge') as number,
          desiredRetirement  = this.clientService.get('desiredRetirementAge') as number,
          expectedRetirement = this.clientService.get('retirementAge') as number,
          lifeExpectancy     = this.clientService.get('lifeExpectancyAge') as number;

    const xAxis = d3.scaleLinear()
                    .domain([lifeExpectancy, current * 0.9])
                    .range([1, 0]);

    chart.points.legend.x[0] = [chart.width * xAxis(current), chart.height, 'Current age'];
    chart.points.legend.x[1] = [chart.width * xAxis(desiredRetirement), chart.height, 'Desired retirement age'];
    chart.points.legend.x[2] = [chart.width * xAxis(expectedRetirement), chart.height, 'retirement age'];
    chart.points.legend.x[3] = [chart.width * 0.9, chart.height, 'Life expectancy age'];

    chart.points.line.existingSaving[0][0] = 0;
    chart.points.line.existingSaving[1][0] = chart.points.legend.x[1][0];

    chart.points.line.expectedBudget[0][0] = 0;
    chart.points.line.expectedBudget[1][0] = chart.points.legend.x[1][0];

    chart.points.line.neededBudget[0][0] = 0;
    chart.points.line.neededBudget[1][0] = chart.points.legend.x[1][0];
  }

  private getYAxis(chart: Chart.IChart): void {

    const neededBudget   = this.RetirementCalculator.get().neededBudget(),
          existingSaving = this.RetirementCalculator.get().existingSaving(),
          expectedBudget = this.RetirementCalculator.get().expectedBudget();

    const yAxis = d3.scaleLinear()
                    .domain([0, neededBudget])
                    .range([1, 0]);


    chart.points.legend.y[0] = [10, chart.height * yAxis(expectedBudget), 'expectedBudget'];
    chart.points.legend.y[1] = [10, chart.height * yAxis(existingSaving), 'existingSaving'];
    chart.points.legend.y[2] = [10, 0, 'neededBudget'];

    chart.points.line.existingSaving[0][1] = chart.points.legend.y[1][1];
    chart.points.line.existingSaving[1][1] = chart.points.legend.y[1][1];

    chart.points.line.expectedBudget[0][1] = chart.points.legend.y[0][1];
    chart.points.line.expectedBudget[1][1] = chart.points.legend.y[0][1];

    chart.points.line.neededBudget[0][1] = chart.points.legend.y[2][1];
    chart.points.line.neededBudget[1][1] = chart.points.legend.y[2][1];

  }

  private moveCircles() {

  }

  private drawXAxis(chart: Chart.IChart) {
    const legend = chart.svg.selectAll('.xLegend')
                        .data(chart.points.legend.x, d => d);

    legend.enter().append('text')
          .attr('class', 'label xLegend')
          .attr('x', d => d[0])
          .attr('y', d => {
            console.log(d);
            return d[1];
          })
          .text(d => d[2]);

    legend.exit().remove();
  }

  private drawYAxis(chart: Chart.IChart) {
    const legend = chart.svg.selectAll('.yLegend')
                        .data(chart.points.legend.y, d => d);

    legend.enter().append('text')
          .attr('class', 'label yLegend')
          .attr('x', d => d[0])
          .attr('y', d => d[1])
          .text(d => d[2]);

    legend.exit().remove();


    /*    let legend = chart.svg.append('g')
     .attr('class', 'x legend')
     .attr('transform', 'translate(100,' + 300 + ')')
     .call(ya);*/
  }

  private drawLines(chart: Chart.IChart) {
    chart.svg.append('path')
         .datum(chart.points.line.existingSaving)
         .attr('class', 'line');

    chart.svg.append('path')
         .datum(chart.points.line.expectedBudget)
         .attr('class', 'line');

    chart.svg.append('path')
         .datum(chart.points.line.neededBudget)
         .attr('class', 'line');

    chart.svg.append('polyline')
         .attr('points', '05,30 15,10 25,30')
         .attr('stroke-width', '2px')
         .attr('stroke', 'black');
  }

  private reDrawLines(chart: Chart.IChart) {
    chart.svg.selectAll('path').attr('d', this.line);
  }

}
