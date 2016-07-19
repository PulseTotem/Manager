'use strict';

/**
 * @ngdoc function
 * @name PulseTotemCommon.controller:GlobalCtrl
 * @description
 * # MenuCtrl
 * Controller of the PulseTotemCommon
 */
angular.module('PulseTotemCommon')
  .controller('PulseTotemCommon.GlobalCtrl', ['$rootScope', '$location', '$mdSidenav', function ($rootScope, $location, $mdSidenav) {

    //Default values
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $rootScope.toggleLeft = buildToggler('left');
    $rootScope.toggleRight = buildToggler('right');
    /**
     * Build handler to open/close a SideNav;
     */
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle();
      }
    }

    $rootScope.closeSidenavs = function() {
      $mdSidenav('left').close();
      $mdSidenav('right').close();
    };

    $rootScope.goTo = function(newPath) {
      if (!$rootScope.$$phase) {
        $rootScope.$apply(function () {
          $location.path(newPath);
          $rootScope.closeSidenavs();
        });
      } else {
        $location.path(newPath);
        $rootScope.closeSidenavs();
      }
    };

  }]);


