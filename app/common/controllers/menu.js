'use strict';

/**
 * @ngdoc function
 * @name PulseTotemCommon.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the PulseTotemCommon
 */
angular.module('PulseTotemCommon')
    .controller('PulseTotemCommon.MenuCtrl', ['$rootScope', '$scope', '$translate', 'backendSocket', 'callbackManager', '$cookies', '$location', 'CONSTANTS', '$mdSidenav', function ($rootScope, $scope, $translate, backendSocket, callbackManager, $cookies, $location, CONSTANTS, $mdSidenav) {

        $scope.langList = [
          {
            "key" : "en",
            "title" : "LANG.ENGLISH",
            "flag" : "/images/flags/en.png"
          },
          {
            "key" : "fr",
            "title" : "LANG.FRENCH",
            "flag" : "/images/flags/fr.png"
          }
        ];

        $rootScope.langKey = $translate.use();

        $scope.changeLanguage = function (langKey) {
          $rootScope.langKey = langKey;
          $translate.use(langKey);
          moment.locale(langKey);
        };

        $scope.logout = function() {
          $rootScope.user = {};

          $cookies.remove("authT6SToken");
          $cookies.remove("tmpAuthT6SToken");

          backendSocket.exit();

          if (!$rootScope.$$phase) {
            $rootScope.$apply(function () {
              $location.path(CONSTANTS.loginRoute);
            });
          } else {
            $location.path(CONSTANTS.loginRoute);
          }
        };

        $scope.toggleLeft = buildToggler('left');
        /**
         * Build handler to open/close a SideNav;
         */
        function buildToggler(navID) {
          return function() {
            $mdSidenav(navID)
              .toggle();
          }
        }

        $scope.manageTeams = function() {
          backendSocket.on('ManageTeamsAnswer', function(response) {
            callbackManager(response, function (allSDIs) {
                alert("OK !");
              },
              function (fail) {
                alert("Fail !");
                console.error(fail);
              }
            );
          });

          backendSocket.emit('ManageTeams');
        };

    }]);
