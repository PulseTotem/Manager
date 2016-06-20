'use strict';

/**
 * @ngdoc service
 * @name pulsetotemApp.PulseTotemCommon.factory:callbackManager
 * @description
 * # factory : callbackManager
 * Factory in the pulsetotemApp.
 */
angular.module('PulseTotemCommon')
  .factory('callbackManager', function () {

    return function (backendMessage, successCallback, failCallback) {
      if (backendMessage.success == true) {
        successCallback(backendMessage.response);
      } else {
        failCallback(backendMessage.response);
      }
    }
  });
