'use strict';

/**
 * @ngdoc function
 * @name pulsetotemApp.factory:manageCurrentUser
 * @description
 * # manageCurrentUser Factory
 * Factory of the pulsetotemApp
 */
angular.module('PulseTotemCommon')
  .factory('manageCurrentUser', ['$rootScope', '$routeParams', 'backendSocket', 'callbackManager', function ($rootScope, $routeParams, backendSocket, callbackManager) {
    var manageCurrentUserFactory = {};

    manageCurrentUserFactory.update = function(onUpdateCB) {
      if(typeof($routeParams.username) != "undefined") {

        if($routeParams.username != $rootScope.currentUser.username) {
          if($routeParams.username == $rootScope.user) {
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

    return manageCurrentUserFactory;
  }]);
