'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Videos.controller:VideosListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Videos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Videos.VideosListCtrl', ['$rootScope', '$scope', '$sce', '$routeParams', '$timeout', 'CONSTANTS', 'VideosCollection', 'Video', '$mdDialog', '$mdMedia', function($rootScope, $scope, $sce, $routeParams, $timeout, CONSTANTS, VideosCollection, Video, $mdDialog, $mdMedia){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    if(typeof($routeParams.collectionid) == "undefined") {
      $rootScope.goTo('/cms');
    } else {
      $scope.actionLoading = "indeterminate";
      //Album
      $scope.collection = {};
      $scope.collectionLoaded = false;
      $scope.loadVideosCollection = function(){
        VideosCollection.resource($rootScope.user.cmsAuthkey).get({
          userid: $rootScope.user.cmsId,
          id: $routeParams.collectionid
          },
          function(collection) {
            $scope.collection = collection;
            $scope.collectionLoaded = true;
            if($scope.collectionLoaded && $scope.videosLoaded) {
              $scope.actionLoading = "";
            }
          });
      };

      $scope.loadVideosCollection();

      $scope.updateAlbumInfosFeedback = "";
      $scope.newAlbumInfosTimeout = null;
      $scope.updateAlbumInfos = function() {
        if($scope.newAlbumInfosTimeout != null) {
          $timeout.cancel($scope.newAlbumInfosTimeout);
        };
        $scope.newAlbumInfosTimeout = $timeout(function() {
          $scope.newAlbumInfosTimeout = null;
          $scope.updateAlbumInfosFeedback = "indeterminate";
          var collectionResource = VideosCollection.resource($rootScope.user.cmsAuthkey);
          $scope.newCollection = new collectionResource();
          $scope.newCollection.name = $scope.collection.name;
          $scope.newCollection.description = $scope.collection.description;
          VideosCollection.resource($rootScope.user.cmsAuthkey).update(
            {
              userid: $rootScope.user.cmsId,
              id: $scope.collection.id
            },
            $scope.newCollection,
            function (collectionDesc) {
              $scope.updateAlbumInfosFeedback = "";
              $scope.collection = collectionDesc;
            }
          );
        }, 1000);
      };

      $scope.showDeleteConfirmationForm = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: 'PulseTotemManagerCMS.Videos.AddEditCollectionsCtrl',
          templateUrl: 'cms/views/videos/collections/delete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
      };

      //Videos
      $scope.videos = [];
      $scope.videosLoaded = false;
      $scope.loadVideos = function () {
        Video.resource($rootScope.user.cmsAuthkey).query({
          userid: $rootScope.user.cmsId,
          collectionid: $routeParams.collectionid
        }, function (videos) {
          $scope.videos = videos;
          $scope.videosLoaded = true;
          if($scope.collectionLoaded && $scope.videosLoaded) {
            $scope.actionLoading = "";
          }
          $scope.videos.forEach(function(video) {
              video['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsVideosPath + video.id + '/raw';
          });
        });
      };

      $scope.loadVideos();

      $scope.currentDisplayIndex = null;
      $scope.currentDisplayVideo = null;

      $scope.showVideo = function(ev, indexInVideos) {
        $scope.currentDisplayIndex = indexInVideos;
        $scope.currentDisplayVideo = $scope.videos[$scope.currentDisplayIndex];

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          scope: $scope,
          preserveScope: true,
          templateUrl: 'cms/views/videos/videos/show.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: true
        });
      };

      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };

      $scope.showPrevVideo = function() {
        $scope.currentDisplayIndex = $scope.currentDisplayIndex - 1;
        if($scope.currentDisplayIndex < 0) {
          $scope.currentDisplayIndex = $scope.videos.length - 1;
        }
        $scope.currentDisplayVideo = $scope.videos[$scope.currentDisplayIndex];
      };

      $scope.showNextVideo = function() {
        $scope.currentDisplayIndex = $scope.currentDisplayIndex + 1;
        if($scope.currentDisplayIndex >= $scope.videos.length) {
          $scope.currentDisplayIndex = 0;
        }
        $scope.currentDisplayVideo = $scope.videos[$scope.currentDisplayIndex];
      };

      $scope.updateVideoInfosFeedback = "";
      $scope.newVideoInfosTimeout = null;
      $scope.updateVideoInfos = function() {
        if($scope.newVideoInfosTimeout != null) {
          $timeout.cancel($scope.newVideoInfosTimeout);
        };
        if($scope.currentDisplayVideo != null) {
          $scope.newVideoInfosTimeout = $timeout(function () {
            $scope.newVideoInfosTimeout = null;
            $scope.updateVideoInfosFeedback = "indeterminate";
            var videoResource = Video.resource($rootScope.user.cmsAuthkey);
            $scope.newVideo = new videoResource();
            $scope.newVideo.name = $scope.currentDisplayVideo.name;
            $scope.newVideo.description = $scope.currentDisplayVideo.description;
            Video.resource($rootScope.user.cmsAuthkey).update(
              {
                userid: $rootScope.user.cmsId,
                collectionid: $scope.collection.id,
                id: $scope.currentDisplayVideo.id
              },
              $scope.newVideo,
              function (videoDesc) {
                videoDesc['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsVideosPath + videoDesc.id + '/raw';
                $scope.currentDisplayVideo = videoDesc;
                $scope.videos[$scope.currentDisplayIndex] = videoDesc;
                $scope.updateVideoInfosFeedback = "";
              }
            );
          }, 1000);
        }
      };

      $scope.showDeleteVideoConfirmationForm = function(ev) {
        $mdDialog.hide();
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: 'PulseTotemManagerCMS.Videos.AddEditVideosCtrl',
          templateUrl: 'cms/views/videos/videos/delete.html',
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

