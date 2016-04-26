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

      //Feed
      $scope.collection = {};
      $scope.loadNewsCollection = function(){
        NewsCollection.resource($rootScope.user.cmsAuthkey).get({
            userid: $rootScope.user.cmsId,
            id: $routeParams.collectionid
          },
          function(collection) {
            $scope.collection = collection;
          });
      };

      $scope.loadNewsCollection();

      //News
      $scope.newsItem = {};
      $scope.loadNewsItem = function () {
        News.resource($rootScope.user.cmsAuthkey).get({
          userid: $rootScope.user.cmsId,
          collectionid: $routeParams.collectionid,
          id: $routeParams.newsid
        }, function (newsI) {
          $scope.newsItem = newsI;

          if(typeof($scope.newsItem.begin) == "undefined" || $scope.newsItem.begin == null) {
            $scope.newsItem.begin = "";
          }

          if(typeof($scope.newsItem.end) == "undefined" || $scope.newsItem.end == null) {
            $scope.newsItem.end = "";
          }

          $scope.newsItem.beginText = moment($scope.newsItem.begin).format("L LT");
          $scope.newsItem.endText = moment($scope.newsItem.end).format("L LT");

          if($scope.newsItem.picture != null) {
            $scope.newsItem.picture['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + $scope.newsItem.picture.id + '/raw?size=medium';
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
