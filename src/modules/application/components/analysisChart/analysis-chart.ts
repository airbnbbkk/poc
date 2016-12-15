import AnalysisChartController from './analysis-chart.controller';

class AnalysisChartComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: ng.Injectable<ng.IControllerConstructor>;
    public template: string;

    constructor() {
        this.template = require('./analysis-chart.tpl.html');
        this.controller = AnalysisChartController;
        this.bindings = {
            client: '<'
        };
    }
}

export default AnalysisChartComponent;
