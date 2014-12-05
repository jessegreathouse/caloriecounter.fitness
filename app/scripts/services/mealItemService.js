'use strict';

function MealItemService($http, $q, $rootScope, flashService) {

  var mealItemList = [];
  var mealItemData = {};

  this.list = function (i) {
    if (angular.isUndefinedOrNull(i)) { return mealItemList; }
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
    var url = $rootScope.settings.ccEndpoint.url + 'mealitems/';

    if (angular.isNumber(id)) {
      url = url + id + '/';
    }

    $http.get(url,
      { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          mealItemList = data;
        } else {
          mealItemData = data;
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to retrieve Meal Item from "' + url + '".');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };

  this.saveMealItem = function (data, params, id) {
    var deferred = $q.defer();
    var method = 'POST';
    var url = $rootScope.settings.ccEndpoint.url + 'mealitems/';

    if (angular.isUndefinedOrNull(params)) {
      params = {};
    }

    if (!angular.isUndefinedOrNull(id)) {
      url = url + id + '/';
      method = 'PUT';
    }

    $http({
      url:    url,
      data:   data,
      method: method,
      params: params
    }).success(
      function (data) {
        if (angular.isArray(data)) {
          mealItemList = data;
          flashService.addMessage('success', 'Saved Meal Item.');
          $rootScope.$broadcast('flashAlert', mealItemData);
        } else {
          mealItemData = data;
          flashService.addMessage('success', 'Saved Meal Item.');
          $rootScope.$broadcast('flashAlert', mealItemData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to save Meal Item.');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };

  this.removeMealItem = function (mealItem, params) {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'mealitems/';

    if (angular.isUndefinedOrNull(params)) {
      params = {};
    }

    if (angular.isUndefinedOrNull(mealItem)) {
      deferred.reject(mealItem);
      flashService.addMessage('error', 'No Meal Item was specified for delete.');
      $rootScope.$broadcast('flashAlert', mealItem);
      return deferred.promise;
    } else if (!angular.isArray(mealItem)) {
      if (angular.isUndefinedOrNull(mealItem.id)) {
        deferred.reject(mealItem);
        flashService.addMessage('error', 'No Meal Item was specified for delete.');
        $rootScope.$broadcast('flashAlert', mealItem);
        return deferred.promise;
      } else {
        url = url + mealItem.id + '/';
      }
    }

    $http.delete(url,
      { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          flashService.addMessage('success', 'Removed ' + data.length + ' Meal Items.');
          $rootScope.$broadcast('flashAlert', data);
        } else {
          flashService.addMessage('success', 'Removed Meal Item: "' + mealItem.ingredient.name + '".');
          $rootScope.$broadcast('flashAlert', data);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to remove Meal Item.');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('mealItemService', ['$http', '$q', '$rootScope', 'flashService', MealItemService]);
