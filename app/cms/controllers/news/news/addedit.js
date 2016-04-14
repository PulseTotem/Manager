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

          /*if (response.status > 0) {
            $scope.errorMsg = response.status + ': ' + response.data;
          }*/

          //TODO : Display message to User

        }, function (evt) {
          /*$scope.progress =
            Math.min(100, parseInt(100.0 * evt.loaded / evt.total));*/
          //Nothing to do ?
        });
      }
    };


    //Delete
    $scope.deleteInProgression = "";
    $scope.deleteNews = function() {
      if(typeof($scope.collectionid) != "undefined" && $scope.collectionid != null && typeof($scope.currentDisplayNews) != "undefined" && $scope.currentDisplayNews != null) {
        $scope.deleteInProgression = "indeterminate";
        News.resource($rootScope.user.cmsAuthkey).delete(
          {
            userid: $rootScope.user.cmsId,
            collectionid: $scope.collectionid,
            id: $scope.currentDisplayNews.id
          },
          function(){
            $scope.deleteInProgression = "";
            $mdDialog.hide();
            $scope.currentDisplayIndex = null;
            $scope.currentDisplayNews = null;
            if($scope.collectionid != null) {
              $scope.loadNews();
            } else {
              $rootScope.goTo('/cms/news/collections/');
            }
          }
        );
      } else {
        $scope.closeForm();
        if($scope.collectionid != null) {
          $scope.loadNews();
        } else {
          $rootScope.goTo('/cms/news/collections/');
        }
      }
    };

    $scope.closeForm = function() {
      $mdDialog.cancel();
    };

  }]);

