'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.News.controller:AddEditNewsCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.News
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.News.AddEditNewsCtrl', ['$rootScope', '$scope', '$routeParams', 'NewsCollection', 'News', 'CONSTANTS', 'Upload', '$timeout', '$mdDialog', function($rootScope, $scope, $routeParams, NewsCollection, News, CONSTANTS, Upload, $timeout, $mdDialog){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $scope.collectionid = $routeParams.collectionid || null;

    if(typeof($routeParams.collectionid) == "undefined") {
      $rootScope.goTo('/cms');
    } else {
      $scope.actionLoading = "indeterminate";
      //Feed
      $scope.collection = {};
      $scope.collectionLoaded = false;
      $scope.loadNewsCollection = function () {
        NewsCollection.resource($rootScope.user.cmsAuthkey).get({
            userid: $rootScope.user.cmsId,
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

      var newsResource = News.resource($rootScope.user.cmsAuthkey);
      $scope.newNews = new newsResource();
    }

/*
    $scope.uploadFiles = function (files) {
      $scope.files = files;
      if (files && files.length) {
        $scope.$parent.actionLoading = "indeterminate";
        if($scope.collectionid == null) {
          var collectionResource = NewsCollection.resource($rootScope.user.cmsAuthkey);
          $scope.newCollection = new collectionResource();
          $scope.newCollection.name = "Album " + moment().format('YYYY-MM-DD HH:mm:ss');
          $scope.newCollection.description = "";
          NewsCollection.resource($rootScope.user.cmsAuthkey).save({userid: $rootScope.user.cmsId}, $scope.newCollection, function (collectionDesc) {
            $scope.collectionid = collectionDesc.id;
            $scope.uploadFiles(files);
          });
        }

        Upload.upload({
          url: CONSTANTS.cmsUrl + CONSTANTS.cmsUsersPath + $rootScope.user.cmsId + '/' + CONSTANTS.cmsNewsCollectionsPath + $scope.collectionid + '/' + CONSTANTS.cmsNewsPath,
          headers: {
            'Authorization': $rootScope.user.cmsAuthkey
          },
          data: {
            files: files
          }
        }).then(function (response) {
          $timeout(function () {
            if(typeof($routeParams.collectionid) != "undefined") {
              $scope.$parent.loadNews();
            } else {
              $rootScope.goTo('/cms/news/collections/' + $scope.collectionid);
            }
          });
        }, function (response) {



          //TODO : Display message to User

        }, function (evt) {
        });
      }
    };
*/

    //Delete
    $scope.deleteInProgression = "";
    $scope.deleteNewsItem = function() {
      if(typeof($scope.collectionid) != "undefined" && $scope.collectionid != null && typeof($scope.newsItemId) != "undefined" && $scope.newsItemId != null) {
        $scope.deleteInProgression = "indeterminate";
        News.resource($rootScope.user.cmsAuthkey).delete(
          {
            userid: $rootScope.user.cmsId,
            collectionid: $scope.collectionid,
            id: $scope.newsItemId
          },
          function(){
            $scope.deleteInProgression = "";
            $mdDialog.hide();
            $scope.currentDisplayIndex = null;
            $scope.currentDisplayNews = null;
            if($scope.collectionid != null) {
              $rootScope.goTo('/cms/news/collections/' + $scope.collectionid);
            } else {
              $rootScope.goTo('/cms/news/collections/');
            }
          }
        );
      } else {
        $scope.closeForm();
        if($scope.collectionid != null) {
          $rootScope.goTo('/cms/news/collections/' + $scope.collectionid);
        } else {
          $rootScope.goTo('/cms/news/collections/');
        }
      }
    };

    $scope.closeForm = function() {
      $mdDialog.cancel();
    };

  }]);

