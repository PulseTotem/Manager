'use strict';

/**
 * @ngdoc function
 * @name pulsetotemApp.PulseTotemCommon.constant:Constants
 * @description
 * Constants for the pulsetotemApp
 */
angular.module('PulseTotemCommon')
    .constant('CONSTANTS', {
        backendUrl: 'http://localhost:4000/',
        //backendUrl: 'https://backend.pulsetotem.fr/',
        //backendUrl: 'https://backend-test.pulsetotem.fr/',
        cmsUrl: 'http://localhost:8000/',
        //cmsUrl: 'https://cms.pulsetotem.fr/',
        //cmsUrl: 'https://cms-test.pulsetotem.fr/',

        managersBackendPath: 'managers',
        loginBackendPath: 'login',
        loginFromTokenBackendPath: 'loginFromToken',

        cmsUsersPath: 'users/',
        cmsPhotosCollectionsPath: 'images_collections/',
        cmsPhotosPath: 'images/',
        cmsVideosCollectionsPath: 'videos_collections/',
        cmsVideosPath: 'videos/',
        cmsNewsCollectionsPath: 'news_collections/',
        cmsNewsPath: 'news/',
        cmsNewsPicturePath: 'picture/',

        loginRoute: '/',
        afterLoginRoute: '/cms'
    });
