'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:AddEditPhotosCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.AddEditPhotosCtrl', ['$rootScope', '$scope', '$routeParams', 'PhotosCollection', 'Photo', 'CONSTANTS', 'Upload', '$timeout', '$mdDialog', function($rootScope, $scope, $routeParams, PhotosCollection, Photo, CONSTANTS, Upload, $timeout, $mdDialog){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $scope.collectionid = $routeParams.collectionid || null;

    $scope.uploadFiles = function (files) {
      $scope.files = files;
      if (files && files.length) {
        $scope.$parent.actionLoading = "indeterminate";
        if($scope.collectionid == null) {
          var collectionResource = PhotosCollection.resource($rootScope.user.cmsAuthkey);
          $scope.newCollection = new collectionResource();
          $scope.newCollection.name = "Album " + moment().format('YYYY-MM-DD HH:mm:ss');
          $scope.newCollection.description = "";
          PhotosCollection.resource($rootScope.user.cmsAuthkey).save({teamid: $rootScope.currentTeam.cmsId}, $scope.newCollection, function (collectionDesc) {
            $scope.collectionid = collectionDesc.id;
            $scope.uploadFiles(files);
          });
        }

        Upload.upload({
          url: CONSTANTS.cmsUrl + CONSTANTS.cmsTeamsPath + $rootScope.currentTeam.cmsId + '/' + CONSTANTS.cmsPhotosCollectionsPath + $scope.collectionid + '/' + CONSTANTS.cmsPhotosPath,
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
              $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/photos/collections/' + $scope.collectionid);
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
    $scope.deletePhoto = function() {
      if(typeof($scope.collectionid) != "undefined" && $scope.collectionid != null && typeof($scope.currentDisplayPhoto) != "undefined" && $scope.currentDisplayPhoto != null) {
        $scope.deleteInProgression = "indeterminate";
        Photo.resource($rootScope.user.cmsAuthkey).delete(
          {
            teamid: $rootScope.currentTeam.cmsId,
            collectionid: $scope.collectionid,
            id: $scope.currentDisplayPhoto.id
          },
          function(){
            $scope.deleteInProgression = "";
            $mdDialog.hide();
            $scope.currentDisplayIndex = null;
            $scope.currentDisplayPhoto = null;
            if($scope.collectionid != null) {
              $scope.loadPhotos();
            } else {
              $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/photos/collections/');
            }
          }
        );
      } else {
        $scope.closeForm();
        if($scope.collectionid != null) {
          $scope.loadPhotos();
        } else {
          $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/photos/collections/');
        }
      }
    };

    $scope.closeForm = function() {
      $mdDialog.cancel();
    };

  }]);

