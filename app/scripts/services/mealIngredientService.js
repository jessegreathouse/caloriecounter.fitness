'use strict';

function MealIngredientService($http, $q, $rootScope) {

  var mealIngredientList = [];
  var mealIngredientData = {};
  var retrieveEventName = 'mealIngredientService.retrieveMealIngredient';
  var saveEventName = 'mealIngredientService.saveMealIngredient';

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
          $rootScope.$broadcast(retrieveEventName, mealIngredientList);
        } else {
          mealIngredientData = data;
          $rootScope.$broadcast(retrieveEventName, mealIngredientData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(retrieveEventName, mealIngredientData);
      }
    );
    return deferred.promise;
  };

  this.saveMealIngredient = function (data, params, id) {
    var url = settings.ccEndpoint.url + "mealingredients/";
    if (params == undefined || params == null) {
      params = {}
    }

    if (id == undefined || id == null) {
      return this.createMealIngredient(data, params, url);
    } else {
      url = url + id + "/";
      return this.updateMealIngredient(data, params, url);
    }
  };

  this.createMealIngredient = function (data, params, url) {
    var deferred = $q.defer();
    $http.post(url, data,
      { params: params }
    ).success(
      function (data) {
        mealIngredientData = data;
        $rootScope.$broadcast(saveEventName, mealIngredientData);
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(saveEventName, mealIngredientData);
      }
    );
    return deferred.promise;
  };

  this.updateMealIngredient = function (data, params, url) {
    var deferred = $q.defer();
    $http.put(url, data,
      { params: params }
    ).success(
      function (data) {
        mealIngredientData = data;
        $rootScope.$broadcast(saveEventName, mealIngredientData);
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(saveEventName, mealIngredientData);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('mealIngredientService', ["$http", "$q", "$rootScope", MealIngredientService]);
