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
      // Routes for authentication
      .when('/', {
        templateUrl: '../common/views/login.html',
        controller: 'PulseTotemCommon.LoginCtrl'
      })

      // Routes for Dashboard
      .when('/dashboard', {
        templateUrl: '../common/views/home.html',
        controller: 'PulseTotemCommon.HomeCtrl'
      })

      // All other stuff
      .otherwise({
        redirectTo: '/'
      });
  }]);
