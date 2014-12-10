'use strict';

function NutritionProfileService($http, $q, $rootScope, flashService) {

  var nutritionProfileList = [];
  var nutritionProfileData = {};

  this.list = function (i) {
    if (angular.isUndefinedOrNull(i)) { return nutritionProfileList; }
    return nutritionProfileList[i] || null;
  };

  this.data = function () {
    return nutritionProfileData || null;
  };

  this.get = function (key) {
    return nutritionProfileData[key] || null;
  };

  this.count = function () {
    return nutritionProfileList.length;
  };

  this.getProfileByDate = function(date) {
    if (nutritionProfileList.length === 0) { return false; }
    var apiParts;
    var nowParts = {
      hour: date.getHours(),
      minutes: date.getMinutes()
    };
    var closestProfile = nutritionProfileList[0];
    for (var i = 0; i < nutritionProfileList.length; i++) {
      apiParts = nutritionProfileList[i].day.split('-');
      var testDate = new Date(apiParts[0], (apiParts[1]-1), apiParts[2], nowParts.hour, nowParts.minutes);
      if (date >= testDate) {
        closestProfile = nutritionProfileList[i];
      } else {
        break;
      }
    }
    return closestProfile;
  };

  this.retrieveNutritionProfile = function (startdate, enddate, id) {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'nutritionprofile/';

    if (angular.isNumber(id)) {
      url = url +  id + '/';
    }

    var urlParams = {};


    if (!angular.isUndefinedOrNull(startdate)) {
      urlParams.startdate = startdate;
    }

    if (!angular.isUndefinedOrNull(enddate)) {
      urlParams.enddate = enddate;
    }

    var options = {params: urlParams};

    $http.get( url, options )
      .success(function (data) {
        if (angular.isArray(data)) {
          nutritionProfileList = data;
        } else {
          nutritionProfileData = data;
        }
        deferred.resolve(true);
      })
      .error(function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to retrieve NutritionProfiles from "' + url + '".');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };

  this.saveNutritionProfile = function (data, params, id) {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'nutritionprofile/';

    if (angular.isNumber(id)) {
      url = url + id + '/';
    }

    $http.post(url, data,
      { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          nutritionProfileList = data;
          flashService.addMessage('success', 'Saved ' + this.count() + ' NutritionProfiles.');
          $rootScope.$broadcast('flashAlert', nutritionProfileList);
        } else {
          nutritionProfileData = data;
          flashService.addMessage('success', 'Saved NutritionProfile.');
          $rootScope.$broadcast('flashAlert', nutritionProfileData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to save NutritionProfile.');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };

  this.removeNutritionProfile = function (nutritionProfile, params) {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'nutritionProfiles/';

    if (angular.isUndefinedOrNull(params)) {
      params = {};
    }

    if (angular.isUndefinedOrNull(nutritionProfile)) {
      deferred.reject(nutritionProfile);
      flashService.addMessage('error', 'No NutritionProfile was specified for delete.');
      $rootScope.$broadcast('flashAlert', nutritionProfile);
      return deferred.promise;
    } else if (!angular.isArray(nutritionProfile)) {
      if (angular.isUndefinedOrNull(nutritionProfile.id)) {
        deferred.reject(nutritionProfile);
        flashService.addMessage('error', 'No NutritionProfile was specified for delete.');
        $rootScope.$broadcast('flashAlert', nutritionProfile);
        return deferred.promise;
      } else {
        url = url + nutritionProfile.id + '/';
      }
    }

    $http.delete(url,
      { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          flashService.addMessage('success', 'Removed ' + data.length + ' NutritionProfiles.');
          $rootScope.$broadcast('flashAlert', data);
        } else {
          flashService.addMessage('success', 'Removed NutritionProfile: "' + nutritionProfile.id + '".');
          $rootScope.$broadcast('flashAlert', data);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to remove NutritionProfile.');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('nutritionProfileService', ['$http', '$q', '$rootScope', 'flashService', NutritionProfileService]);

