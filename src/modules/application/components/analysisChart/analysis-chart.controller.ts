import RetirementCalculatorService from '../../services/retirement-calculator.service';
import ChartService from '../../services/chart.service';

export default class AnalysisChartController implements ng.IController {
  public static $inject: Array<string> = ['$scope', '$element', '$timeout', 'RetirementCalculator', 'ChartService'];

  // bindings
  public client: any;

  public chart: Chart.IChart;
  public sliderOptions: {[name: string]: any};

  constructor(
    private $scope: ng.IScope,
    private $element: ng.IAugmentedJQuery,
    private $timeout: ng.ITimeoutService,
    private RetirementCalculator: RetirementCalculatorService,
    private Chart: ChartService
  ) {}

  $onInit() {
    const actualChartDim   = this.$element[0].getClientRects()[0],
          chartW           = Math.round(actualChartDim.width),
          chartH           = Math.round(actualChartDim.height * 0.85),
          chartMarginRatio = 0.1;

    this.chart = {
      target: 'analysis-chart',
      width: chartW,
      height: chartH,
      svg: null,
      styles: {
        xAxis: {},
        yAxis: {},
        graph: {
          width: chartW * (1 - chartMarginRatio),
          height: chartH
        }
      },
      points: {
        graph: {
          origin: [Math.round(chartW * chartMarginRatio), chartH],
          shortFall: [],
          budget: []
        },
        line: {
          xAxis: {
            axis: [],
            gradations: []
          },
          yAxis: {
            neededBudget: [[], []],
            expectedBudget: [[], []],
            existingSaving: [[], []]
          }
        },
        legend: {
          x: [],
          y: []
        }
      },
      options: {
        startingAge: this.client.currentAge - 2,
        maximumAge: 100
      }
    };

    this.sliderOptions = {
      floor: this.chart.options.startingAge,
      ceil: this.chart.options.maximumAge,
      showTicksValues: true,
      ticksArray: [this.client.currentAge, this.client.savingLostAge],
      onlyBindHandles: true,
      translate: (value, sliderId, label) => {
        return value;
      }
    };
  }

  $postLink() {
    this.Chart.draw(this.chart);
  }

  $onChanges(value: any) {

  }

  $doCheck() {
    this.Chart.redraw(this.chart);
  }
}
