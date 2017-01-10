import './modules/application/index';
import * as angular from 'angular';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'angularjs-slider/dist/rzslider.css';
import './styles/screen.scss';
import 'angularjs-slider/dist/rzslider.min';

angular.module('app', ['app.application', 'rzModule']);
angular.bootstrap(document, ['app'], {
  strictDi: true
});
