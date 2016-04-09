'use strict';

/**
 * @ngdoc overview
 * @name pulsetotemManagerApp
 * @description
 * # pulsetotemManagerApp
 *
 * Main module of the application.
 */
angular
    .module('pulsetotemManagerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ngMessages',
    'pascalprecht.translate',
    'btford.socket-io',
    'ngFileUpload',
    'angular-loading-bar',
    'vjs.video',
    'PulseTotemCommon',
    'PulseTotemManagerDashboard',
    'PulseTotemManagerCMS'
    ])
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }])
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('orange')
        .accentPalette('deep-purple');
      $mdThemingProvider.theme('altTheme')
        .primaryPalette('deep-purple')
        .accentPalette('orange');
    }])
    .run(['$rootScope', '$location', '$cookies', '$http', 'CONSTANTS', 'backendSocket', '$route', function($rootScope, $location, $cookies, $http, CONSTANTS, backendSocket, $route) {

      $rootScope.header = "login";

      $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if(typeof($rootScope.user) != "undefined" && typeof($rootScope.user.id) != "undefined") {
          $rootScope.header = "default";

          if (next.templateUrl === "../common/views/login.html") {
            if (!$rootScope.$$phase) {
              $rootScope.$apply(function () {
                $location.path(CONSTANTS.afterLoginRoute);
              });
            } else {
              $location.path(CONSTANTS.afterLoginRoute);
            }
          }
        }
      });

      $rootScope.$on("$locationChangeStart", function(event, next, current) {

        if(typeof($rootScope.user) == "undefined" || typeof($rootScope.user.id) == "undefined") {

          var adminT6SToken = null;
          var tmpToken = false;
          if($cookies.get("adminT6SToken")) {
            adminT6SToken = $cookies.get("adminT6SToken");
          } else {
            if($cookies.get("tmpAdminT6SToken")) {
              adminT6SToken = $cookies.get("tmpAdminT6SToken");
              tmpToken = true;
            }
          }

          if(adminT6SToken != null) {
            event.preventDefault();

            $http.post(CONSTANTS.backendUrl + CONSTANTS.loginFromTokenBackendPath, {'token' : adminT6SToken, 'tmp' : tmpToken})
              .success(function(data, status, headers, config) {
                var successBackendInit = function() {
                  if(tmpToken) {
                    $cookies.remove("adminT6SToken");
                    $cookies.put("tmpAdminT6SToken", data.token);
                  } else {
                    $cookies.remove("tmpAdminT6SToken");
                    $cookies.put("adminT6SToken", data.token);
                  }

                  $route.reload();
                };

                var failBackendInit = function(errorDesc) {
                  console.error(errorDesc);
                  $cookies.remove("adminT6SToken");
                  $cookies.remove("tmpAdminT6SToken");

                  $rootScope.header = "login";
                  if (!$rootScope.$$phase) {
                    $rootScope.$apply(function () {
                      $location.path(CONSTANTS.loginRoute);
                    });
                  } else {
                    $location.path(CONSTANTS.loginRoute);
                  }
                };

                backendSocket.init(data.token, successBackendInit, failBackendInit);

              })
              .error(function(data, status, headers, config) {
                $cookies.remove("adminT6SToken");
                $cookies.remove("tmpAdminT6SToken");
                $rootScope.header = "login";
                if (!$rootScope.$$phase) {
                  $rootScope.$apply(function () {
                    $location.path(CONSTANTS.loginRoute);
                  });
                } else {
                  $location.path(CONSTANTS.loginRoute);
                }
              });
          } else {
            $rootScope.header = "login";
            if (!$rootScope.$$phase) {
              $rootScope.$apply(function () {
                $location.path(CONSTANTS.loginRoute);
              });
            } else {
              $location.path(CONSTANTS.loginRoute);
            }
          }

        }
      });




      /*$rootScope.header = "home";

      if(typeof($rootScope.currentLogingFromToken) == "undefined" || $rootScope.currentLogingFromToken == null) {
        $rootScope.currentLogingFromToken = false;
      }

      $rootScope.$on("$routeChangeStart", function(event, next, last) {
        if(! $rootScope.currentLogingFromToken) {
          if (typeof($rootScope.user) == "undefined" || typeof($rootScope.user.id) == "undefined") {
            var pulseTotemToken = null;
            var tmpToken = false;
            if ($cookies.pulseTotemToken) {
              pulseTotemToken = $cookies.pulseTotemToken;
            } else {
              if ($cookies.tmpPulseTotemToken) {
                pulseTotemToken = $cookies.tmpPulseTotemToken;
                tmpToken = true;
              }
            }

            if (pulseTotemToken != null) {
              $rootScope.currentLogingFromToken = true;
              $http.post(CONSTANTS.backendUrl + CONSTANTS.loginFromTokenBackendPath, {
                'token': pulseTotemToken,
                'tmp': tmpToken
              })
                .success(function (data, status, headers, config) {
                  var successBackendInit = function() {
                    if(tmpToken) {
                      delete($cookies.pulseTotemToken);
                      $cookies.tmpPulseTotemToken = data.token;
                    } else {
                      delete($cookies.tmpPulseTotemToken);
                      $cookies.pulseTotemToken = data.token;
                    }

                    $rootScope.currentLogingFromToken = false;

                    $rootScope.header = "default";
                    if (next.templateUrl === "views/home.html") {
                      if (!$rootScope.$$phase) {
                        $rootScope.$apply(function () {
                          $location.path(CONSTANTS.afterLoginRoute);
                        });
                      } else {
                        $location.path(CONSTANTS.afterLoginRoute);
                      }
                    }
                  };

                  var failBackendInit = function(errorDesc) {
                    console.error(errorDesc);
                    delete($cookies.pulseTotemToken);
                    delete($cookies.tmpPulseTotemToken);

                    $rootScope.header = "home";
                    if (!$rootScope.$$phase) {
                      $rootScope.$apply(function () {
                        $location.path(CONSTANTS.homeRoute);
                      });
                    } else {
                      $location.path(CONSTANTS.homeRoute);
                    }
                  };

                  backendSocket.init(data.token, successBackendInit, failBackendInit);
                })
                .error(function (data, status, headers, config) {
                  $rootScope.currentLogingFromToken = false;
                  delete($cookies.pulseTotemToken);
                  delete($cookies.tmpPulseTotemToken);
                  $rootScope.header = "home";
                  if (next.templateUrl != "../common/views/home.html") {
                    if (!$rootScope.$$phase) {
                      $rootScope.$apply(function () {
                        $location.path(CONSTANTS.homeRoute);
                      });
                    } else {
                      $location.path(CONSTANTS.homeRoute);
                    }
                  }
                });
            } else { //Not connected, path changed
              $rootScope.header = "home";
              if (next.templateUrl != "../common/views/home.html") {
                if (!$rootScope.$$phase) {
                  $rootScope.$apply(function () {
                    $location.path(CONSTANTS.homeRoute);
                  });
                } else {
                  $location.path(CONSTANTS.homeRoute);
                }
              }
            }

          } else {
            $rootScope.header = "default";
            if (next.templateUrl === "../common/views/home.html") {
              if (!$rootScope.$$phase) {
                $rootScope.$apply(function () {
                  $location.path(CONSTANTS.afterLoginRoute);
                });
              } else {
                $location.path(CONSTANTS.afterLoginRoute);
              }
            }
          }
        }
      });*/
    }]);
