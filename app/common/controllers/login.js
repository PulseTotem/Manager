'use strict';

/**
 * @ngdoc function
 * @name PulseTotemCommon.PulseTotemCommon:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the PulseTotemCommon
 */
angular.module('PulseTotemCommon')
  .controller('PulseTotemCommon.LoginCtrl', ['$rootScope', '$scope', '$http', '$location', 'CONSTANTS', 'backendSocket', '$cookies', function ($rootScope, $scope, $http, $location, CONSTANTS, backendSocket, $cookies) {

        $scope.user = {
          "remember" : true
        };

        $scope.login = function(user) {
          if (typeof(user.password) != "undefined" && user.password != "") {
            var shaObj = new jsSHA("SHA-256", "TEXT");
            shaObj.update(user.password);
            var encryptedPwd = shaObj.getHash("HEX");

            $http.post(CONSTANTS.backendUrl + CONSTANTS.loginBackendPath, {
              'usernameOrEmail': user.usernameOrEmail,
              'password': encryptedPwd
            })
              .success(function (data, status, headers, config) {
                var successBackendInit = function() {

                  if(user.remember) {
                    $cookies.remove("tmpAuthT6SToken");
                    $cookies.put("authT6SToken", data.token);
                  } else {
                    $cookies.remove("authT6SToken");
                    $cookies.put("tmpAuthT6SToken", data.token);
                  }

                  $rootScope.header = "default";
                  if (!$rootScope.$$phase) {
                    $rootScope.$apply(function () {
                      $location.path(CONSTANTS.afterLoginRoute);
                    });
                  } else {
                    $location.path(CONSTANTS.afterLoginRoute);
                  }
                };

                var failBackendInit = function(errorDesc) {
                  console.error(errorDesc); //TODO: Manage error during post => display error message
                  $cookies.remove("authT6SToken");
                  $cookies.remove("tmpAuthT6SToken");
                  $rootScope.header = "login";
                  if(next.templateUrl != "../common/views/login.html") {
                    if (!$rootScope.$$phase) {
                      $rootScope.$apply(function () {
                        $location.path(CONSTANTS.loginRoute);
                      });
                    } else {
                      $location.path(CONSTANTS.loginRoute);
                    }
                  }
                };

                backendSocket.init(data.token, successBackendInit, failBackendInit);

              })
              .error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.

                //TODO: Manage error during post => display error message
                console.log("fail login during POST");
              });
          } else {
            //TODO: Manage error during post => display error message
            console.log("fail login because empty password");
          }
        };
  }]);
