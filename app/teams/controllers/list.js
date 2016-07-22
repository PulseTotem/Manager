'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerTeams.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the PulseTotemManagerTeams
 */
angular.module('PulseTotemManagerTeams')
  .controller('PulseTotemManagerTeams.ListCtrl', ['$rootScope', '$scope', 'manageCurrentState', function($rootScope, $scope, manageCurrentState){
    $rootScope.activeMenu = 'teams';
    $rootScope.activeNavbar = '';

    var nothing = function() {
      //Nothing to do
    };

    manageCurrentState.updateUser(nothing);

    $scope.setCurrentTeam = function(team) {
      $rootScope.goTo('/teams/' + team.name);
    }

  }]);

