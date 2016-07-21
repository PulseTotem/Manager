'use strict';

/**
 * @ngdoc function
 * @name PulseTotemManagerCMS.News.controller:AddEditNewsCtrl
 * @description
 * # CollectionsListCtrl
 * Controller of the PulseTotemManagerCMS.News
 */
angular.module('PulseTotemManagerCMS')
  .controller('PulseTotemManagerCMS.News.AddEditNewsCtrl', ['$rootScope', '$scope', '$routeParams', 'NewsCollection', 'News', 'CONSTANTS', 'Upload', '$timeout', '$mdDialog', '$http', '$translate', function($rootScope, $scope, $routeParams, NewsCollection, News, CONSTANTS, Upload, $timeout, $mdDialog, $http, $translate){
    $rootScope.activeMenu = 'cms';
    $rootScope.activeNavbar = 'cms';

    var afterUpdateTeam = function() {

      $scope.collectionid = $routeParams.collectionid || null;

      if (typeof($routeParams.collectionid) == "undefined") {
        $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms');
      } else {
        $scope.actionLoading = "indeterminate";
        //Feed
        $scope.collection = {};
        $scope.collectionLoaded = false;
        $scope.loadNewsCollection = function () {
          NewsCollection.resource($rootScope.user.cmsAuthkey).get({
              teamid: $rootScope.currentTeam.cmsId,
              id: $routeParams.collectionid
            },
            function (collection) {
              $scope.collection = collection;
              $scope.collectionLoaded = true;
              if ($scope.collectionLoaded && $scope.newNewsLoaded) {
                $scope.actionLoading = "";
              }
            });
        };

        $scope.loadNewsCollection();

        if (typeof($routeParams.newsid) == "undefined") {
          $scope.newNewsLoaded = true;
          var newsResource = News.resource($rootScope.user.cmsAuthkey);
          $scope.newNews = new newsResource();

          $scope.newNews.begin = "";
          $scope.newNews.end = "";
          $scope.newNews.picture = {};
          $scope.newNews.picture.path = '/images/cms/photos/empty.png';
          $scope.newNews.newPicture = null;
          $scope.newNews.newPictureFile = null;
        } else {
          //News
          $scope.newNews = {};
          $scope.newNewsLoaded = false;
          $scope.loadNewsItem = function () {
            News.resource($rootScope.user.cmsAuthkey).get({
              teamid: $rootScope.currentTeam.cmsId,
              collectionid: $routeParams.collectionid,
              id: $routeParams.newsid
            }, function (newsI) {
              $scope.newNews = newsI;
              $scope.newNewsLoaded = true;

              if (typeof($scope.newNews.begin) == "undefined" || $scope.newNews.begin == null) {
                $scope.newNews.begin = "";
              }

              if (typeof($scope.newNews.end) == "undefined" || $scope.newNews.end == null) {
                $scope.newNews.end = "";
              }

              if ($scope.newNews.picture == null) {
                $scope.newNews.picture = {};
                $scope.newNews.picture.path = '/images/cms/photos/empty.png';
              } else {
                $scope.newNews.picture['path'] = CONSTANTS.cmsUrl + CONSTANTS.cmsPhotosPath + $scope.newNews.picture.id + '/raw?size=medium';
              }

              $scope.newNews.newPicture = null;
              $scope.newNews.newPictureFile = null;

              if ($scope.collectionLoaded && $scope.newNewsLoaded) {
                $scope.actionLoading = "";
              }
            });
          };

          $scope.loadNewsItem();
        }


        $scope.newNews.beginText = "";
        $scope.$watch(
          function () {
            return $scope.newNews.begin;
          },
          function (newValue, oldValue, scope) {
            $scope.newNews.begin = newValue;
            $scope.newNews.beginText = moment($scope.newNews.begin).format("L LT");
          }
        );

        $scope.newNews.endText = "";
        $scope.$watch(
          function () {
            return $scope.newNews.end;
          },
          function (newValue, oldValue, scope) {
            $scope.newNews.end = newValue;
            $scope.newNews.endText = moment($scope.newNews.end).format("L LT");
          }
        );

        $scope.saveNews = function () {
          if (typeof($routeParams.newsid) == "undefined") {
            News.resource($rootScope.user.cmsAuthkey).save({
              teamid: $rootScope.currentTeam.cmsId,
              collectionid: $scope.collectionid
            }, $scope.newNews, function (newsDesc) {
              $scope.managePicture(newsDesc);
            });
          } else {
            News.resource($rootScope.user.cmsAuthkey).update({
              teamid: $rootScope.currentTeam.cmsId,
              collectionid: $scope.collectionid,
              id: $routeParams.newsid
            }, $scope.newNews, function (newsDesc) {
              $scope.managePicture(newsDesc);
            });
          }
        };

        $scope.changeNewsPicture = function (newFile) {
          $scope.newNews.newPicture = {};
          $scope.newNews.newPictureFile = newFile;
          Upload.dataUrl(newFile, true).then(function (url) {
            if ($scope.newNews.newPictureFile != null) {
              $scope.newNews.newPicture['path'] = url;
            }
          });
        };

        $scope.managePicture = function (newsDesc) {
          if ($scope.newNews.newPictureFile != null) {
            if (typeof($scope.newNews.picture.id) != "undefined") {
              $scope.deletePicture(newsDesc);
            } else {
              $scope.uploadPicture(newsDesc);
            }
          } else {
            $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/' + $scope.collectionid + '/news/' + newsDesc.id);
          }
        };

        $scope.deletePicture = function (newsDesc) {

          if (typeof(newsDesc) == "undefined") {
            newsDesc = $scope.newNews;
          }

          $http.delete(CONSTANTS.cmsUrl + CONSTANTS.cmsTeamsPath + $rootScope.currentTeam.cmsId + '/' + CONSTANTS.cmsNewsCollectionsPath + $scope.collectionid + '/' + CONSTANTS.cmsNewsPath + newsDesc.id + '/' + CONSTANTS.cmsNewsPicturePath,
            {
              headers: {
                'Authorization': $rootScope.user.cmsAuthkey
              }
            })
            .success(function (data, status, headers, config) {
              $timeout(function () {
                if ($scope.newNews.newPictureFile != null) {
                  $scope.uploadPicture(newsDesc);
                } else {
                  $scope.newNews.picture = {};
                  $scope.newNews.picture.path = '/images/cms/photos/empty.png';
                  $scope.newNews.newPicture = null;
                  $scope.newNews.newPictureFile = null;
                }
              });
            })
            .error(function (data, status, headers, config) {
              //TODO: Manage error during post => display error message
              console.log("Fail during delete existing picture.");
            });
        };

        $scope.uploadPicture = function (newsDesc) {
          Upload.upload({
            url: CONSTANTS.cmsUrl + CONSTANTS.cmsTeamsPath + $rootScope.currentTeam.cmsId + '/' + CONSTANTS.cmsNewsCollectionsPath + $scope.collectionid + '/' + CONSTANTS.cmsNewsPath + newsDesc.id + '/' + CONSTANTS.cmsNewsPicturePath,
            headers: {
              'Authorization': $rootScope.user.cmsAuthkey
            },
            data: {
              file: $scope.newNews.newPictureFile
            }
          }).then(function (response) {
            $timeout(function () {
              $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/' + $scope.collectionid + '/news/' + newsDesc.id);
            });
          }, function (response) {

            /*if (response.status > 0) {
             $scope.errorMsg = response.status + ': ' + response.data;
             }*/

            //TODO : Display message to User

          }, function (evt) {
            /*$scope.progress =
             Math.min(100, parseInt(100.0 * evt.loaded / evt.total));*/
            //Nothing to do ?
          });
        };

        $scope.showConfirmDeletePicture = function (ev) {
          $translate(['CMS.NEWS.FORM.DELETE_PICTURE_DIALOG.TITLE', 'CMS.NEWS.FORM.DELETE_PICTURE_DIALOG.CONTENT', 'CMS.NEWS.FORM.DELETE_PICTURE_DIALOG.CONFIRM', 'CMS.NEWS.FORM.DELETE_PICTURE_DIALOG.CANCEL']).then(function (translations) {
            var confirm = $mdDialog.confirm()
              .title(translations['CMS.NEWS.FORM.DELETE_PICTURE_DIALOG.TITLE'])
              .textContent(translations['CMS.NEWS.FORM.DELETE_PICTURE_DIALOG.CONTENT'])
              .ariaLabel('Delete Picture ?')
              .targetEvent(ev)
              .ok(translations['CMS.NEWS.FORM.DELETE_PICTURE_DIALOG.CONFIRM'])
              .cancel(translations['CMS.NEWS.FORM.DELETE_PICTURE_DIALOG.CANCEL']);
            $mdDialog.show(confirm).then(function () {
              $scope.deletePicture();
            }, function () {
              //Nothing to do.
            });
          });
        };
      }

      //Delete
      $scope.deleteInProgression = "";
      $scope.deleteNewsItem = function () {
        if (typeof($scope.collectionid) != "undefined" && $scope.collectionid != null && typeof($scope.newsItemId) != "undefined" && $scope.newsItemId != null) {
          $scope.deleteInProgression = "indeterminate";
          News.resource($rootScope.user.cmsAuthkey).delete(
            {
              teamid: $rootScope.currentTeam.cmsId,
              collectionid: $scope.collectionid,
              id: $scope.newsItemId
            },
            function () {
              $scope.deleteInProgression = "";
              $mdDialog.hide();
              $scope.currentDisplayIndex = null;
              $scope.currentDisplayNews = null;
              if ($scope.collectionid != null) {
                $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/' + $scope.collectionid);
              } else {
                $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/');
              }
            }
          );
        } else {
          $scope.closeForm();
          if ($scope.collectionid != null) {
            $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/' + $scope.collectionid);
          } else {
            $rootScope.goTo('/teams/' + $rootScope.currentTeam.name + '/cms/news/collections/');
          }
        }
      };

      $scope.closeForm = function () {
        $mdDialog.cancel();
      };
    };

    manageCurrentState.updateTeam(afterUpdateTeam);

  }]);
