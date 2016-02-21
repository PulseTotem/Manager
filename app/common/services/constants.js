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
        //backendUrl: 'https://backend.pulsetotem.fr/',
        backendUrl: 'https://backend-test.pulsetotem.fr/',
        cmsUrl: 'http://localhost:8000/',
        //cmsUrl: 'https://cms.pulsetotem.fr/',
        //cmsUrl: 'https://cms-test.pulsetotem.fr/',

        adminBackendPath: 'admins',
        loginBackendPath: 'login',
        loginFromTokenBackendPath: 'loginFromToken',

        loginRoute: '/',
        afterLoginRoute: '/cms'
    });