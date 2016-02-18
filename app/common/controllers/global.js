'use strict';

/**
 * @ngdoc function
 * @name PulseTotemCommon.controller:GlobalCtrl
 * @description
 * # GlobalCtrl
 * Controller of the PulseTotemCommon
 */
angular.module('PulseTotemCommon')
  .controller('PulseTotemCommon.GlobalCtrl', ['$mdMedia', '$scope', function ($mdMedia, $scope) {
    $scope.$watch(function() { return $mdMedia('max-width: 960px'); }, function(isSmall) {
      $scope.screenIsSmall = isSmall;
    });
    $scope.screenIsSmall = $mdMedia('max-width: 960px');

  }]);
