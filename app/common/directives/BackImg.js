'use strict';

/**
 * @ngdoc function
 * @name PulseTotemCommon.directive:MenuCtrl
 * @description
 * # backImg
 * Controller of the PulseTotemCommon
 */
angular.module('PulseTotemCommon')
  .directive('backImg', [function(){
    return function(scope, element, attrs){
      var url = attrs.backImg;
      var img = new Image();
      img.src = url;
      img.onload = function() {
        if(typeof(scope.inProgression) != "undefined") {
          scope.inProgression = '';
        }
        element.css({
          'background-image': 'url(' + url +')'
        });
      };
    };
  }]);
