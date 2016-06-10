'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.News.controller:AddEditCollectionsCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.News
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.News.AddEditCollectionsCtrl', ['$rootScope', '$scope', 'NewsCollection', '$mdDialog', '$routeParams', function($rootScope, $scope, NewsCollection, $mdDialog, $routeParams){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    //Add
    $scope.addInProgression = "";

    $scope.newCollection = {};
    $scope.initNewCollection = function() {
      var collectionResource = NewsCollection.resource($rootScope.user.cmsAuthkey);
      $scope.newCollection = new collectionResource();
      $scope.newCollection.name = "";
      $scope.newCollection.description = "";
    };
    $scope.initNewCollection();

    $scope.addCollection = function() {
      $scope.addInProgression = "indeterminate";
      NewsCollection.resource($rootScope.user.cmsAuthkey).save({userid: $rootScope.user.cmsId}, $scope.newCollection, function (collectionDesc) {
        $scope.addInProgression = "";
        $scope.initNewCollection();
        $mdDialog.hide();
        $rootScope.goTo('/cms/news/collections/' + collectionDesc.id);
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
        NewsCollection.resource($rootScope.user.cmsAuthkey).delete(
          {
            userid: $rootScope.user.cmsId,
            id: $scope.collectionid
          },
          function () {
            $scope.deleteInProgression = "";
            $mdDialog.hide();
            $rootScope.goTo('/cms/news/collections/');
          }
        );
      } else {
        $rootScope.goTo('/cms/news/collections/');
      }
    };

    $scope.closeForm = function() {
      $mdDialog.cancel();
    };

  }]);

