'use strict';

function NutritionService($http, $q, $rootScope, flashService) {

  var nutritionList = [];

  this.list = function (i) {
    if (angular.isUndefinedOrNull(i)) { return nutritionList; }
    return nutritionList[i] || null;
  };

  this.count = function () {
    return nutritionList.length;
  };

  this.getTotalCalories = function (protein, fat, carb) {
    return (( protein * 4) + (carb * 4) + (fat * 9));
  };

  this.getNetCarbohydrates = function (carb, fiber) {
    return (carb - fiber);
  };

  this.normalizeNutrition = function (data, modifier, amount) {
    var obj = {};
    var values = [
      'total_fat',
      'saturated_fat',
      'trans_fat',
      'cholesterol',
      'sodium',
      'carbohydrate',
      'fiber',
      'sugars',
      'protein',
      'vitamin_a',
      'vitamin_b',
      'vitamin_c',
      'vitamin_d',
      'calcium',
      'iron',
      'potassium'
    ];

    for (var key in data) {
      if ((values.indexOf(key) > -1) && (data.hasOwnProperty(key))) {
        obj[key] = Math.round((((data[key] / modifier) / amount) * 100) * 100) / 100;
      }
    }
    return obj;
  };

  this.calculateNutrition = function (data, modifier, amount) {
    var obj = {};
    var values = [
      'total_fat',
      'saturated_fat',
      'trans_fat',
      'cholesterol',
      'sodium',
      'carbohydrate',
      'fiber',
      'sugars',
      'protein',
      'vitamin_a',
      'vitamin_b',
      'vitamin_c',
      'vitamin_d',
      'calcium',
      'iron',
      'potassium'
    ];

    for (var i=0; i < values.length; i++) {
      obj[values[i]] = 0;
    }

    for (var key in data) {
      if ((values.indexOf(key) > -1) && (data.hasOwnProperty(key))) {
        obj[key] = Math.round(amount * ((data[key] * (modifier / 100)) * 100)) / 100;
      }
    }

    return obj;
  };

  this.retrieveNutrition = function () {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'nutrition/';

    var urlParams = {};

    $http.get(url,
      { params: urlParams }
    ).success(
      function (data) {
        nutritionList = data;
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to retrieve Nutrition from "' + url + '".');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('nutritionService', ['$http', '$q', '$rootScope', 'flashService', NutritionService]);
