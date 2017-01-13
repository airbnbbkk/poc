declare function require(string: string): string;
type Point = number[]; // x, y coords
interface IKnobHandle {
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  bgCanvas: HTMLCanvasElement;
  bgCanvasCtx: CanvasRenderingContext2D;
  radius: number;
  offset: number;
  lineWidth: number;
  color: {
    fill: string;
    stroke: string;
    arrow: string;
  };
  dialStep: number;
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

  interface IOptions {
    startingAge: number;
    maximumAge: number;
  }
}
