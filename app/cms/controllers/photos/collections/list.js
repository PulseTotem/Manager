'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.Photos.controller:CollectionsListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.Photos
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.Photos.CollectionsListCtrl', ['$rootScope', '$scope', 'PhotosCollection', function($rootScope, $scope, PhotosCollection){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $scope.collections = [];
    PhotosCollection.resource($rootScope.user.cmsAuthkey).query({userid: $rootScope.user.cmsId}, function(collections) {
      $scope.collections = collections;
    });


  }]);

