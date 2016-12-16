declare function require(string: string): string;
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
  retirementAge: number;
  lifeExpectancy: number;
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
    svg: d3.Selection<any, any, any, any>;
    points: Chart.IPoints;
    data: {
      xAxis: any[];
      yAxis: any[];
    };
  }

  interface IPoints {
    interactive: Array<[number, number]>;
    fixed: {
      yAxis: Array<[number, number]>
    };
  }
}
