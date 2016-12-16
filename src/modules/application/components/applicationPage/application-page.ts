import ApplicationPageController from './application-page.controller';
import './application-page.scss';

export default class ApplicationPageComponent implements ng.IComponentOptions {
  public controller: ng.Injectable<ng.IControllerConstructor>;
  public template: string;

  constructor() {
    this.template = require('./application-page.tpl.html');
    this.controller = ApplicationPageController;
  }
}
