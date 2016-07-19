'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.News.controller:CollectionsListCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.News
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.News.CollectionsListCtrl', ['$rootScope', '$scope', 'NewsCollection', 'CONSTANTS', '$mdDialog', '$mdMedia', 'manageCurrentState', function($rootScope, $scope, NewsCollection, CONSTANTS, $mdDialog, $mdMedia, manageCurrentState){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    var afterUpdateTeam = function() {
      $scope.actionLoading = "indeterminate";

      $scope.collections = [];
      $scope.collectionsLoaded = false;
      $scope.loadNewsCollections = function () {
        NewsCollection.resource($rootScope.user.cmsAuthkey).query({teamid: $rootScope.currentTeam.cmsId}, function (collections) {
          $scope.collections = collections;
          $scope.collectionsLoaded = true;
          $scope.actionLoading = "";
        });
      };

      $scope.loadNewsCollections();

      $scope.showAddForm = function (ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: 'PulseTotemManagerCMS.News.AddEditCollectionsCtrl',
          templateUrl: 'cms/views/news/collections/add.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        });
      };
    };

    manageCurrentState.updateTeam(afterUpdateTeam);

  }]);

