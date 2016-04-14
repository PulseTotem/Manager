'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.service:NewsCollection
 * @description
 * # NewsCollection
 * Service of the PulseTotemManagerCMS
 */
angular.module('PulseTotemManagerCMS')
  .factory('NewsCollection', ["$resource", "CONSTANTS", function($resource, CONSTANTS) {
    return {
      resource: function (token) {
        return $resource(CONSTANTS.cmsUrl + CONSTANTS.cmsUsersPath +':userid/' + CONSTANTS.cmsNewsCollectionsPath + ':id', null,
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
