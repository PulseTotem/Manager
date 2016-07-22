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

      // Routes for Users
      .when('/users/:username', {
        redirectTo: '/users/:username/teams'
      })

      // Routes for Teams
      .when('/users/:username/teams', {
        templateUrl: '../teams/views/list.html',
        controller: 'PulseTotemManagerTeams.ListCtrl'
      })
      .when('/teams', {
        templateUrl: '../teams/views/list.html',
        controller: 'PulseTotemManagerTeams.ListCtrl'
      })
      .when('/teams/:teamname', {
        redirectTo: '/teams/:teamname/cms'
      })

      // Routes for Dashboard
      .when('/dashboard', {
        templateUrl: '../dashboard/views/main.html',
        controller: 'PulseTotemManagerDashboard.MainCtrl'
      })

      // Routes for CMS
      .when('/teams/:teamname/cms', {
        redirectTo: '/teams/:teamname/cms/photos'
      })

        // Routes for CMS -> Photos
      .when('/teams/:teamname/cms/photos', {
        redirectTo: '/teams/:teamname/cms/photos/collections'
      })
      .when('/teams/:teamname/cms/photos/collections', {
        templateUrl: '../cms/views/photos/collections/list.html',
        controller: 'PulseTotemManagerCMS.Photos.CollectionsListCtrl'
      })
      .when('/teams/:teamname/cms/photos/collections/:collectionid', {
        templateUrl: '../cms/views/photos/photos/list.html',
        controller: 'PulseTotemManagerCMS.Photos.PhotosListCtrl'
      })

        // Routes for CMS -> Videos
      .when('/teams/:teamname/cms/videos', {
        redirectTo: '/teams/:teamname/cms/videos/collections'
      })
      .when('/teams/:teamname/cms/videos/collections', {
        templateUrl: '../cms/views/videos/collections/list.html',
        controller: 'PulseTotemManagerCMS.Videos.CollectionsListCtrl'
      })
      .when('/teams/:teamname/cms/videos/collections/:collectionid', {
        templateUrl: '../cms/views/videos/videos/list.html',
        controller: 'PulseTotemManagerCMS.Videos.VideosListCtrl'
      })

      // Routes for CMS -> News
      .when('/teams/:teamname/cms/news', {
        redirectTo: '/teams/:teamname/cms/news/collections'
      })
      .when('/teams/:teamname/cms/news/collections', {
        templateUrl: '../cms/views/news/collections/list.html',
        controller: 'PulseTotemManagerCMS.News.CollectionsListCtrl'
      })
      .when('/teams/:teamname/cms/news/collections/:collectionid', {
        templateUrl: '../cms/views/news/news/list.html',
        controller: 'PulseTotemManagerCMS.News.NewsListCtrl'
      })
      .when('/teams/:teamname/cms/news/collections/:collectionid/news/add', {
        templateUrl: '../cms/views/news/news/addEdit.html',
        controller: 'PulseTotemManagerCMS.News.AddEditNewsCtrl'
      })
      .when('/teams/:teamname/cms/news/collections/:collectionid/news/:newsid', {
        templateUrl: '../cms/views/news/news/show.html',
        controller: 'PulseTotemManagerCMS.News.NewsShowCtrl'
      })
      .when('/teams/:teamname/cms/news/collections/:collectionid/news/:newsid/edit', {
        templateUrl: '../cms/views/news/news/addEdit.html',
        controller: 'PulseTotemManagerCMS.News.AddEditNewsCtrl'
      })

      // All other stuff
      .otherwise({
        redirectTo: '/'
      });
  }]);
