import * as $ from 'jquery';
class ValueDialController implements ng.IController {

  public static $inject: Array<string> = ['$scope', '$element'];
  // bindings
  public min: number;
  public max: number;
  public value: number;
  public dialStep: number;
  public onChange: (paramObj: {$event: {value: number}}) => void;

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
    this.width = this.$element[0].getBoundingClientRect().width;
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
      'width': Math.round(this.width * (1 - this.knobHandle.offset)),
      'height': Math.round(this.width * (1 - this.knobHandle.offset)),
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
        this.knobHandle.value.curr = value;
        this.update();
      },
      'draw': ((vdCtrl: ValueDialController) => function () {
        vdCtrl.knob = window['ctx'] = this;
      })(this)
    });
    this.knobHandle.radius = this.width * this.knob['scale'] / 10;
    this.createCanvases();
    this.drawKnobHandleBg();
    this.drawKnobGauge();
    this.drawKnobHandle();
    this.rotateKnobHandle();
  }

  private update() {
    this._update();
  }

  private _update() {
    if (this.knobHandle.value.prev > this.knobHandle.value.curr) {
      if (this.up && this.value > 0) {
        this.value -= this.knobHandle.dialStep;
        this.up = false;
      } else {
        this.up = true;
        this.down = false;
      }
    } else {
      if (this.knobHandle.value.prev < this.knobHandle.value.curr) {
        if (this.down) {
          this.value += this.knobHandle.dialStep;
          this.down = false;
        } else {
          this.up = false;
          this.down = true;
        }
      }
    }
    this.knobHandle.value.prev = Math.round(this.knobHandle.value.curr);
    this.$scope.$apply(() => {
      this.onChange({$event: {value: this.value}});
    });
    if (this.value > 0) {
      this.rotateKnobHandle();
    }

  }

  private rotateKnobHandle() {
    const currentValue = this.knob['cv'];

    /* if (!this.knobHandle.canvas) {return;}
     const currentValue = this.knob['cv'];
     const coords = this.getKnobCoords(
     this.knob['xy'] + (this.width * this.knobHandle.offset),
     this.knob['arc'](currentValue).e,
     this.knob['radius']);

     this.knobHandle.canvasCtx.clearRect(
     this.knobHandle.x - this.knobHandle.radius,
     this.knobHandle.y - this.knobHandle.radius,
     coords.x + this.knobHandle.radius,
     coords.y + this.knobHandle.radius);

     this.knobHandle.x = coords.x;
     this.knobHandle.y = coords.y;
     this.knobHandle.handleCanvasCtx.rotate(this.knob['arc'](currentValue).e);
     //this.knobHandle.handleCanvasCtx.rotate(currentValue / 2 * Math.PI / 180);
     this.knobHandle.canvasCtx.drawImage(
     this.knobHandle.handleCanvas,
     coords.x - this.knobHandle.radius,
     coords.y - this.knobHandle.radius);*/
    this.knobHandle.canvas.style.transform =
      this.knobHandle.bgCanvas.style.transform = `rotate(${currentValue / 2}deg)`;
  }


  private drawKnobHandleBg() {
    this.knobHandle.bgCanvasCtx.beginPath();
    this.knobHandle.bgCanvasCtx.arc(
      this.knobHandle.canvas.width / 2,
      this.knobHandle.canvas.height / 2,
      this.knob['radius'] - (this.knobHandle.radius / 2),
      0,
      this.knob['PI2'], false);
    this.knobHandle.bgCanvasCtx.fillStyle = '#fff';
    this.knobHandle.bgCanvasCtx.shadowBlur = 80;
    this.knobHandle.bgCanvasCtx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    this.knobHandle.bgCanvasCtx.shadowOffsetX = 5;
    this.knobHandle.bgCanvasCtx.shadowOffsetY = 15;
    this.knobHandle.bgCanvasCtx.fill();
  }

  private drawKnobGauge() {
    const ctx = this.knobHandle.canvasCtx;
    const grd = ctx.createLinearGradient(0, this.knobHandle.canvas.width / 2, this.knobHandle.canvas.width, this.knobHandle.canvas.width / 2);

    grd.addColorStop(0.000, 'rgba(11, 185, 138, 1.000)');
    grd.addColorStop(0.500, 'rgba(184, 182, 206, 1.000)');
    grd.addColorStop(1.000, 'rgba(132, 127, 149, 1.000)');

    this.knobHandle.canvasCtx.beginPath();
    this.knobHandle.canvasCtx.arc(this.knobHandle.canvas.width / 2, this.knobHandle.canvas.height / 2, this.knob['radius'], 0, this.knob['PI2'], false);

    this.knobHandle.canvasCtx.strokeStyle = grd;
    this.knobHandle.canvasCtx.lineWidth = 5;
    this.knobHandle.canvasCtx.stroke();
  }

  private drawKnobHandle(): void {
    this.knobHandle.handleCanvasCtx.beginPath();
    this.knobHandle.handleCanvasCtx.arc(this.knobHandle.radius, this.knobHandle.radius, this.knobHandle.radius, 0, this.knob['PI2'], false);
    this.knobHandle.handleCanvasCtx.fillStyle = this.knobHandle.color.fill;
    this.knobHandle.handleCanvasCtx.shadowBlur = 20;
    this.knobHandle.handleCanvasCtx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    this.knobHandle.handleCanvasCtx.shadowOffsetX = 5;
    this.knobHandle.handleCanvasCtx.shadowOffsetY = 15;
    this.knobHandle.handleCanvasCtx.fill();

    const arrow = ''

    this.knobHandle.handleCanvasCtx.font = '40px Georgia';
    this.knobHandle.handleCanvasCtx.fillStyle = '#4b91c4';
    this.knobHandle.handleCanvasCtx.fillText('<  >', this.knobHandle.radius / 2, this.knobHandle.radius + 18);

    const coords = this.getKnobCoords(
      this.knob['xy'],
      this.knob['arc'](0).e,
      this.knob['radius']);

    this.knobHandle.bgCanvasCtx.drawImage(this.knobHandle.handleCanvas, coords.x, coords.y);
  }

  private createCanvases() {
    this.knobHandle.canvas.width = this.knobHandle.bgCanvas.width = this.width * this.knob['scale'];
    this.knobHandle.canvas.height = this.knobHandle.bgCanvas.height = this.width * this.knob['scale'];
    this.knobHandle.canvas.style.width = this.knobHandle.bgCanvas.style.width = this.width + 'px';
    this.knobHandle.canvas.style.height = this.knobHandle.bgCanvas.style.height = this.width + 'px';
    this.knobHandle.canvas.style.left = this.knobHandle.bgCanvas.style.left = `-${this.width * this.knobHandle.offset / 2}px`;
    this.knobHandle.canvas.style.top = this.knobHandle.bgCanvas.style.top = `-${this.width * this.knobHandle.offset / 2}px`;
    this.knobHandle.canvas.style.position = this.knobHandle.bgCanvas.style.position = 'absolute';
    this.knobHandle.canvas.style.pointerEvents = this.knobHandle.bgCanvas.style.pointerEvents = 'none';

    this.knobHandle.handleCanvas.width = (this.knobHandle.radius + 5) * this.knob['scale'];
    this.knobHandle.handleCanvas.height = (this.knobHandle.radius + 15) * this.knob['scale'];
    this.knobHandle.handleCanvas.style.width = this.knobHandle.radius + 'px';
    this.knobHandle.handleCanvas.style.height = this.knobHandle.radius + 'px';

    $(this.$element).find('.dial-wrapper').append(this.knobHandle.canvas);
    $(this.$element).find('.dial-wrapper').append(this.knobHandle.bgCanvas);
  }


  private setKnob(): void {
    const canvas = document.createElement('canvas');
    const bgCanvas = document.createElement('canvas');
    const gaugeCanvas = document.createElement('canvas');
    const handleCanvas = document.createElement('canvas');
    this.knobHandle = {
      x: 0,
      y: 0,
      canvas: canvas,
      canvasCtx: canvas.getContext('2d'),
      bgCanvas: bgCanvas,
      bgCanvasCtx: bgCanvas.getContext('2d'),
      gaugeCanvas: bgCanvas,
      gaugeCanvasCtx: bgCanvas.getContext('2d'),
      handleCanvas: handleCanvas,
      handleCanvasCtx: handleCanvas.getContext('2d'),
      radius: this.width * 0.25,
      offset: 0.25,
      lineWidth: 3,
      color: {
        fill: '#fff',
        stroke: '#bbb',
        arrow: '#ffffff'
      },
      dialStep: this.dialStep || Number(this.max) * 0.001,
      value: {
        prev: 0,
        curr: 0,
        acc: 0
      }
    };
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

  private getKnobCoords(center: number, endAngle: number, radius: number) {
    return {
      x: Math.round(center + Math.cos(endAngle) * radius) + 5,
      y: Math.round(center + Math.sin(endAngle) * radius) + 15
    };
  }
}

export default ValueDialController;
