'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerDashboard.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the PulseTotemManagerDashboard
 */
angular.module('PulseTotemManagerDashboard')
  .controller('PulseTotemManagerDashboard.MainCtrl', ['$rootScope', '$scope', 'Team', function($rootScope, $scope, Team){
    $rootScope.activeMenu = 'dashboard';
    $rootScope.activeNavbar = 'dashboard';

    $scope.teams = [];
    $scope.teamsLoaded = false;
    $scope.loadTeams = function(){
      Team.resource($rootScope.user.cmsAuthkey).query(function(teams) {
        $scope.teams = [];
        teams.forEach(function(team) {
          $scope.teams.push(team);
        });
        $scope.teamsLoaded = true;
      });
    };

    $scope.loadTeams();

  }]);
