'use strict';

/**
 * @ngdoc function
 * @name pulsetotemApp.factory:manageCurrentState
 * @description
 * # manageCurrentState Factory
 * Factory of the pulsetotemApp
 */
angular.module('PulseTotemCommon')
  .factory('manageCurrentState', ['$rootScope', '$routeParams', 'backendSocket', 'callbackManager', function ($rootScope, $routeParams, backendSocket, callbackManager) {
    var manageCurrentStateFactory = {};

    manageCurrentStateFactory.updateUser = function(onUpdateCB) {
      if(typeof($routeParams.username) != "undefined") {

        if(typeof($rootScope.currentUser) != "undefined" && $rootScope.currentUser != null && $routeParams.username != $rootScope.currentUser.username) {
          if($routeParams.username == $rootScope.user.username) {
            $rootScope.currentUser = $rootScope.user;
          } else {
            if($rootScope.user.isAdmin) {
              backendSocket.on('AnswerRetrieveUserByUsername', function (response) {
                callbackManager(response, function (user) {
                    $rootScope.currentUser = user;
                    onUpdateCB();
                  },
                  function (fail) {
                    console.error(fail);
                    $rootScope.currentUser = $rootScope.user;
                    $rootScope.goTo('/');
                    return;
                  }
                );
              });

              backendSocket.emit('RetrieveUserByUsername', {'username' : $routeParams.username});
            } else {
              $rootScope.goTo('/');
              return;
            }
          }
        } else {
          onUpdateCB();
        }

      } else {
        $rootScope.currentUser = $rootScope.user;
        onUpdateCB();
      }
    };

    manageCurrentStateFactory.updateTeam = function(onUpdateCB) {
      if(typeof($routeParams.teamname) != "undefined") {
        if($rootScope.currentTeam == null || $routeParams.teamname != $rootScope.currentTeam.teamname) {

          var userInTeam = false;

          $rootScope.user.teams.forEach(function(team) {
            if($routeParams.teamname == team.name) {
              userInTeam = true;
            }
          });

          if(userInTeam || $rootScope.user.isAdmin) {
            backendSocket.on('AnswerRetrieveTeamByName', function (response) {
              callbackManager(response, function (team) {
                  $rootScope.currentTeam = team;
                  onUpdateCB();
                },
                function (fail) {
                  console.error(fail);
                  $rootScope.currentTeam = null;
                  $rootScope.goTo('/');
                  return;
                }
              );
            });

            backendSocket.emit('RetrieveTeamByName', {'name' : $routeParams.teamname});
          } else {
            $rootScope.currentTeam = null;
            $rootScope.goTo('/');
            return;
          }


        } else {
          onUpdateCB();
        }

      } else {
        $rootScope.currentTeam = null;
        $rootScope.goTo('/');
        return;
      }
    };

    return manageCurrentStateFactory;
  }]);
