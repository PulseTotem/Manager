'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.News.controller:NewsShowCtrl
 * @description
 * # NewsShowCtrl
 * Controller of the PulseTotemManagerCMS.News
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.News.NewsShowCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'CONSTANTS', 'NewsCollection', 'News', '$mdDialog', '$mdMedia', function($rootScope, $scope, $routeParams, $timeout, CONSTANTS, NewsCollection, News, $mdDialog, $mdMedia){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    if(typeof($routeParams.collectionid) == "undefined" || typeof($routeParams.newsid) == "undefined") {
      $rootScope.goTo('/cms');
    } else {
      $scope.actionLoading = "indeterminate";

      //Feed
      $scope.collection = {};
      $scope.collectionLoaded = false;
      $scope.loadNewsCollection = function(){
        NewsCollection.resource($rootScope.user.cmsAuthkey).get({
            userid: $rootScope.user.cmsId,
            id: $routeParams.collectionid
          },
          function(collection) {
            $scope.collection = collection;
            $scope.collectionLoaded = true;
            if($scope.collectionLoaded && $scope.newsItemLoaded) {
              $scope.actionLoading = "";
            }
          });
      };

      $scope.loadNewsCollection();

      //News
      $scope.newsItem = {};
      $scope.newsItemLoaded = false;
      $scope.loadNewsItem = function () {
        News.resource($rootScope.user.cmsAuthkey).get({
          userid: $rootScope.user.cmsId,
          collectionid: $routeParams.collectionid,
          id: $routeParams.newsid
        }, function (newsI) {
          $scope.newsItem = newsI;
          $scope.newsItemLoaded = true;
          if($scope.collectionLoaded && $scope.newsItemLoaded) {
            $scope.actionLoading = "";
          }
        });
      };

      $scope.loadNewsItem();

      $scope.showDeleteNewsConfirmationForm = function(ev) {
        $mdDialog.hide();
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $scope.newsItemId = $scope.newsItem.id;
        $mdDialog.show({
          controller: 'PulseTotemManagerCMS.News.AddEditNewsCtrl',
          templateUrl: 'cms/views/news/news/delete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          scope: $scope,
          preserveScope: true
        });
      };

      $scope.closeForm = function() {
        $mdDialog.cancel();
      };
    }

  }]);
