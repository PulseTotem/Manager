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
        templateUrl: '../dashboard/views/main.html',
        controller: 'PulseTotemManagerDashboard.MainCtrl'
      })

      // Routes for CMS
      /*.when('/cms', {
        templateUrl: '../cms/views/main.html',
        controller: 'PulseTotemManagerCMS.MainCtrl'
      })*/
      .when('/cms', {
        redirectTo: '/cms/photos'
      })
      .when('/cms/photos', {
        redirectTo: '/cms/photos/collections'
      })
      .when('/cms/photos/collections', {
        templateUrl: '../cms/views/photos/collections/list.html',
        controller: 'PulseTotemManagerCMS.Photos.CollectionsListCtrl'
      })

      // All other stuff
      .otherwise({
        redirectTo: '/'
      });
  }]);
