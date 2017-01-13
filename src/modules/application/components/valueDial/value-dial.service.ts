export default class ValueDialService {
  public static $inject: Array<string> = ['$scope'];

  constructor(
    private $scope: ng.IScope
  ) {
  }

  public createDial(el: JQuery, knobHandle: IKnobHandle, width: number, min: number, max: number, dialValue: number) {
    let prevValue = 0;

    el.find('.dial').knob({
      'min': min,
      'max': 500,
      'width': width * (1 - knobHandle.offset),
      'height': width * (1 - knobHandle.offset),
      'cursor': '0',
      'displayInput': false,
      'stopper': false,
      'thickness': 0.05,
      'fgColor': 'rgba(0, 0, 0, 0)',
      'inputColor': '#343434',
      'bgColor': 'rgba(0, 0, 0, 0)',
      'release': (v) => {
        // console.log('release', v);
      },
      'change': (value: number) => {
        if (prevValue > value) {
          // dial up
          dialValue -= knobHandle.dialStep;
        } else {
          // dial down
          if (prevValue < value) {
            dialValue += knobHandle.dialStep;
          }
        }
        prevValue = value;
        this.$scope.$apply(() => {
          this.onChange({$event: {value: this.value}});
        });
      },
      'draw': ((vdCtrl: ValueDialController) => function () {
        vdCtrl.knob = window['ctx'] = this;
        vdCtrl.knob['handle'] = knobHandle
        vdCtrl.reDrawKnobHandle();
      })(this)
    });
    this.knobHandle.radius = this.width * this.knob['scale'] / 10;
    this.createKnobHandleCanvas();
    this.reDrawKnobHandle();
  }

  private reDrawKnobHandle() {
    if (!this.knobHandle.canvas) {return;}
    this.knobHandle.canvas.getContext('2d').clearRect(0, 0, this.knobHandle.canvas.width, this.knobHandle.canvas.height);
    this.drawKnobHandleBg();
    this.drawKnobHandle();
  }

  private drawKnobHandleBg() {
    const grad = this.knobHandle.canvasCtx.createLinearGradient(0, 0, 300, 0);
    grad.addColorStop(0, '#dfd6ef');
    grad.addColorStop(1, '#78bab0');
    this.knobHandle.canvasCtx.beginPath();
    this.knobHandle.canvasCtx.arc(this.knobHandle.canvas.width / 2, this.knobHandle.canvas.height / 2, this.knob['radius'] - (this.width * this.knobHandle.offset / 2), 0, this.knob['PI2'], false);
    this.knobHandle.canvasCtx.fillStyle = '#fff';
    this.knobHandle.canvasCtx.shadowBlur = 80;
    this.knobHandle.canvasCtx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    this.knobHandle.canvasCtx.shadowOffsetX = 5;
    this.knobHandle.canvasCtx.shadowOffsetY = 15;
    this.knobHandle.canvasCtx.fill();

    this.knobHandle.canvasCtx.beginPath();
    this.knobHandle.canvasCtx.arc(this.knobHandle.canvas.width / 2, this.knobHandle.canvas.height / 2, this.knob['radius'], 0, this.knob['PI2'], false);

    this.knobHandle.canvasCtx.strokeStyle = grad;
    this.knobHandle.canvasCtx.lineWidth = 5;
    this.knobHandle.canvasCtx.stroke();
  }

  private drawKnobHandle(): void {
    const currentValue = this.knob['cv'];
    const coords = this.getKnobCoords(this.knob['xy'] + (this.width * this.knobHandle.offset),
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
  }

  private createKnobHandleCanvas() {
    this.knobHandle.canvas.width = this.width * this.knob['scale'];
    this.knobHandle.canvas.height = this.width * this.knob['scale'];
    this.knobHandle.canvas.style.width = this.width + 'px';
    this.knobHandle.canvas.style.height = this.width + 'px';
    this.knobHandle.canvas.style.left = `-${this.width * this.knobHandle.offset / 2}px`;
    this.knobHandle.canvas.style.top = `-${this.width * this.knobHandle.offset / 2}px`;
    this.knobHandle.canvas.style.position = 'absolute';
    this.knobHandle.canvas.style.pointerEvents = 'none';
    $(this.$element).find('.dial-wrapper').append(this.knobHandle.canvas);
  }


  private setKnob(): void {
    const canvas = document.createElement('canvas');
    this.knobHandle = {
      canvas: canvas,
      canvasCtx: canvas.getContext('2d'),
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
