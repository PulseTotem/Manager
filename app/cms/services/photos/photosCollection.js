'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.service:PhotosCollection
 * @description
 * # PhotosCollection
 * Service of the PulseTotemManagerCMS
 */
angular.module('PulseTotemManagerCMS')
  .factory('PhotosCollection', ["$resource", "CONSTANTS", function($resource, CONSTANTS) {
    return {
      resource: function (token) {
        return $resource(CONSTANTS.cmsUrl + CONSTANTS.cmsUsersPath +':userid/' + CONSTANTS.cmsPhotosCollectionsPath + ':id', null,
          {
            'get':    {
              method:'GET',
              headers: {
                'Authorization': token
              }
            },
            'save':   {
              method:'POST',
              headers: {
                'Authorization': token
              }
            },
            'query':  {
              method:'GET',
              isArray:true,
              headers: {
                'Authorization': token
              }
            },
            'remove': {
              method:'DELETE',
              headers: {
                'Authorization': token
              }
            },
            'delete': {
              method:'DELETE',
              headers: {
                'Authorization': token
              }
            }
          });
      }
    };
  }]);
