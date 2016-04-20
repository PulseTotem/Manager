'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.service:News
 * @description
 * # News
 * Service of the PulseTotemManagerCMS
 */
angular.module('PulseTotemManagerCMS')
  .factory('News', ["$resource", "CONSTANTS", function($resource, CONSTANTS) {
    return {
      resource: function (token) {
        return $resource(CONSTANTS.cmsUrl + CONSTANTS.cmsUsersPath +':userid/' + CONSTANTS.cmsNewsCollectionsPath + ':collectionid/' + CONSTANTS.cmsNewsPath + ':id', null,
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
            'update':   {
              method:'PUT',
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
