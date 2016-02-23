'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:AddEditPhotosCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.AddEditPhotosCtrl', ['$rootScope', '$scope', '$routeParams', 'PhotosCollection', 'CONSTANTS', 'Upload', '$timeout', function($rootScope, $scope, $routeParams, PhotosCollection, CONSTANTS, Upload, $timeout){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $scope.collectionid = $routeParams.collectionid || null;

    $scope.uploadFiles = function (files) {
      $scope.files = files;
      if (files && files.length) {
        if($scope.collectionid == null) {
          var collectionResource = PhotosCollection.resource($rootScope.user.cmsAuthkey);
          $scope.newCollection = new collectionResource();
          $scope.newCollection.name = "Album " + moment().format('YYYY-MM-DD HH:mm:ss');
          $scope.newCollection.description = "";
          PhotosCollection.resource($rootScope.user.cmsAuthkey).save({userid: $rootScope.user.cmsId}, $scope.newCollection, function (collectionDesc) {
            $scope.collectionid = collectionDesc.id;
            $scope.uploadFiles(files);
          });
        }

        Upload.upload({
          url: CONSTANTS.cmsUrl + CONSTANTS.cmsUsersPath + $rootScope.user.cmsId + '/' + CONSTANTS.cmsPhotosCollectionsPath + $scope.collectionid + '/' + CONSTANTS.cmsPhotosPath,
          headers: {
            'Authorization': $rootScope.user.cmsAuthkey
          },
          data: {
            files: files
          }
        }).then(function (response) {
          $timeout(function () {
            if(typeof($routeParams.collectionid) != "undefined") {
              $scope.$parent.loadPhotos();
            } else {
              $rootScope.goTo('/cms/photos/collections/' + $scope.collectionid);
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

  }]);

