'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:mealItemController
 * @description
 * # mealItemController
 * Controller of the caloriecounterfitnessApp
 */
function MealItemController($scope, $rootScope, nutritionService, measurementService, mealItemService, mealIngredientService, usdaService) {
  $scope.usda = undefined;
  $scope.srchTxt = 'USDA Database';
  $scope.isDisabled = false;

  $scope.save = function () {
    $scope.isDisabled = true;
    mealIngredientService.saveMealIngredient($scope.mealItem.ingredient, {}, $scope.mealItem.ingredient.id).then(function () {
      $scope.mealItem.ingredient = mealIngredientService.data();
      $scope.saveMealItem();
    });
  };

  $scope.saveMealItem = function() {
    var mealItem = {};
    angular.extend(mealItem, $scope.mealItem);
    mealItem.measurement = $scope.mealItem.measurement.url;
    mealItem.ingredient = $scope.mealItem.ingredient.url;
    mealItemService.saveMealItem(mealItem, {}, $scope.mealItem.id).then(function () {
      $scope.isDisabled = false;
      $rootScope.$broadcast('meal-item-saved', $scope.meal);
    });
  };

  $scope.bindNutritionData = function (key, val) {
    $scope.nutritionData[key] = parseFloat(val);
    $scope.normalizeIngredient();
  };

  $scope.resetNutrition = function (measurement) {
    $scope.nutritionData = nutritionService.calculateNutrition(
      $scope.mealItem.ingredient,
      $scope.findMeasurementWeightById(measurement.id),
      $scope.mealItem.amount
    );
  };

  $scope.normalizeIngredient = function () {
    var name = $scope.mealItem.ingredient.name;
    var id = $scope.mealItem.ingredient.id;
    $scope.mealItem.ingredient = nutritionService.normalizeNutrition(
      $scope.nutritionData,
      $scope.findMeasurementWeightById($scope.mealItem.measurement.id),
      $scope.mealItem.amount
    );
    $scope.mealItem.ingredient.name = name;
    $scope.mealItem.ingredient.id = id;
  };

  $scope.findMeasurementById = function (id) {
    for (var i = 0; $scope.measurements.length > i; i++) {
      if ($scope.measurements[i].id === id) {
        return $scope.measurements[i];
      }
    }
    return $scope.measurements[1];
  };

  $scope.findMeasurementWeightById = function (id) {
    var measurement = $scope.findMeasurementById(id);
    return (angular.isUndefinedOrNull(measurement)) ? 0 : measurement.gram_weight;
  };

  $scope.onSelectItem = function () {
    $scope.isDisabled = true;
    var item = usdaService.unSerializeItem($scope.mealItem.ingredient.name);
    var id = item.ndb_number;
    usdaService.retrieveUsda({}, id).then(function () {
      //check meal ingredients service to see if ingredient with this name already exists
      var params = {'search': usdaService.get('long_description'), 'limit': 1};
      mealIngredientService.retrieveMealIngredient(params).then(function () {
        var ingredients =  mealIngredientService.list().map(function (item) {
          return mealIngredientService.serializeItem(item);
        });
        //if meal ingredient with name was not found then create a new object with usda data
        //else use existing object
        if (ingredients.length <= 0) {
          $scope.mealItem.ingredient = usdaService.normalizeNutrientData(usdaService.data());
          $scope.nutritionData = nutritionService.calculateNutrition(
            $scope.mealItem.ingredient,
            $scope.findMeasurementWeightById($scope.mealItem.measurement.id),
            $scope.mealItem.amount);
          $scope.mealItem.ingredient.name = item.long_description;
        } else {
          $scope.mealItemSelect(ingredients[0]);
        }
      });
      $scope.isDisabled = false;
    }, function() {
      $scope.isDisabled = false;
    });
  };

  $scope.populateMeasurements = function () {
    $scope.isDisabled = true;
    measurementService.retrieveMeasurement().then(function () {
      $scope.measurements = measurementService.list();
      var id = $scope.mealItem.measurement.id || 1;
      $scope.mealItem.measurement = $scope.findMeasurementById(id);
      $scope.isDisabled = false;
    });
  };

  $scope.searchUsda = function (val) {
    var params = { 'search': val, 'limit': 25 };
    return usdaService.retrieveUsda(params).then(function () {
      return usdaService.list().map(function (item) {
        return usdaService.serializeItem(item);
      });
    });
  };

  $scope.mealItemSelect = function ($item) {
    $scope.isDisabled = true;
    $scope.mealItem.ingredient = mealIngredientService.unSerializeItem($item);
    mealIngredientService.retrieveMealIngredientById($scope.mealItem.ingredient.id).then(function () {
      $scope.mealItem.ingredient = mealIngredientService.data();
      $scope.nutritionData = nutritionService.calculateNutrition(
        $scope.mealItem.ingredient,
        $scope.findMeasurementWeightById($scope.mealItem.measurement.id),
        $scope.mealItem.amount);
      $scope.isDisabled = false;
    });
  };

  $scope.getIngredients = function (val) {
    var params = { 'search': val, 'limit': 25 };
    return mealIngredientService.retrieveMealIngredient(params).then(function () {
      return mealIngredientService.list().map(function (item) {
        return mealIngredientService.serializeItem(item);
      });
    });
  };
}
angular.module('caloriecounterfitnessApp').controller('mealItemController', ['$scope', '$rootScope', 'nutritionService', 'measurementService', 'mealItemService', 'mealIngredientService', 'usdaService', MealItemController]);

