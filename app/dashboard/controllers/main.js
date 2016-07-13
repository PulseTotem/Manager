'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerDashboard.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the PulseTotemManagerDashboard
 */
angular.module('PulseTotemManagerDashboard')
  .controller('PulseTotemManagerDashboard.MainCtrl', ['$rootScope', '$scope', 'Team', 'User', 'PhotosCollection', 'VideosCollection', 'NewsCollection', "$http", "CONSTANTS", function($rootScope, $scope, Team, User, PhotosCollection, VideosCollection, NewsCollection, $http, CONSTANTS){
    $rootScope.activeMenu = 'dashboard';
    $rootScope.activeNavbar = 'dashboard';

    $scope.teams = [];
    $scope.loadTeams = function(){
      Team.resource($rootScope.user.cmsAuthkey).query(function(teams) {
        $scope.teams = [];
        teams.forEach(function(team) {
          $scope.teams.push(team);
        });
      });
    };

    $scope.loadTeams();

    $scope.loadPhotosCollections = function(){
      PhotosCollection.resource($rootScope.user.cmsAuthkey).query({userid: $rootScope.user.cmsId}, function(collections) {
        $scope.collections = [];
        collections.forEach(function(collection) {
          if(! collection.autogenerate) {
            collection['coverPath'] = '/images/cms/photos/empty.png';
            if (collection.cover != null) {
              collection['coverPath'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + collection.cover.id + '/raw?size=medium';
            }

            $scope.collections.push(collection);
          }
        });
        $scope.collectionsLoaded = true;
        $scope.actionLoading = "";
      });
    };

    $scope.usersCollections = [];
    $scope.loadCollections = function(){
      $scope.users.forEach(function(user) {
        $scope.usersCollections[user.id] = {};
        PhotosCollection.resource($rootScope.user.cmsAuthkey).query({userid: user.id}, function(collections) {
          $scope.usersCollections[user.id]["photosCollections"] = [];

          collections.forEach(function(collection) {
            $scope.usersCollections[user.id]["photosCollections"].push(collection);
          });
        });

        VideosCollection.resource($rootScope.user.cmsAuthkey).query({userid: user.id}, function(collections) {
          $scope.usersCollections[user.id]["videosCollections"] = collections;
        });

        NewsCollection.resource($rootScope.user.cmsAuthkey).query({userid: user.id}, function(collections) {
          $scope.usersCollections[user.id]["newsCollections"] = collections;
        });

      });
    };

    $scope.users = [];
    $scope.loadUsers = function(){
      User.resource($rootScope.user.cmsAuthkey).query(function(users) {
        $scope.users = [];

        users.forEach(function(user) {
          $scope.users.push(user);
        });

        $scope.loadCollections();
      });
    };

    $scope.loadUsers();

    $scope.movePhotosToTeam = function(coll, teamJSON) {
      var team = JSON.parse(teamJSON);

      $http.post(CONSTANTS.cmsUrl + "admin/" + CONSTANTS.cmsPhotosCollectionsPath + coll.id + "/" + CONSTANTS.cmsTeamsPath + team.id, {})
        .success(function (data, status, headers, config) {
          alert('Ok');
        })
        .error(function (data, status, headers, config) {
          console.log("fail during move photos coll");
        });
    };

    $scope.moveVideosToTeam = function(coll, teamJSON) {
      var team = JSON.parse(teamJSON);

      $http.post(CONSTANTS.cmsUrl + "admin/" + CONSTANTS.cmsVideosCollectionsPath + coll.id + "/" + CONSTANTS.cmsTeamsPath + team.id, {})
        .success(function (data, status, headers, config) {
          alert('Ok');
        })
        .error(function (data, status, headers, config) {
          console.log("fail during move videos coll");
        });
    };

    $scope.moveNewsToTeam = function(coll, teamJSON) {
      var team = JSON.parse(teamJSON);

      $http.post(CONSTANTS.cmsUrl + "admin/" + CONSTANTS.cmsNewsCollectionsPath + coll.id + "/" + CONSTANTS.cmsTeamsPath + team.id, {})
        .success(function (data, status, headers, config) {
          alert('Ok');
        })
        .error(function (data, status, headers, config) {
          console.log("fail during move news coll");
        });
    };

  }]);
