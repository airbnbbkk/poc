import * as $ from 'jquery';
class ValueDialController implements ng.IController {

  public static $inject: Array<string> = ['$scope', '$element'];
  // bindings
  public min: number;
  public max: number;
  public value: number;
  public dialStep: number;
  public onChange: (paramObj: {$event: {value: number}}) => void;

  private dialValue: number;
  private prevValue: number;
  private up: boolean;
  private down: boolean;

  private width: number;
  private knob: JQuery;
  private knobHandle: IKnobHandle;

  constructor(
    private $scope: ng.IScope,
    private $element: ng.IAugmentedJQuery
  ) {}

  $onInit() {
    this.width = 300;
    this.dialStep = Number(this.dialStep);
    this.setKnob();
    this.setFPS(60);
  }

  $onChanges(obj: ng.IOnChangesObject) {

  }

  $postLink() {
    $(this.$element).find('.dial').knob({
      'min': this.min,
      'max': 720,
      'width': this.width * (1 - this.knobHandle.offset),
      'height': this.width * (1 - this.knobHandle.offset),
      'cursor': '0',
      'displayInput': false,
      'stopper': false,
      'thickness': 0.25,
      'fgColor': 'rgba(0, 0, 0, 0)',
      'inputColor': '#343434',
      'bgColor': 'rgba(0, 0, 0, 0)',
      'release': (v) => {
        // console.log('release', v);
      },
      'change': (value: number) => {
        this.dialValue = value;
        this.update();
      },
      'draw': ((vdCtrl: ValueDialController) => function () {
        vdCtrl.knob = window['ctx'] = this;
      })(this)
    });
    this.knobHandle.radius = this.width * this.knob['scale'] / 10;
    this.createKnobHandleCanvas();
    this.drawKnobHandleBg();
    this.reDrawKnobHandle();
  }

  private setFPS(wait: number) {

    let timeout = null;
    let previous = 0;
    wait = 1000 / wait;
    let later = () => {
      previous = new Date().getTime();
      timeout = null;
      this._update();
    };
    this.update = () => {
      let now = new Date().getTime();
      let remaining = wait - (now - previous);
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        this._update();
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
    };
  }

  private update() {
    this._update();
  }

  private _update() {
    if (this.prevValue > this.dialValue) {
      if (this.up && this.value > 0) {
        this.value -= this.knobHandle.dialStep;
        this.up = false;
      } else {
        this.up = true;
        this.down = false;
      }
    } else {
      if (this.prevValue < this.dialValue) {
        if (this.down) {
          this.value += this.knobHandle.dialStep;
          this.down = false;
        } else {
          this.up = false;
          this.down = true;
        }
      }
    }
    this.prevValue = this.dialValue;
    this.$scope.$apply(() => {
      this.onChange({$event: {value: this.value}});
    });
    this.reDrawKnobHandle();
  }

  private reDrawKnobHandle() {
    if (!this.knobHandle.canvas) {return;}
    this.knobHandle.canvasCtx.clearRect(0, 0, this.knobHandle.canvas.width, this.knobHandle.canvas.height);
    this.drawKnobHandle();
  }

  private drawKnobHandleBg() {
    const grad = this.knobHandle.canvasCtx.createLinearGradient(0, 0, 300, 0);
    grad.addColorStop(0, '#dfd6ef');
    grad.addColorStop(1, '#78bab0');
    this.knobHandle.bgCanvasCtx.beginPath();
    this.knobHandle.bgCanvasCtx.arc(this.knobHandle.canvas.width / 2, this.knobHandle.canvas.height / 2, this.knob['radius'] - (this.width * this.knobHandle.offset / 2), 0, this.knob['PI2'], false);
    this.knobHandle.bgCanvasCtx.fillStyle = '#fff';
    this.knobHandle.bgCanvasCtx.shadowBlur = 80;
    this.knobHandle.bgCanvasCtx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    this.knobHandle.bgCanvasCtx.shadowOffsetX = 5;
    this.knobHandle.bgCanvasCtx.shadowOffsetY = 15;
    this.knobHandle.bgCanvasCtx.fill();

    this.knobHandle.bgCanvasCtx.beginPath();
    this.knobHandle.bgCanvasCtx.arc(this.knobHandle.canvas.width / 2, this.knobHandle.canvas.height / 2, this.knob['radius'], 0, this.knob['PI2'], false);

    this.knobHandle.bgCanvasCtx.strokeStyle = grad;
    this.knobHandle.bgCanvasCtx.lineWidth = 5;
    this.knobHandle.bgCanvasCtx.stroke();
  }

  private drawKnobHandle(): void {
    const currentValue = this.knob['cv'];
    const coords = this.getKnobCoords(
      this.knob['xy'] + (this.width * this.knobHandle.offset),
      this.knob['arc'](currentValue).e,
      this.knob['radius']);


    this.knobHandle.canvasCtx.beginPath();
    this.knobHandle.canvasCtx.arc(coords.x, coords.y, this.knobHandle.radius, 0, this.knob['PI2'], false);
    this.knobHandle.canvasCtx.fillStyle = this.knobHandle.color.fill;
    this.knobHandle.canvasCtx.shadowBlur = 20;
    this.knobHandle.canvasCtx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    this.knobHandle.canvasCtx.shadowOffsetX = 5;
    this.knobHandle.canvasCtx.shadowOffsetY = 15;
    this.knobHandle.canvasCtx.fill();

    this.knobHandle.canvasCtx.font = '2rem Georgia';
    this.knobHandle.canvasCtx.fillStyle = '#ff0000';
    this.knobHandle.canvasCtx.fillText('< >', coords.x, coords.y);
  }

  private drawKnobBg() {

  }

  private createKnobHandleCanvas() {
    this.knobHandle.canvas.width = this.knobHandle.bgCanvas.width = this.width * this.knob['scale'];
    this.knobHandle.canvas.height = this.knobHandle.bgCanvas.height = this.width * this.knob['scale'];
    this.knobHandle.canvas.style.width = this.knobHandle.bgCanvas.style.width = this.width + 'px';
    this.knobHandle.canvas.style.height = this.knobHandle.bgCanvas.style.height = this.width + 'px';
    this.knobHandle.canvas.style.left = this.knobHandle.bgCanvas.style.left = `-${this.width * this.knobHandle.offset / 2}px`;
    this.knobHandle.canvas.style.top = this.knobHandle.bgCanvas.style.top = `-${this.width * this.knobHandle.offset / 2}px`;
    this.knobHandle.canvas.style.position = this.knobHandle.bgCanvas.style.position = 'absolute';
    this.knobHandle.canvas.style.pointerEvents = this.knobHandle.bgCanvas.style.pointerEvents = 'none';
    $(this.$element).find('.dial-wrapper').append(this.knobHandle.bgCanvas);
    $(this.$element).find('.dial-wrapper').append(this.knobHandle.canvas);
  }


  private setKnob(): void {
    const canvas = document.createElement('canvas');
    const bgCanvas = document.createElement('canvas');
    this.knobHandle = {
      canvas: canvas,
      canvasCtx: canvas.getContext('2d'),
      bgCanvas: bgCanvas,
      bgCanvasCtx: bgCanvas.getContext('2d'),
      radius: this.width * 0.2,
      offset: 0.2,
      lineWidth: 3,
      color: {
        fill: '#fff',
        stroke: '#bbb',
        arrow: '#ffffff'
      },
      dialStep: this.dialStep || Number(this.max) * 0.001
    };
  }

  private getKnobCoords(center: number, endAngle: number, radius: number) {
    return {
      x: center + Math.cos(endAngle) * radius,
      y: center + Math.sin(endAngle) * radius
    };
  }
}

export default ValueDialController;
