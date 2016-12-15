import * as angular from 'angular';
import ValueDialComponent from './components/valueDial/value-dial';
import ApplicationPageComponent from './components/applicationPage/application-page';
import AnalysisChartComponent from './components/analysisChart/analysis-chart';
import RetirementCalculatorService from './services/retirement-calculator.service';
import ClientService from './services/client.service';
import ChartService from './services/chart.service';

angular.module('app.application', [])
       .component('applicationPage', new ApplicationPageComponent())
       .component('valueDial', new ValueDialComponent())
       .component('analysisChart', new AnalysisChartComponent())
       .service('RetirementCalculator', RetirementCalculatorService)
       .service('ClientService', ClientService)
       .service('ChartService', ChartService);
