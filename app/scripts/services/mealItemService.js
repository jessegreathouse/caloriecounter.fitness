function MealItemService($http, $q, $rootScope) {

  var mealItemList = [];
  var mealItemData = {};
  this.retrieveEventName = 'mealItemService.retrieveMealItem';
  this.saveEventName = 'mealItemService.saveMealItem';

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
          this.mealItemList = data;
          $rootScope.$broadcast(this.retrieveEventName, this.mealItemList);
        } else {
          this.mealItemData = data;
          $rootScope.$broadcast(this.retrieveEventName, this.mealItemData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(this.retrieveEventName, this.mealItemData);
      }
    );
    return deferred.promise;
  }

  this.saveMealItem = function (data, params, id) {
    var deferred = $q.defer();
    var url = settings.ccEndpoint.url + "mealitems/";

    if (angular.isNumber(id)) {
      url = url + id + "/";
    }
    console.log(data);
    $http.post(url, data,
      { params: params }
    ).success(
      function (data) {
        console.log(data);
        if (angular.isArray(data)) {
          this.mealItemList = data;
          $rootScope.$broadcast(this.saveEventName, this.mealItemList);
        } else {
          this.mealItemData = data;
          $rootScope.$broadcast(this.saveEventName, this.mealItemData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(this.saveEventName, this.mealItemData);
      }
    );
    return deferred.promise;
  }
}
angular.module('caloriecounterfitnessApp').service('mealItemService', ["$http", "$q", "$rootScope", MealItemService]);
