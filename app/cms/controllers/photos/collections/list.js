'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:CollectionsListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.CollectionsListCtrl', ['$rootScope', '$scope', 'PhotosCollection', '$mdDialog', '$mdMedia', function($rootScope, $scope, PhotosCollection, $mdDialog, $mdMedia){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $scope.collections = [];
    $scope.loadPhotosCollections = function(){
      PhotosCollection.resource($rootScope.user.cmsAuthkey).query({userid: $rootScope.user.cmsId}, function(collections) {
        $scope.collections = collections;
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
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.closeForm = function() {
      $mdDialog.cancel();
    };

  }]);

