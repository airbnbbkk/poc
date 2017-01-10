import RetirementCalculatorService from '../../services/retirement-calculator.service';
import ChartService from '../../services/chart.service';

export default class AnalysisChartController implements ng.IController {
  public static $inject: Array<string> = ['$element', 'RetirementCalculator', 'ChartService'];

  // bindings
  public client: any;

  public chart: Chart.IChart;
  public sliderOptions: {[name: string]: any};

  constructor(
    private $element: ng.IAugmentedJQuery,
    private RetirementCalculator: RetirementCalculatorService,
    private Chart: ChartService
  ) {}

  $onInit() {
    const actualChartDim       = this.$element[0].getClientRects()[0],
          chartLeftMarginRatio = 0.1;

    this.chart = {
      target: 'analysis-chart',
      width: actualChartDim.width,
      height: 400,
      svg: null,
      styles: {
        xAxis: {},
        yAxis: {},
        graph: {
          width: actualChartDim.width * (1 - chartLeftMarginRatio),
          height: 400
        }
      },
      points: {
        graph: {
          origin: [actualChartDim.width * chartLeftMarginRatio, 400],
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
      states: {
        isSliderSelected: false,
        isSliderMoving: false
      },
      options: {
        startingAge: this.client.currentAge - 3,
        maximumAge: 100
      }
    };

    this.chart.points.graph.origin = [this.chart.width - this.chart.styles.graph.width,
      this.chart.height - this.chart.styles.graph.height
    ];

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
    this.Chart.redraw();
  }
}
