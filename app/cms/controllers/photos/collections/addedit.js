'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:AddEditCollectionsCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.AddEditCollectionsCtrl', ['$rootScope', '$scope', 'PhotosCollection', '$mdDialog', '$routeParams', function($rootScope, $scope, PhotosCollection, $mdDialog, $routeParams){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    //Add
    $scope.addInProgression = "";

    $scope.newCollection = {};
    $scope.initNewCollection = function() {
      var collectionResource = PhotosCollection.resource($rootScope.user.cmsAuthkey);
      $scope.newCollection = new collectionResource();
      $scope.newCollection.name = "";
      $scope.newCollection.description = "";
    };
    $scope.initNewCollection();

    $scope.addCollection = function() {
      $scope.addInProgression = "indeterminate";
      PhotosCollection.resource($rootScope.user.cmsAuthkey).save({teamid: $rootScope.currentTeam.cmsId}, $scope.newCollection, function (collectionDesc) {
        $scope.addInProgression = "";
        $scope.initNewCollection();
        $mdDialog.hide();
        $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/photos/collections/' + collectionDesc.id);
      });
    };

    //Delete
    $scope.deleteInProgression = "";
    if(typeof($routeParams.collectionid) == "undefined") {
      $scope.collectionid = null;
    } else {
      $scope.collectionid = $routeParams.collectionid;
    }

    $scope.deleteCollection = function() {
      if($scope.collectionid != null) {
        $scope.deleteInProgression = "indeterminate";
        PhotosCollection.resource($rootScope.user.cmsAuthkey).delete(
          {
            teamid: $rootScope.currentTeam.cmsId,
            id: $scope.collectionid
          },
          function () {
            $scope.deleteInProgression = "";
            $mdDialog.hide();
            $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/photos/collections/');
          }
        );
      } else {
        $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/photos/collections/');
      }
    };

    $scope.closeForm = function() {
      $mdDialog.cancel();
    };

  }]);

