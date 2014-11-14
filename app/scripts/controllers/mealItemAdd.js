'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:MealItemAddCtrl
 * @description
 * # MealItemAddCtrl
 * Controller of the caloriecounterfitnessApp
 */
angular.module('caloriecounterfitnessApp')
  .controller('MealItemAddCtrl', function ($scope, $rootScope, $filter, $modalInstance, nutritionService, measurementService, mealItemService, mealIngredientService, usdaService, meal) {
    $scope.usda = undefined;
    $scope.srchTxt = 'USDA Database';
    $scope.mealItem = {
      meal: meal.id,
      amount: 1,
      measurement: {id: 1, unit: "100 Grams", gram_weight:100},
      ingredient: {name: null}
    };
    $scope.measurements = [$scope.mealItem.measurement];
    $scope.nutritionData = $scope.mealItem.ingredient;

    $scope.save = function () {
      mealItemService.saveMealItem($scope.mealItem);
      //$modalInstance.close($scope.mealItem);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.bindNutritionData = function (key, val) {
      $scope.nutritionData[key] = parseFloat(val);
      $scope.normalizeIngredient();
    };

    $scope.resetNutrition = function () {
      $scope.nutritionData = nutritionService.calculateNutrition(
        $scope.mealItem.ingredient,
        $scope.findMeasurementWeightById($scope.mealItem.measurement),
        $scope.mealItem.amount
      );
    };

    $scope.normalizeIngredient = function () {
      var name = $scope.mealItem.ingredient.name;
      $scope.mealItem.ingredient = nutritionService.normalizeNutrition(
        $scope.nutritionData,
        $scope.findMeasurementWeightById($scope.mealItem.measurement),
        $scope.mealItem.amount
      );
      $scope.mealItem.ingredient.name = name;
    };

    $scope.findMeasurementWeightById = function (id) {
      for (var i = 0; $scope.measurements.length > i; i++) {
        if ($scope.measurements[i].id == id) {
          return $scope.measurements[i].gram_weight;
        }
      }
      return 0;
    };

    $scope.onSelectItem = function () {
      var item = usdaService.unSerializeItem($scope.mealItem.ingredient.name);
      var id = item.ndb_number;
      usdaService.retrieveUsda({}, id).then(function () {
        $scope.mealItem.ingredient = usdaService.normalizeNutrientData(usdaService.data());
        $scope.nutritionData = nutritionService.calculateNutrition(
          $scope.mealItem.ingredient,
          $scope.findMeasurementWeightById($scope.mealItem.measurement),
          $scope.mealItem.amount);
        $scope.mealItem.ingredient.name = item.long_description;
      });
    };

    $scope.populateMeasurements = function () {
      measurementService.retrieveMeasurement().then(function () {
        $scope.measurements = measurementService.list();
        $scope.mealItem.measurement = $scope.measurements[0].id;
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
      $scope.mealItem.ingredient = mealIngredientService.unSerializeItem($item);
      mealIngredientService.retrieveMealIngredientById($scope.mealItem.ingredient.id).then(function () {
        $scope.mealItem.ingredient = mealIngredientService.data();
        $scope.nutritionData = nutritionService.calculateNutrition(
          $scope.mealItem.ingredient,
          $scope.findMeasurementWeightById($scope.mealItem.measurement),
          $scope.mealItem.amount);
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

    $scope.populateMeasurements();
    $scope.nutritionData = nutritionService.calculateNutrition(
      {},
      $scope.findMeasurementWeightById($scope.mealItem.measurement),
      $scope.mealItem.amount);
  });
