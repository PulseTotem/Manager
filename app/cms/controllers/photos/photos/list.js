'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:PhotosListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.PhotosListCtrl', ['$rootScope', '$scope', '$routeParams', 'CONSTANTS', 'PhotosCollection', 'Photo', function($rootScope, $scope, $routeParams, CONSTANTS, PhotosCollection, Photo){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    if(typeof($routeParams.collectionid) == "undefined") {
      $rootScope.goTo('/cms');
    } else {
      //Album
      $scope.collection = {};
      $scope.loadPhotosCollection = function(){
        PhotosCollection.resource($rootScope.user.cmsAuthkey).get({
          userid: $rootScope.user.cmsId,
          id: $routeParams.collectionid
          }, function(collection) {
          $scope.collection = collection;
        });
      };

      $scope.loadPhotosCollection();

      //Photos
      $scope.photos = [];
      $scope.loadPhotos = function () {
        Photo.resource($rootScope.user.cmsAuthkey).query({
          userid: $rootScope.user.cmsId,
          collectionid: $routeParams.collectionid
        }, function (photos) {
          $scope.photos = photos;
          $scope.photos.forEach(function(photo) {
              photo['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + photo.id + '/raw';
          });
        });
      };

      $scope.loadPhotos();
    }

  }]);

