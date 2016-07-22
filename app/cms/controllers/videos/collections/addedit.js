'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Videos.controller:AddEditCollectionsCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Videos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Videos.AddEditCollectionsCtrl', ['$rootScope', '$scope', 'VideosCollection', '$mdDialog', '$routeParams', function($rootScope, $scope, VideosCollection, $mdDialog, $routeParams){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    //Add
    $scope.addInProgression = "";

    $scope.newCollection = {};
    $scope.initNewCollection = function() {
      var collectionResource = VideosCollection.resource($rootScope.user.cmsAuthkey);
      $scope.newCollection = new collectionResource();
      $scope.newCollection.name = "";
      $scope.newCollection.description = "";
    };
    $scope.initNewCollection();

    $scope.addCollection = function() {
      $scope.addInProgression = "indeterminate";
      VideosCollection.resource($rootScope.user.cmsAuthkey).save({teamid: $rootScope.currentTeam.cmsId}, $scope.newCollection, function (collectionDesc) {
        $scope.addInProgression = "";
        $scope.initNewCollection();
        $mdDialog.hide();
        $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/videos/collections/' + collectionDesc.id);
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
        VideosCollection.resource($rootScope.user.cmsAuthkey).delete(
          {
            teamid: $rootScope.currentTeam.cmsId,
            id: $scope.collectionid
          },
          function () {
            $scope.deleteInProgression = "";
            $mdDialog.hide();
            $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/videos/collections/');
          }
        );
      } else {
        $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/videos/collections/');
      }
    };

    $scope.closeForm = function() {
      $mdDialog.cancel();
    };

  }]);

