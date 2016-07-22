'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.News.controller:NewsListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.News
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.News.NewsListCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'CONSTANTS', 'NewsCollection', 'News', '$mdDialog', '$mdMedia', 'manageCurrentState', function($rootScope, $scope, $routeParams, $timeout, CONSTANTS, NewsCollection, News, $mdDialog, $mdMedia, manageCurrentState){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    var afterUpdateTeam = function() {

      if (typeof($routeParams.collectionid) == "undefined") {
        $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms');
      } else {
        $scope.actionLoading = "indeterminate";
        //Feed
        $scope.collection = {};
        $scope.collectionLoaded = false;
        $scope.loadNewsCollection = function () {
          NewsCollection.resource($rootScope.user.cmsAuthkey).get({
              teamid: $rootScope.currentTeam.cmsId,
              id: $routeParams.collectionid
            },
            function (collection) {
              $scope.collection = collection;
              $scope.collectionLoaded = true;
              if ($scope.collectionLoaded && $scope.newsLoaded) {
                $scope.actionLoading = "";
              }
            });
        };

        $scope.loadNewsCollection();

        $scope.updateFeedInfosFeedback = "";
        $scope.newFeedInfosTimeout = null;
        $scope.updateFeedInfos = function () {
          if ($scope.newFeedInfosTimeout != null) {
            $timeout.cancel($scope.newFeedInfosTimeout);
          }
          ;
          $scope.newFeedInfosTimeout = $timeout(function () {
            $scope.newFeedInfosTimeout = null;
            $scope.updateFeedInfosFeedback = "indeterminate";
            var collectionResource = NewsCollection.resource($rootScope.user.cmsAuthkey);
            $scope.newCollection = new collectionResource();
            $scope.newCollection.name = $scope.collection.name;
            $scope.newCollection.description = $scope.collection.description;
            NewsCollection.resource($rootScope.user.cmsAuthkey).update(
              {
                teamid: $rootScope.currentTeam.cmsId,
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

        $scope.showDeleteConfirmationForm = function (ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
          $mdDialog.show({
            controller: 'PulseTotemManagerCMS.News.AddEditCollectionsCtrl',
            templateUrl: 'cms/views/news/collections/delete.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          });
        };

        //News
        $scope.news = [];
        $scope.newsLoaded = false;
        $scope.loadNews = function () {
          News.resource($rootScope.user.cmsAuthkey).query({
            teamid: $rootScope.currentTeam.cmsId,
            collectionid: $routeParams.collectionid
          }, function (news) {
            $scope.news = news;
            $scope.newsLoaded = true;

            $scope.news.forEach(function (newsItem) {
              if (typeof(newsItem.begin) == "undefined" || newsItem.begin == null) {
                newsItem.begin = "";
              }

              if (typeof(newsItem.end) == "undefined" || newsItem.end == null) {
                newsItem.end = "";
              }

              newsItem.beginText = moment(newsItem.begin).format("L LT");
              newsItem.endText = moment(newsItem.end).format("L LT");

              newsItem.translationData = {
                BEGIN: newsItem.beginText,
                END: newsItem.endText
              };
            });

            if ($scope.collectionLoaded && $scope.newsLoaded) {
              $scope.actionLoading = "";
            }
          });
        };

        $scope.loadNews();

        $scope.showDeleteNewsConfirmationForm = function (ev, newsId) {
          $mdDialog.hide();
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
          $scope.newsItemId = newsId;
          $mdDialog.show({
            controller: 'PulseTotemManagerCMS.News.AddEditNewsCtrl',
            templateUrl: 'cms/views/news/news/delete.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            scope: $scope,
            preserveScope: true
          });
        };

        $scope.closeForm = function () {
          $mdDialog.cancel();
        };

      }
    };

    manageCurrentState.updateTeam(afterUpdateTeam);

  }]);

