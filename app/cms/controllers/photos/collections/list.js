'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:CollectionsListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.CollectionsListCtrl', ['$rootScope', '$scope', 'PhotosCollection', 'CONSTANTS', '$mdDialog', '$mdMedia', function($rootScope, $scope, PhotosCollection, CONSTANTS, $mdDialog, $mdMedia){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $scope.actionLoading = "indeterminate";

    $scope.collections = [];
    $scope.collectionsLoaded = false;
    $scope.loadPhotosCollections = function(){
      PhotosCollection.resource($rootScope.user.cmsAuthkey).query({userid: $rootScope.user.cmsId}, function(collections) {
        $scope.collections = collections;
        $scope.collections.forEach(function(collection) {
          collection['coverPath'] = '/images/cms/photos/empty.png';
          if(collection.cover != null) {
            collection['coverPath'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + collection.cover.id + '/raw';
          }
        });
        $scope.collectionsLoaded = true;
        $scope.actionLoading = "";
      });
    };

    $scope.loadPhotosCollections();

    $scope.showAddForm = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
      $mdDialog.show({
        controller: 'PulseTotemManagerCMS.Photos.AddEditCollectionsCtrl',
        templateUrl: 'cms/views/photos/collections/add.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      });
    };

  }]);
