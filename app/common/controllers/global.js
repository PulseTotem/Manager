'use strict';

/**
 * @ngdoc function
 * @name PulseTotemCommon.controller:GlobalCtrl
 * @description
 * # MenuCtrl
 * Controller of the PulseTotemCommon
 */
angular.module('PulseTotemCommon')
  .controller('PulseTotemCommon.GlobalCtrl', ['$rootScope', '$location', function ($rootScope, $location) {

    //Default values
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    $rootScope.goTo = function(newPath) {
      if (!$rootScope.$$phase) {
        $rootScope.$apply(function () {
          $location.path(newPath);
        });
      } else {
        $location.path(newPath);
      }
    };

  }]);


