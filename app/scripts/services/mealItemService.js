function MealItemService($http, $q, $rootScope) {

    var mealItemList = [];
    var mealItemData = {};
    this.retrieveEventName = 'mealItemService.retrieveMealItem';

    this.list = function (i) {
        if (null == i) { return mealItemList; }
        return mealItemList[i] || null;
    }

    this.data = function (i) {
        return mealItemData || null;
    }

    this.get = function (key) {
        return mealItemData[key] || null;
    }

    this.count = function () {
        return mealItemList.length;
    }

    this.retrieveMealItemById = function (id) {
        return this.retrieveMealItem(null, null, id);
    }

    this.retrieveMealItem = function (id) {
        var deferred = $q.defer();
        var url = settings.ccEndpoint.url + "mealitems/";

        if (angular.isNumber(id)) {
            url = url + id + "/";
        }

        var urlParams = {}

        $http.get(url,
            { params: urlParams, }
        ).success(
            function (data) {
                if (angular.isArray(data)) {
                    mealList = data;
                    $rootScope.$broadcast(this.retrieveEventName, mealItemList);
                } else {
                    mealData = data;
                    $rootScope.$broadcast(this.retrieveEventName, mealItemData);
                }
                deferred.resolve(true);
            }
        ).error(
            function (data) {
                deferred.reject(data);
                $rootScope.$broadcast(this.retrieveEventName, mealItemData);
            }
        );
        return deferred.promise;
    }
}
angular.module('caloriecounterfitnessApp').service('mealItemService', ["$http", "$q", "$rootScope", MealItemService]);
