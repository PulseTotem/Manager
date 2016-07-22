'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.News.controller:AddEditCollectionsCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.News
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.News.AddEditCollectionsCtrl', ['$rootScope', '$scope', 'NewsCollection', '$mdDialog', '$routeParams', 'manageCurrentState', function($rootScope, $scope, NewsCollection, $mdDialog, $routeParams, manageCurrentState){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    var afterUpdateTeam = function() {

      //Add
      $scope.addInProgression = "";

      $scope.newCollection = {};
      $scope.initNewCollection = function () {
        var collectionResource = NewsCollection.resource($rootScope.user.cmsAuthkey);
        $scope.newCollection = new collectionResource();
        $scope.newCollection.name = "";
        $scope.newCollection.description = "";
      };
      $scope.initNewCollection();

      $scope.addCollection = function () {
        $scope.addInProgression = "indeterminate";
        NewsCollection.resource($rootScope.user.cmsAuthkey).save({teamid: $rootScope.currentTeam.cmsId}, $scope.newCollection, function (collectionDesc) {
          $scope.addInProgression = "";
          $scope.initNewCollection();
          $mdDialog.hide();
          $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/' + collectionDesc.id);
        });
      };

      //Delete
      $scope.deleteInProgression = "";
      if (typeof($routeParams.collectionid) == "undefined") {
        $scope.collectionid = null;
      } else {
        $scope.collectionid = $routeParams.collectionid;
      }

      $scope.deleteCollection = function () {
        if ($scope.collectionid != null) {
          $scope.deleteInProgression = "indeterminate";
          NewsCollection.resource($rootScope.user.cmsAuthkey).delete(
            {
              teamid: $rootScope.currentTeam.cmsId,
              id: $scope.collectionid
            },
            function () {
              $scope.deleteInProgression = "";
              $mdDialog.hide();
              $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/');
            }
          );
        } else {
          $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/');
        }
      };

      $scope.closeForm = function () {
        $mdDialog.cancel();
      };

    };

    manageCurrentState.updateTeam(afterUpdateTeam);

  }]);

