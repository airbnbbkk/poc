import ValueDialController from './value-dial.controller';
import './value-dial.scss';

class ValueDialComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: ng.Injectable<ng.IControllerConstructor>;
    public template: string;

    constructor() {
        this.template = require('./value-dial.tpl.html');
        this.controller = ValueDialController;
        this.bindings = {
          client: '<',
            min: '<',
            max: '<',
            width: '@',
            onChange: '&'
        };
    }
}

export default ValueDialComponent;
