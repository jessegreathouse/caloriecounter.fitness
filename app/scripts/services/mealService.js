﻿function MealService($http, $q, $rootScope) {

    var mealList = [];
    var mealData = {};
    this.retrieveEventName = 'mealService.retrieveMeal';

    this.list = function (i) {
        if (null == i) { return mealList; }
        return mealList[i] || null;
    }

    this.data = function () {
        return mealData || null;
    }

    this.get = function (key) {
        return mealData[key] || null;
    }

    this.count = function () {
        return mealList.length;
    }

    this.retrieveMealById = function (id) {
        return this.retrieveMeal(null, null, id);
    }

    this.retrieveMealByDate = function (startdate, enddate) {
        return this.retrieveMeal(startdate, enddate, null);
    }

    this.retrieveMeal = function (startdate, enddate, id) {
        var deferred = $q.defer();
        var url = settings.ccEndpoint.url + "meals/";

        if (angular.isNumber(id)) {
            url = url +  id + "/";
        }

        var urlParams = {}

        if (!angular.isUndefinedOrNull(startdate)) {
            urlParams.startdate = startdate;
        }

        if (!angular.isUndefinedOrNull(enddate)) {
            urlParams.enddate = enddate;
        }

        $http.get( url,
            { params: urlParams, }
        ).success(
            function (data) {
                if (angular.isArray(data)) {
                    mealList = data;
                    $rootScope.$broadcast(this.retrieveEventName, mealList);
                } else {
                    mealData = data;
                    $rootScope.$broadcast(this.retrieveEventName, mealData);
                }
                deferred.resolve(true);
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
angular.module('caloriecounterfitnessApp').service('mealService', ["$http", "$q", "$rootScope", MealService]);