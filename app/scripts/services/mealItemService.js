'use strict';

function MealItemService($http, $q, $rootScope) {

  var mealItemList = [];
  var mealItemData = {};
  var retrieveEventName = 'mealItemService.retrieveMealItem';
  var saveEventName = 'mealItemService.saveMealItem';

  this.list = function (i) {
    if (null == i) { return mealItemList; }
    return mealItemList[i] || null;
  };

  this.data = function () {
    return mealItemData || null;
  };

  this.get = function (key) {
    return mealItemData[key] || null;
  };

  this.count = function () {
    return mealItemList.length;
  };

  this.retrieveMealItemById = function (id) {
    return this.retrieveMealItem({}, id);
  };

  this.retrieveMealItem = function (params, id) {
    var deferred = $q.defer();
    var url = settings.ccEndpoint.url + "mealitems/";

    if (angular.isNumber(id)) {
      url = url + id + "/";
    }

    $http.get(url,
      { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          mealItemList = data;
          $rootScope.$broadcast(retrieveEventName, mealItemList);
        } else {
          mealItemData = data;
          $rootScope.$broadcast(retrieveEventName, mealItemData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(retrieveEventName, mealItemData);
      }
    );
    return deferred.promise;
  };

  this.saveMealItem = function (data, params, id) {
    var deferred = $q.defer();
    var url = settings.ccEndpoint.url + "mealitems/";

    if (angular.isNumber(id)) {
      url = url + id + "/";
    }

    $http.post(url, data,
      { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          mealItemList = data;
          $rootScope.$broadcast(saveEventName, mealItemList);
        } else {
          mealItemData = data;
          $rootScope.$broadcast(saveEventName, mealItemData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(saveEventName, mealItemData);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('mealItemService', ["$http", "$q", "$rootScope", MealItemService]);
