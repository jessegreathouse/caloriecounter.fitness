﻿'use strict';

function MealService($http, $q, $rootScope, flashService) {

  var mealList = [];
  var mealData = {};

  this.list = function (i) {
    if (angular.isUndefinedOrNull(i)) { return mealList; }
    return mealList[i] || null;
  };

  this.data = function () {
    return mealData || null;
  };

  this.get = function (key) {
    return mealData[key] || null;
  };

  this.count = function () {
    return mealList.length;
  };

  this.retrieveMealById = function (id) {
    return this.retrieveMeal(null, null, id);
  };

  this.retrieveMealByDate = function (startdate, enddate) {
    return this.retrieveMeal(startdate, enddate, null);
  };

  this.retrieveMeal = function (startdate, enddate, id) {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'meals/';

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
          mealList = data;
        } else {
          mealData = data;
        }
        deferred.resolve(true);
      })
      .error(function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to retrieve Meals from "' + url + '".');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };

  this.saveMeal = function (data, params, id) {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'meals/';

    if (angular.isNumber(id)) {
      url = url + id + '/';
    }

    $http.post(url, data,
      { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          mealList = data;
          flashService.addMessage('success', 'Saved ' + this.count() + ' Meals.');
          $rootScope.$broadcast('flashAlert', mealList);
        } else {
          mealData = data;
          flashService.addMessage('success', 'Saved Meal: "' + mealData.meal_category.name + '" .');
          $rootScope.$broadcast('flashAlert', mealData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to save Meal.');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('mealService', ['$http', '$q', '$rootScope', 'flashService', MealService]);
