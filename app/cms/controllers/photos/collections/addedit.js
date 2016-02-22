'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:AddEditCollectionsCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.AddEditCollectionsCtrl', ['$rootScope', '$scope', 'PhotosCollection', '$mdDialog', function($rootScope, $scope, PhotosCollection, $mdDialog){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

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
      PhotosCollection.resource($rootScope.user.cmsAuthkey).save({userid: $rootScope.user.cmsId}, $scope.newCollection, function (collectionDesc) {
        $scope.addInProgression = "";
        $scope.initNewCollection();
        $mdDialog.hide();
        $rootScope.goTo('/cms/photos/collections/' + collectionDesc.id);
      });
    };

  }]);

