'use strict';

/**
 * @ngdoc function
 * @name pulsetotemApp.PulseTotemCommon.constant:Constants
 * @description
 * Constants for the pulsetotemApp
 */
angular.module('PulseTotemCommon')
    .constant('CONSTANTS', {
        //backendUrl: 'http://localhost:4000/',
        //backendUrl: 'http://backend.pulsetotem.fr/',
        backendUrl: 'http://backend-test.pulsetotem.fr/',
        loginBackendPath: 'login',
        loginFromTokenBackendPath: 'loginFromToken',
        homeRoute: '/',
        afterLoginRoute: '/dashboard'
    });
