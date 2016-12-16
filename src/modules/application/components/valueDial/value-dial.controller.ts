import * as $ from 'jquery';
class ValueDialController implements ng.IController {

  public static $inject: Array<string> = ['$scope', '$element'];
  // bindings
  public min: number;
  public max: number;
  public client: number;
  public width: number;
  public onChange: (paramObj: {$event: {value: number}}) => void;

  public model: {
    dialValue: number;
  };

  private dialEl: JQuery;
  private dialInst: JQuery;
  private knob: IKnob;
  private circleAngle = 2 * Math.PI;

  private knobCanvas = document.createElement('canvas');

  constructor(
    private $scope: ng.IScope,
    private $element: ng.IAugmentedJQuery
  ) {
  }

  $onInit() {
    this.width = Number(this.width);
    this.dialEl = $(this.$element).find('.dial');
    this.setKnob();
    this.$scope.$on('test', (event: ng.IAngularEvent, value: any) => {
      this.onChange({$event: {value: value}});
    })
  }

  $onChanges(obj) {
    console.log('change', obj);
  }

  $postLink() {
    this.setKnobCanvas();
    this.dialInst = this.dialEl.knob({
      'min': this.min,
      'max': this.max,
      'width': this.width * (1 - this.knob.offset),
      'height': this.width * (1 - this.knob.offset),
      'thickness': 0.01,
      'release': (v) => {
        // console.log('release', v);
      },
      'change': (value: number) => {
        // console.log(this)
        //this.onChange.call(this.$scope, {$event: {value: value}});
        //this.changeCallback.call(this, value);
        //this.client.onGoingSaving = value;
        this.$scope.$broadcast('test', value);
      },
      'draw': ((vdCtrl: ValueDialController) => function () {
        window['ctx'] = this;
        vdCtrl.drawKnob.call(vdCtrl, this);
      })(this)
    });
  }

  public changeCallback(value) {
    console.log('onchange', this.client);
    this.client = value;
    //this.onChange({$event: {value: this.client.onGoingSaving}});
  }

  private drawKnob(dial: JQuery): void {
    const context = this.knob.canvas.ctx;
    const currentValue = dial['cv'];
    const coords = this.getKnobCoords(dial['xy'], dial['arc'](currentValue).e, dial['radius']);

    // console.log(dial['xy'], dial['arc'](currentValue), dial['radius']);
    // console.log('dialInst', coords.x, coords.y);
    context.clearRect(0, 0, this.knob.canvas.width, this.knob.canvas.width);
    context.beginPath();
    context.arc(coords.x, coords.y, this.knob.radius, 0, this.circleAngle, false);
    context.fillStyle = this.knob.color.fill;
    context.fill();
    context.lineWidth = this.knob.lineWidth;
    context.strokeStyle = this.knob.color.stroke;
    context.stroke();
  }

  private setKnob(): void {
    this.knob = {
      canvas: {
        width: this.width,
        el: this.knobCanvas,
        ctx: this.knobCanvas.getContext('2d'),
        resMultiplier: 2
      },
      radius: this.width * 0.15,
      offset: 0.2,
      lineWidth: 1,
      color: {
        fill: '#000000',
        stroke: '#DFE5EB',
        arrow: '#ffffff'
      }
    };
    this.knob.canvas.width = this.width * this.knob.canvas.resMultiplier;
  }

  private setKnobCanvas(): void {
    this.knobCanvas.width = this.knob.canvas.width;
    this.knobCanvas.height = this.knob.canvas.width;
    this.knobCanvas.style.width = `${this.knob.canvas.width / 2}px`;
    this.knobCanvas.style.height = `${this.knob.canvas.width / 2}px`;
    this.knobCanvas.style.left = '0';
    this.knobCanvas.style.top = '0';
    this.knobCanvas.style.position = 'absolute';
    this.knobCanvas.style.pointerEvents = 'none';
    $(this.$element).find('[value-dial]').append(this.knobCanvas);
  }

  private getKnobCoords(center: number, endAngle: number, radius: number) {
    return {
      x: center + Math.cos(endAngle) * radius,
      y: center + Math.sin(endAngle) * radius
    };
  }
}

export default ValueDialController;
