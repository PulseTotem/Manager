'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:PhotosListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.PhotosListCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'CONSTANTS', 'PhotosCollection', 'Photo', '$mdDialog', '$mdMedia', function($rootScope, $scope, $routeParams, $timeout, CONSTANTS, PhotosCollection, Photo, $mdDialog, $mdMedia){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    if(typeof($routeParams.collectionid) == "undefined") {
      $rootScope.goTo('/cms');
    } else {
      $scope.actionLoading = "indeterminate";
      //Album
      $scope.collection = {};
      $scope.collectionLoaded = false;
      $scope.loadPhotosCollection = function(){
        PhotosCollection.resource($rootScope.user.cmsAuthkey).get({
          userid: $rootScope.user.cmsId,
          id: $routeParams.collectionid
          },
          function(collection) {
            $scope.collection = collection;
            $scope.collectionLoaded = true;
            if($scope.collectionLoaded && $scope.photosLoaded) {
              $scope.actionLoading = "";
            }
          });
      };

      $scope.loadPhotosCollection();

      $scope.updateAlbumInfosFeedback = "";
      $scope.newAlbumInfosTimeout = null;
      $scope.updateAlbumInfos = function() {
        if($scope.newAlbumInfosTimeout != null) {
          $timeout.cancel($scope.newAlbumInfosTimeout);
        };
        $scope.newAlbumInfosTimeout = $timeout(function() {
          $scope.newAlbumInfosTimeout = null;
          $scope.updateAlbumInfosFeedback = "indeterminate";
          var collectionResource = PhotosCollection.resource($rootScope.user.cmsAuthkey);
          $scope.newCollection = new collectionResource();
          $scope.newCollection.name = $scope.collection.name;
          $scope.newCollection.description = $scope.collection.description;
          PhotosCollection.resource($rootScope.user.cmsAuthkey).update(
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
          controller: 'PulseTotemManagerCMS.Photos.AddEditCollectionsCtrl',
          templateUrl: 'cms/views/photos/collections/delete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
      };

      //Photos
      $scope.photos = [];
      $scope.photosLoaded = false;
      $scope.loadPhotos = function () {
        Photo.resource($rootScope.user.cmsAuthkey).query({
          userid: $rootScope.user.cmsId,
          collectionid: $routeParams.collectionid
        }, function (photos) {
          $scope.photos = photos;
          $scope.photosLoaded = true;
          if($scope.collectionLoaded && $scope.photosLoaded) {
            $scope.actionLoading = "";
          }
          $scope.photos.forEach(function(photo) {
            photo['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + photo.id + '/raw?size=medium';
            photo['realsize_path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + photo.id + '/raw';
          });
        });
      };

      $scope.loadPhotos();

      $scope.currentDisplayIndex = null;
      $scope.currentDisplayPhoto = null;

      $scope.showPhoto = function(ev, indexInPhotos) {
        $scope.currentDisplayIndex = indexInPhotos;
        $scope.currentDisplayPhoto = $scope.photos[$scope.currentDisplayIndex];

        var photoImg = new Image();
        photoImg.onload = function() {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
          $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: 'cms/views/photos/photos/show.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
          });
          photoImg = null;
        };
        photoImg.src = $scope.currentDisplayPhoto.path;
      };

      $scope.showPrevPhoto = function() {
        $scope.currentDisplayIndex = $scope.currentDisplayIndex - 1;
        if($scope.currentDisplayIndex < 0) {
          $scope.currentDisplayIndex = $scope.photos.length - 1;
        }
        $scope.currentDisplayPhoto = $scope.photos[$scope.currentDisplayIndex];
      };

      $scope.showNextPhoto = function() {
        $scope.currentDisplayIndex = $scope.currentDisplayIndex + 1;
        if($scope.currentDisplayIndex >= $scope.photos.length) {
          $scope.currentDisplayIndex = 0;
        }
        $scope.currentDisplayPhoto = $scope.photos[$scope.currentDisplayIndex];
      };

      $scope.updatePhotoInfosFeedback = "";
      $scope.newPhotoInfosTimeout = null;
      $scope.updatePhotoInfos = function() {
        if($scope.newPhotoInfosTimeout != null) {
          $timeout.cancel($scope.newPhotoInfosTimeout);
        };
        if($scope.currentDisplayPhoto != null) {
          $scope.newPhotoInfosTimeout = $timeout(function () {
            $scope.newPhotoInfosTimeout = null;
            $scope.updatePhotoInfosFeedback = "indeterminate";
            var photoResource = Photo.resource($rootScope.user.cmsAuthkey);
            $scope.newPhoto = new photoResource();
            $scope.newPhoto.name = $scope.currentDisplayPhoto.name;
            $scope.newPhoto.description = $scope.currentDisplayPhoto.description;
            Photo.resource($rootScope.user.cmsAuthkey).update(
              {
                userid: $rootScope.user.cmsId,
                collectionid: $scope.collection.id,
                id: $scope.currentDisplayPhoto.id
              },
              $scope.newPhoto,
              function (photoDesc) {
                photoDesc['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + photoDesc.id + '/raw?size=medium';
                $scope.currentDisplayPhoto = photoDesc;
                $scope.photos[$scope.currentDisplayIndex] = photoDesc;
                $scope.updatePhotoInfosFeedback = "";
              }
            );
          }, 1000);
        }
      };

      $scope.showDeletePhotoConfirmationForm = function(ev) {
        $mdDialog.hide();
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: 'PulseTotemManagerCMS.Photos.AddEditPhotosCtrl',
          templateUrl: 'cms/views/photos/photos/delete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          scope: $scope,
          preserveScope: true
        });
      };


    }

  }]);

