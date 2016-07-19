'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerTeams.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the PulseTotemManagerTeams
 */
angular.module('PulseTotemManagerTeams')
  .controller('PulseTotemManagerTeams.ListCtrl', ['$rootScope', '$scope', 'manageCurrentUser', function($rootScope, $scope, manageCurrentUser){
    $rootScope.activeMenu = 'teams';
    $rootScope.activeNavbar = '';

    var nothing = function() {
      //Nothing to do
    };

    manageCurrentUser.update(nothing);

    $scope.setCurrentTeam = function(team) {
      $rootScope.currentTeam = team;
      $rootScope.goTo('/teams/' + team.name);
    }

  }]);

