'use strict';

/**
 * @ngdoc overview
 * @name pulsetotemManagerApp
 * @description
 * # routes
 *
 * Define routes available in application.
 */
angular
  .module('pulsetotemManagerApp')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      // All other stuff
      .when('/', {
        templateUrl: '../common/views/home.html',
        controller: 'PulseTotemCommon.HomeCtrl',
        reloadOnSearch: false
      })

      // Routes for authentication
      .when('/login', {
        templateUrl: '../common/views/login.html',
        controller: 'PulseTotemCommon.LoginCtrl'
      })

      // Routes for Dashboard
      .when('/dashboard', {
        templateUrl: '../common/views/login.html',
        controller: 'PulseTotemCommon.LoginCtrl'
      })

      // All other stuff
      .otherwise({
        redirectTo: '/'
      });
  }]);
