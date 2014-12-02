'use strict';

function MealCategoryService($http, $q, $rootScope, flashService) {

  var mealCategoryList = [];

  this.list = function (i) {
    if (angular.isUndefinedOrNull(i)) { return mealCategoryList; }
    return mealCategoryList[i] || null;
  };

  this.count = function () {
    return mealCategoryList.length;
  };

  this.retrieveMealCategorys = function () {
    return this.retrieveMealCategories();
  };

  this.retrieveMealCategories = function () {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'mealcategories/';

    $http.get(url).success(
      function (data) {
        mealCategoryList = data;
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to load meal categories from "' + url + '".');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('mealCategoryService', ['$http', '$q', '$rootScope', 'flashService', MealCategoryService]);
