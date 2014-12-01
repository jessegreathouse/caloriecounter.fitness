'use strict';

function TokenService($http, $q, $cookies, $rootScope, flashService) {

  var tokenData = {};

  this.get = function (key) {
    return tokenData[key] || null;
  };

  this.dropToken = function () {
    delete $cookies.ccTokenKey;
    delete $cookies.ccTokenUserId;
  };

  this.retrieveToken = function (email) {
    //if the cookie data exists then use the cookie if not, make remote call
    if (angular.isDefined($cookies.ccTokenKey) && angular.isDefined($cookies.ccTokenUserId)) {
      tokenData = {
        "key" : $cookies.ccTokenKey,
        "user": $cookies.ccTokenUserId
      };
    } else {
      $http.jsonp(
        settings.ccEndpoint.url + "token/",
        {
          params: {
            email: email,
            format: 'jsonp',
            callback: 'JSON_CALLBACK'
          }
        }
      ).success(
        function (data) {
          tokenData = data;
          $cookies.ccTokenKey = tokenData.key;
          $cookies.ccTokenUserId = tokenData.user;
          $rootScope.$broadcast('tokenService.retrieveToken', tokenData);
        }
      ).error(
        function (data) {
          tokenData = ($q.reject(data));
          flashService.addMessage('error', 'Failed to retrieve Token from "' + settings.ccEndpoint.url + '".');
          $rootScope.$broadcast("flashAlert", data);
        }
      );
    }
  }
}
angular.module('caloriecounterfitnessApp').service('tokenService', ["$http", "$q", "$cookies", "$rootScope", "flashService", TokenService]);
