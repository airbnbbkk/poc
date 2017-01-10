declare function require(string: string): string;
type Point = number[]; // x, y coords
interface IKnob {
  canvas: {
    width: number;
    el: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    resMultiplier: number;
  };
  radius: number;
  offset: number;
  lineWidth: number;
  color: {
    fill: string;
    stroke: string;
    arrow: string;
  };
}

interface IClient {
  existingSaving: number;
  onGoingSaving: number;
  desiredIncome: number;
  currentAge: number;
  savingLostAge: number;
  retirementAge: number;
  lifeExpectancyAge: number;
}

declare namespace JQueryKnob {
  interface JQueryKnobOptions {
    height?: number;
  }
}

declare namespace Chart {
  interface IChart {
    target: string;
    width: number;
    height: number;
    styles: {
      xAxis: {};
      yAxis: {};
      graph: {
        width: number;
        height: number;
      }
    };
    svg: d3.Selection<any, any, any, any>;
    points: Chart.IPoints;
    states: Chart.IStates;
    options: Chart.IOptions;
  }

  interface IPoints {
    graph: {
      origin: Point;
      shortFall: Point[];
      budget: Point[];
    };
    line: {
      xAxis: {
        axis: Point[];
        gradations: Point[][];
      };
      yAxis: {
        neededBudget: Point[];
        expectedBudget: Point[];
        existingSaving: Point[];
      };
    };
    legend: {
      x: any[];
      y: any[];
    };
  }

  interface IStates {
    isSliderSelected: boolean;
    isSliderMoving: boolean;
  }

  interface IOptions {
    startingAge: number;
    maximumAge: number;
  }
}
