﻿function MealIngredientService($http, $q, $rootScope) {

    var mealIngredientList = [];
    var mealIngredientData = {};
    this.retrieveEventName = 'mealIngredientService.retrieveMealIngredient';

  this.serializeItem = function (item) {
    return item.id + ' - ' + item.name;
  }

  this.unSerializeItem = function (string) {
    var pieces = string.split(' - ');
    var item = {
      id: pieces[0],
      name: pieces[1]
    };
    return item;
  }

    this.list = function (i) {
        if (null == i) { return mealIngredientList; }
        return mealIngredientList[i] || null;
    }

    this.data = function (i) {
        return mealIngredientData || null;
    }

    this.get = function (key) {
        return mealIngredientData[key] || null;
    }

    this.count = function () {
        return mealIngredientList.length;
    }

    this.retrieveMealIngredientById = function (id) {
        return this.retrieveMealIngredient(null, id);
    }

    this.retrieveMealIngredient = function (params, id) {
        var url = settings.ccEndpoint.url + "mealingredients/";
        if (id != undefined && id != null) {
            url = url + id + "/";
        }

        if (params == undefined || params == null) {
            var params = {}
        }

        var deferred = $q.defer();
        $http.get(url,
            { params: params }
        ).success(
            function (data) {
                if (angular.isArray(data)) {
                    mealIngredientList = data;
                    $rootScope.$broadcast(this.retrieveEventName, mealIngredientList);
                } else {
                    mealIngredientData = data;
                    $rootScope.$broadcast(this.retrieveEventName, mealIngredientData);
                }
                deferred.resolve(true);
            }
        ).error(
            function (data) {
                deferred.reject(data);
                $rootScope.$broadcast(this.retrieveEventName, mealIngredientData);
            }
        );
        return deferred.promise;
    }
}
angular.module('caloriecounterfitnessApp').service('mealIngredientService', ["$http", "$q", "$rootScope", MealIngredientService]);
