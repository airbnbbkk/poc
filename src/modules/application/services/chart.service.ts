import * as d3 from 'd3';
import RetirementCalculatorService from './retirement-calculator.service';
import {Line} from 'd3-shape';
export default class ChartService {
  public static $inject: Array<string> = ['RetirementCalculator'];


  private line: Line<[number, number]>;

  constructor(
    private RetirementCalculator: RetirementCalculatorService
  ) {
  }

  public draw(chart: Chart.IChart) {
    this.drawSvg(chart);
    this.getPoints(chart);
    this.drawCircles(chart);
    this.setPoints(chart);
    this.setLine();
    this.setRect(chart);
    this.drawAxis(chart);
    //this.setPath(svg);
    chart.svg.node().focus();
  }

  public redraw(chart: Chart.IChart) {

    /*circles.data(this.setPoints(chart).fixed.yAxis)
     .interrupt()
     .transition()
     .delay(0)
     .duration(0)
     .attr('cx', d => d[0])
     .attr('cy', d => d[1]);*/


    /*circle.append('text')
     .attr('class', 'label')
     .attr('x', d => d - 50)
     .attr('y', 10)
     .attr('dy', '.35em')
     .text('test');
     */
  }

  private drawSvg(chart: Chart.IChart) {
    chart.svg = d3.select('analysis-chart').append('svg')
                  .attr('width', chart.width)
                  .attr('height', chart.height);
  }

  private drawCircles(chart: Chart.IChart) {
    const circle = chart.svg.selectAll('circle')
                        .data(chart.points.fixed.yAxis, d => d);
    circle.enter().append('circle')
          .attr('r', 10.5)
          .attr('cx', d => d[0])
          .attr('cy', d => d[1]);
  }

  private setRect(chart: Chart.IChart) {
    chart.svg.append('rect')
         .attr('width', chart.width)
         .attr('height', chart.height);
    // .on('mousedown', mousedown);
  }

  private setPath(svg: any) {
    svg.append('path')
       .datum(this.points.fixed.yAxis)
       .attr('class', 'line');
  }

  private setLine() {
    this.line = d3.line();
  }

  private setPoints(chart: Chart.IChart): void {
    this.getFixedYAxis(chart);
  }

  private getFixedYAxis(chart: Chart.IChart): void {

    const neededBudget   = this.RetirementCalculator.get().neededBudget(),
          existingSaving = this.RetirementCalculator.get().existingSaving(),
          expectedBudget = this.RetirementCalculator.get().expectedBudget();

    const yAxis = d3.scaleLinear()
                    .domain([0, neededBudget])
                    .range([1, 0]);

    chart.points.fixed.yAxis.push([240, chart.height * yAxis(expectedBudget)]);
    chart.points.fixed.yAxis.push([240, chart.height * yAxis(existingSaving)]);
    chart.points.fixed.yAxis.push([240, 0]);
  }

  private moveCircles() {

  }

  private drawAxis(chart: Chart.IChart) {
    let ya = d3.axisLeft(chart.svg)
               .scale(yAxis);

    let legend = chart.svg.append('g')
                      .attr('class', 'x axis')
                      .attr('transform', 'translate(100,' + 300 + ')')
                      .call(ya);
  }
}
