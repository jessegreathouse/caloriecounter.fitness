function MealCategoryService($http, $q, $rootScope) {

    var mealList = [];
    this.retrieveEventName = 'mealCategoryService.retrieveMeal';

    this.list = function (i) {
        if (null == i) { return mealList; }
        return mealList[i] || null;
    }

    this.count = function () {
        return mealList.length;
    }

    this.retrieveMealCategorys = function () {
        return this.retrieveMealCategories();
    }

    this.retrieveMealCategories = function () {
        var deferred = $q.defer();
        var url = settings.ccEndpoint.url + "mealcategories/";

        $http.get(url).success(
            function (data) {
                mealList = data;
                deferred.resolve(true);
                $rootScope.$broadcast(this.retrieveEventName, mealList);
            }
        ).error(
            function (data) {
                deferred.reject(data);
                $rootScope.$broadcast(this.retrieveEventName, mealData);
            }
        );
        return deferred.promise;
    }
}
angular.module('caloriecounterfitnessApp').service('mealCategoryService', ["$http", "$q", "$rootScope", MealCategoryService]);
