declare function require(string: string): string;
type Point = number[]; // x, y coords
interface IKnobHandle {
  x: number;
  y: number;
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  bgCanvas: HTMLCanvasElement;
  bgCanvasCtx: CanvasRenderingContext2D;
  gaugeCanvas: HTMLCanvasElement;
  gaugeCanvasCtx: CanvasRenderingContext2D;
  handleCanvas: HTMLCanvasElement;
  handleCanvasCtx: CanvasRenderingContext2D;
  radius: number;
  offset: number;
  lineWidth: number;
  color: {
    fill: string;
    stroke: string;
    arrow: string;
  };
  dialStep: number;
  value: {
    prev: number;
    curr: number;
    acc: number;
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
  export interface JQueryKnobOptions {
    /**
     * min value | default=0
     */
    min?: number;
    /**
     * max value | default=100
     */
    max?: number;
    /**
     * step size | default=1
     */
    step?: number;
    /**
     * starting angle in degrees | default=0
     */
    angleOffset?: number;
    /**
     * arc size in degrees | default=360
     */
    angleArc?: number;
    /**
     * stop at min & max on keydown/mousewheel | default=true
     */
    stopper?: boolean;
    /**
     * disable input and events | default=false
     */
    readOnly?: boolean;
    /**
     * direction of progression | default=clockwise
     */
    rotation?: string;
    /**
     * display mode "cursor", cursor size could be changed passing a
     * numeric value to the option, default width is used when passing
     * boolean value "true" | default=gauge
     */
    cursor?: string | boolean;
    /**
     * gauge thickness
     */
    thickness?: number;
    /**
     * gauge stroke endings | default=butt, round=rounded line endings
     */
    lineCap?: string;
    /**
     * dial width
     */
    width?: number;
    /**
     * dial height
     */
    height?: number;
    /**
     * default=true | false=hide input
     */
    displayInput?: boolean;
    /**
     * default=false | true=displays the previous value with transparency
     */
    displayPrevious?: boolean;
    /**
     * foreground color
     */
    fgColor?: string;
    /**
     * input value (number) color
     */
    inputColor?: string;
    /**
     * font family
     */
    font?: string;
    /**
     * font weight
     */
    fontWeight?: string;
    /**
     * background color
     */
    bgColor?: string;
    /**
     * executed on release
     */
    release?: (value: number) => void;
    /**
     * executed at each change of the value
     */
    change?: (value: number) => void;
    /**
     * when drawing the canvas
     */
    draw?: () => void;
    /**
     * triggered on [esc] keydown
     */
    cancel?: () => void;
    /**
     * allows to format output (add unit %, ms...)
     */
    format?: (value: number) => void;
  }
}

interface JQuery {
  /**
   * Create a knob for the given input field, with optional options
   */
  knob(options?: JQueryKnob.JQueryKnobOptions): JQuery;
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
