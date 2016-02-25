'use strict';

/**
 * @ngdoc function
 * @name PulseTotemCommon.directive:MenuCtrl
 * @description
 * # backImg
 * Controller of the PulseTotemCommon
 */
angular.module('PulseTotemCommon')
  .directive('loadingMdGridTileContent', [ function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        url: "=",
        onHoverDisplay: "=",
        loadedHandler: "&loaded"
      },
      controller : ['$scope', '$element', function($scope, $element) {
        $scope.loaded = undefined;
        if($scope.loadedHandler) {
          $scope.loaded = $scope.loadedHandler();
        }

        $scope.hoverDisplay = false;
        if($scope.onHoverDisplay) {
          $scope.hoverDisplay = $scope.onHoverDisplay;
        };

        if($scope.hoverDisplay) {
          $scope.showFooter = false;
        } else {
          $scope.showFooter = true;
        }

        $scope.onEnter = function() {
          if($scope.hoverDisplay) {
            $scope.showFooter = true;
          }
        };

        $scope.onLeave = function() {
          if($scope.hoverDisplay) {
            $scope.showFooter = false;
          }
        };

        $scope.imgLoading = 'indeterminate';
        var img = new Image();
        img.onload = function() {
          $scope.imgLoading = '';
          $element.css({
            'background-image': 'url(' + $scope.url +')'
          });
          if($scope.loaded) {
            $scope.loaded();
          }
          img = null;
        };
        img.src = $scope.url;
      }],
      templateUrl: 'common/directives/views/loading-md-grid-tile-content.html'
    };
  }
  ]);
