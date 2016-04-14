'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.News.controller:NewsListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.News
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.News.NewsListCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'CONSTANTS', 'NewsCollection', 'News', '$mdDialog', '$mdMedia', function($rootScope, $scope, $routeParams, $timeout, CONSTANTS, NewsCollection, News, $mdDialog, $mdMedia){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    if(typeof($routeParams.collectionid) == "undefined") {
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
            if($scope.collectionLoaded && $scope.newsLoaded) {
              $scope.actionLoading = "";
            }
          });
      };

      $scope.loadNewsCollection();

      $scope.updateFeedInfosFeedback = "";
      $scope.newFeedInfosTimeout = null;
      $scope.updateFeedInfos = function() {
        if($scope.newFeedInfosTimeout != null) {
          $timeout.cancel($scope.newFeedInfosTimeout);
        };
        $scope.newFeedInfosTimeout = $timeout(function() {
          $scope.newFeedInfosTimeout = null;
          $scope.updateFeedInfosFeedback = "indeterminate";
          var collectionResource = NewsCollection.resource($rootScope.user.cmsAuthkey);
          $scope.newCollection = new collectionResource();
          $scope.newCollection.name = $scope.collection.name;
          $scope.newCollection.description = $scope.collection.description;
          NewsCollection.resource($rootScope.user.cmsAuthkey).update(
            {
              userid: $rootScope.user.cmsId,
              id: $scope.collection.id
            },
            $scope.newCollection,
            function (collectionDesc) {
              $scope.updateFeedInfosFeedback = "";
              $scope.collection = collectionDesc;
            }
          );
        }, 1000);
      };

      $scope.showDeleteConfirmationForm = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: 'PulseTotemManagerCMS.News.AddEditCollectionsCtrl',
          templateUrl: 'cms/views/news/collections/delete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
      };

      //TODO !!!

      //News
      $scope.news = [];
      $scope.newsLoaded = false;
      $scope.loadNews = function () {
        News.resource($rootScope.user.cmsAuthkey).query({
          userid: $rootScope.user.cmsId,
          collectionid: $routeParams.collectionid
        }, function (news) {
          $scope.news = news;
          $scope.newsLoaded = true;
          if($scope.collectionLoaded && $scope.newsLoaded) {
            $scope.actionLoading = "";
          }
          $scope.news.forEach(function(news) {
            news['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsNewsPath + news.id + '/raw';
            if(news.thumbnail == null) {
              news.thumbnail = {};
            }
            news.thumbnail['path'] = '/images/cms/photos/empty.png';
            if(typeof(news.thumbnail.id) != "undefined") {
              news.thumbnail['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + news.thumbnail.id + '/raw?size=medium';
            }
          });
        });
      };

      $scope.loadNews();

      $scope.currentDisplayIndex = null;
      $scope.currentDisplayNews = null;

      $scope.showNews = function(ev, indexInNews) {
        $scope.currentDisplayIndex = indexInNews;

        $scope.buildDefinition();

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          scope: $scope,
          preserveScope: true,
          templateUrl: 'cms/views/news/news/show.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: true
        });
      };

      $scope.buildDefinition = function() {
        if($scope.currentDisplayNews != null) {
          $scope.currentDisplayNews['definition'] = null;
        }
        var selectedNews = $scope.news[$scope.currentDisplayIndex];
        selectedNews['definition'] = null;
        var newspath = selectedNews['path'];
        selectedNews['definition'] = {
          sources: [
            {
              src: newspath,
              type: selectedNews.mimetype
            }
          ]
        };
        $scope.currentDisplayNews = selectedNews;
      };

      $scope.showPrevNews = function() {
        $scope.currentDisplayIndex = $scope.currentDisplayIndex - 1;
        if($scope.currentDisplayIndex < 0) {
          $scope.currentDisplayIndex = $scope.news.length - 1;
        }
        $scope.buildDefinition();
      };

      $scope.showNextNews = function() {
        $scope.currentDisplayIndex = $scope.currentDisplayIndex + 1;
        if($scope.currentDisplayIndex >= $scope.news.length) {
          $scope.currentDisplayIndex = 0;
        }
        $scope.buildDefinition();
      };

      $scope.updateNewsInfosFeedback = "";
      $scope.newNewsInfosTimeout = null;
      $scope.updateNewsInfos = function() {
        if($scope.newNewsInfosTimeout != null) {
          $timeout.cancel($scope.newNewsInfosTimeout);
        };
        if($scope.currentDisplayNews != null) {
          $scope.newNewsInfosTimeout = $timeout(function () {
            $scope.newNewsInfosTimeout = null;
            $scope.updateNewsInfosFeedback = "indeterminate";
            var newsResource = News.resource($rootScope.user.cmsAuthkey);
            $scope.newNews = new newsResource();
            $scope.newNews.name = $scope.currentDisplayNews.name;
            $scope.newNews.description = $scope.currentDisplayNews.description;
            News.resource($rootScope.user.cmsAuthkey).update(
              {
                userid: $rootScope.user.cmsId,
                collectionid: $scope.collection.id,
                id: $scope.currentDisplayNews.id
              },
              $scope.newNews,
              function (newsDesc) {
                newsDesc['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsNewsPath + newsDesc.id + '/raw';
                $scope.currentDisplayNews = newsDesc;
                $scope.news[$scope.currentDisplayIndex] = newsDesc;
                $scope.updateNewsInfosFeedback = "";
              }
            );
          }, 1000);
        }
      };

      $scope.showDeleteNewsConfirmationForm = function(ev) {
        $mdDialog.hide();
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
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

