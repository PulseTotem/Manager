'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Videos.controller:AddEditVideosCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Videos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Videos.AddEditVideosCtrl', ['$rootScope', '$scope', '$routeParams', 'VideosCollection', 'Video', 'CONSTANTS', 'Upload', '$timeout', '$mdDialog', function($rootScope, $scope, $routeParams, VideosCollection, Video, CONSTANTS, Upload, $timeout, $mdDialog){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $scope.collectionid = $routeParams.collectionid || null;

    $scope.uploadFiles = function (files) {
      $scope.files = files;
      if (files && files.length) {
        $scope.$parent.actionLoading = "indeterminate";
        if($scope.collectionid == null) {
          var collectionResource = VideosCollection.resource($rootScope.user.cmsAuthkey);
          $scope.newCollection = new collectionResource();
          $scope.newCollection.name = "Album " + moment().format('YYYY-MM-DD HH:mm:ss');
          $scope.newCollection.description = "";
          VideosCollection.resource($rootScope.user.cmsAuthkey).save({userid: $rootScope.user.cmsId}, $scope.newCollection, function (collectionDesc) {
            $scope.collectionid = collectionDesc.id;
            $scope.uploadFiles(files);
          });
        }

        Upload.upload({
          url: CONSTANTS.cmsUrl + CONSTANTS.cmsUsersPath + $rootScope.user.cmsId + '/' + CONSTANTS.cmsVideosCollectionsPath + $scope.collectionid + '/' + CONSTANTS.cmsVideosPath,
          headers: {
            'Authorization': $rootScope.user.cmsAuthkey
          },
          data: {
            files: files
          }
        }).then(function (response) {
          $timeout(function () {
            if(typeof($routeParams.collectionid) != "undefined") {
              $scope.$parent.loadVideos();
            } else {
              $rootScope.goTo('/cms/videos/collections/' + $scope.collectionid);
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
    $scope.deleteVideo = function() {
      if(typeof($scope.collectionid) != "undefined" && $scope.collectionid != null && typeof($scope.currentDisplayVideo) != "undefined" && $scope.currentDisplayVideo != null) {
        $scope.deleteInProgression = "indeterminate";
        Video.resource($rootScope.user.cmsAuthkey).delete(
          {
            userid: $rootScope.user.cmsId,
            collectionid: $scope.collectionid,
            id: $scope.currentDisplayVideo.id
          },
          function(){
            $scope.deleteInProgression = "";
            $mdDialog.hide();
            $scope.currentDisplayIndex = null;
            $scope.currentDisplayVideo = null;
            if($scope.collectionid != null) {
              $scope.loadVideos();
            } else {
              $rootScope.goTo('/cms/videos/collections/');
            }
          }
        );
      } else {
        $scope.closeForm();
        if($scope.collectionid != null) {
          $scope.loadVideos();
        } else {
          $rootScope.goTo('/cms/videos/collections/');
        }
      }
    };

    $scope.closeForm = function() {
      $mdDialog.cancel();
    };

  }]);

