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

        // Routes for CMS -> Photos
      .when('/cms/photos', {
        redirectTo: '/cms/photos/collections'
      })
      .when('/cms/photos/collections', {
        templateUrl: '../cms/views/photos/collections/list.html',
        controller: 'PulseTotemManagerCMS.Photos.CollectionsListCtrl'
      })
      .when('/cms/photos/collections/:collectionid', {
        templateUrl: '../cms/views/photos/photos/list.html',
        controller: 'PulseTotemManagerCMS.Photos.PhotosListCtrl'
      })

        // Routes for CMS -> Videos
      .when('/cms/videos', {
        redirectTo: '/cms/videos/collections'
      })
      .when('/cms/videos/collections', {
        templateUrl: '../cms/views/videos/collections/list.html',
        controller: 'PulseTotemManagerCMS.Videos.CollectionsListCtrl'
      })
      .when('/cms/videos/collections/:collectionid', {
        templateUrl: '../cms/views/videos/videos/list.html',
        controller: 'PulseTotemManagerCMS.Videos.VideosListCtrl'
      })

      // All other stuff
      .otherwise({
        redirectTo: '/'
      });
  }]);
