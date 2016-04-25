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
            if ($scope.collectionLoaded && $scope.newNewsLoaded) {
              $scope.actionLoading = "";
            }
          });
      };

      $scope.loadNewsCollection();

      if(typeof($routeParams.newsid) == "undefined") {
        $scope.newNewsLoaded = true;
        var newsResource = News.resource($rootScope.user.cmsAuthkey);
        $scope.newNews = new newsResource();

        $scope.newNews.begin = "";
        $scope.newNews.end = "";
        $scope.newNews.formerPicture = null;
        $scope.newNews.picture = {};
        $scope.newNews.picture.path = '/images/cms/photos/empty.png';
      } else {
        //News
        $scope.newNews = {};
        $scope.newNewsLoaded = false;
        $scope.loadNewsItem = function () {
          News.resource($rootScope.user.cmsAuthkey).get({
            userid: $rootScope.user.cmsId,
            collectionid: $routeParams.collectionid,
            id: $routeParams.newsid
          }, function (newsI) {
            $scope.newNews = newsI;
            $scope.newNewsLoaded = true;

            if(typeof($scope.newNews.begin) == "undefined" || $scope.newNews.begin == null) {
              $scope.newNews.begin = "";
            }

            if(typeof($scope.newNews.end) == "undefined" || $scope.newNews.end == null) {
              $scope.newNews.end = "";
            }

            if($scope.newNews.picture == null) {
              $scope.newNews.formerPicture = null;
              $scope.newNews.picture = {};
              $scope.newNews.picture.path = '/images/cms/photos/empty.png';
            } else {
              $scope.newNews.formerPicture = $scope.newNews.picture;
              $scope.newNews.picture['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + $scope.newNews.picture.id + '/raw?size=medium';
            }

            if($scope.collectionLoaded && $scope.newNewsLoaded) {
              $scope.actionLoading = "";
            }
          });
        };

        $scope.loadNewsItem();
      }


      $scope.newNews.beginText = "";
      $scope.$watch(
        function() {
          return $scope.newNews.begin;
        },
        function(newValue, oldValue, scope) {
          $scope.newNews.begin = newValue;
          $scope.newNews.beginText = moment($scope.newNews.begin).format("L LT");
        }
      );

      $scope.newNews.endText = "";
      $scope.$watch(
        function() {
          return $scope.newNews.end;
        },
        function(newValue, oldValue, scope) {
          $scope.newNews.end = newValue;
          $scope.newNews.endText = moment($scope.newNews.end).format("L LT");
        }
      );

      $scope.saveNews = function() {
        if(typeof($routeParams.newsid) == "undefined") {
          News.resource($rootScope.user.cmsAuthkey).save({
            userid: $rootScope.user.cmsId,
            collectionid: $scope.collectionid
          }, $scope.newNews, function (newsDesc) {
            $rootScope.goTo('/cms/news/collections/' + $scope.collectionid + '/news/' + newsDesc.id);
          });
        } else {
          News.resource($rootScope.user.cmsAuthkey).update({
            userid: $rootScope.user.cmsId,
            collectionid: $scope.collectionid,
            id: $routeParams.newsid
          }, $scope.newNews, function (newsDesc) {
            $rootScope.goTo('/cms/news/collections/' + $scope.collectionid + '/news/' + newsDesc.id);
          });
        }
      };

      $scope.changeNewsPicture = function(newFile) {
        $scope.newNews.newPicture = newFile;
        console.log(newFile);
        //$scope.newNews.picture['path'] = newFile;
        //TODO
      }

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

