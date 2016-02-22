'use strict';

/**
 * @ngdoc function
 * @name PulseTotemCommon.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the PulseTotemCommon
 */
angular.module('PulseTotemCommon')
    .controller('PulseTotemCommon.MenuCtrl', ['$rootScope', '$scope', '$translate', 'backendSocket', '$cookies', '$location', 'CONSTANTS', '$mdSidenav', function ($rootScope, $scope, $translate, backendSocket, $cookies, $location, CONSTANTS, $mdSidenav) {

    //Default values
      $rootScope.activeMenu = 'cms';
      $rootScope.activeNavbar = 'cms';

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
        };

        $scope.logout = function() {
          $rootScope.user = {};

          $cookies.remove("adminT6SToken");
          $cookies.remove("tmpAdminT6SToken");

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

        $scope.goTo = function(newPath) {
          if (!$rootScope.$$phase) {
            $rootScope.$apply(function () {
              $location.path(newPath);
            });
          } else {
            $location.path(newPath);
          }
        };

    }]);
