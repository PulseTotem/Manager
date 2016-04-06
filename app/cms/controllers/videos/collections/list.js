'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Videos.controller:CollectionsListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Videos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Videos.CollectionsListCtrl', ['$rootScope', '$scope', 'VideosCollection', 'CONSTANTS', '$mdDialog', '$mdMedia', function($rootScope, $scope, VideosCollection, CONSTANTS, $mdDialog, $mdMedia){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $scope.actionLoading = "indeterminate";

    $scope.collections = [];
    $scope.collectionsLoaded = false;
    $scope.loadVideosCollections = function(){
      VideosCollection.resource($rootScope.user.cmsAuthkey).query({userid: $rootScope.user.cmsId}, function(collections) {
        $scope.collections = collections;
        $scope.collections.forEach(function(collection) {
          collection['coverPath'] = '/images/cms/photos/empty.png';
          if(collection.cover != null && collection.cover.thumbnail != null) {
            collection['coverPath'] = CONSTANTS.cmsUrl + CONSTANTS.cmsVideosPath + collection.cover.thumbnail.id + '/raw?size=medium';
          }
        });
        $scope.collectionsLoaded = true;
        $scope.actionLoading = "";
      });
    };

    $scope.loadVideosCollections();

    $scope.showAddForm = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
      $mdDialog.show({
        controller: 'PulseTotemManagerCMS.Videos.AddEditCollectionsCtrl',
        templateUrl: 'cms/views/videos/collections/add.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      });
    };

  }]);

