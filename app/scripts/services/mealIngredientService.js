'use strict';

function MealIngredientService($http, $q, $rootScope, flashService) {

  var mealIngredientList = [];
  var mealIngredientData = {};

  this.serializeItem = function (item) {
    return item.id + ' - ' + item.name;
  };

  this.unSerializeItem = function (string) {
    var pieces = string.split(' - ');
    return {
      id: pieces[0],
      name: pieces[1]
    };
  };

  this.list = function (i) {
    if (null == i) { return mealIngredientList; }
    return mealIngredientList[i] || null;
  };

  this.data = function () {
    return mealIngredientData || null;
  };

  this.get = function (key) {
    return mealIngredientData[key] || null;
  };

  this.count = function () {
    return mealIngredientList.length;
  };

  this.retrieveMealIngredientById = function (id) {
    return this.retrieveMealIngredient(null, id);
  };

  this.retrieveMealIngredient = function (params, id) {
    var url = settings.ccEndpoint.url + "mealingredients/";
    if (id != undefined && id != null) {
      url = url + id + "/";
    }

    if (params == undefined || params == null) {
      params = {}
    }

    var deferred = $q.defer();
    $http.get(url,
      { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          mealIngredientList = data;
        } else {
          mealIngredientData = data;
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to retrieve Ingredients from "' + url + '".');
        $rootScope.$broadcast("flashAlert", data);
      }
    );
    return deferred.promise;
  };

  this.saveMealIngredient = function (data, params, id) {
    var deferred = $q.defer();
    var method = 'POST';
    var url = settings.ccEndpoint.url + "mealingredients/";
    if (params == undefined || params == null) {
      params = {}
    }

    if (id != undefined || id != null) {
      url = url + id + "/";
      method = 'PUT';
    }

    $http({
      url:    url,
      data:   data,
      method: method,
      params: params
    }).success(
      function (data) {
        mealIngredientData = data;
        flashService.addMessage('success', 'Saved ingredient: "' + mealIngredientData.name + '".');
        $rootScope.$broadcast("flashAlert", mealIngredientData);
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to save Ingredients from "' + url + '".');
        $rootScope.$broadcast("errorAlert", data);
      }
    );
    return deferred.promise;


  };
}
angular.module('caloriecounterfitnessApp').service('mealIngredientService', ["$http", "$q", "$rootScope", "flashService", MealIngredientService]);
