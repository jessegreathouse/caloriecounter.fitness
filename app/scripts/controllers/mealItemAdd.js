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
    $scope.isDisabled = false;
    $scope.mealItem = {
      meal: meal.url,
      amount: 1,
      measurement: {id: 1, unit: '100 Grams', gram_weight:100},
      ingredient: {name: null, id: undefined}
    };
    $scope.measurements = [$scope.mealItem.measurement];
    $scope.nutritionData = $scope.mealItem.ingredient;

    $scope.save = function () {
      $scope.isDisabled = true;
      var params = {'search': $scope.mealItem.ingredient.name, 'exact': true, 'limit': 1};
      mealIngredientService.retrieveMealIngredient(params).then(function () {
        if (mealIngredientService.count() <= 0) {
          mealIngredientService.saveMealIngredient($scope.mealItem.ingredient, {}, $scope.mealItem.ingredient.id).then(function () {
            $scope.saveMealItem();
          });
        } else {
          $scope.saveMealItem();
        }
      });
    };

    $scope.saveMealItem = function() {
      var mealItem = {};
      angular.extend(mealItem, $scope.mealItem);
      mealItem.measurement = $scope.measurements[($scope.mealItem.measurement - 1)].url;
      mealItem.ingredient = mealIngredientService.get('url');
      mealItemService.saveMealItem(mealItem).then(function () {
        $scope.isDisabled = false;
        $modalInstance.close(meal);
      });
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
      var id = $scope.mealItem.ingredient.id;
      $scope.mealItem.ingredient = nutritionService.normalizeNutrition(
        $scope.nutritionData,
        $scope.findMeasurementWeightById($scope.mealItem.measurement),
        $scope.mealItem.amount
      );
      $scope.mealItem.ingredient.name = name;
      $scope.mealItem.ingredient.id = id;
    };

    $scope.findMeasurementWeightById = function (id) {
      for (var i = 0; $scope.measurements.length > i; i++) {
        if ($scope.measurements[i].id === id) {
          return $scope.measurements[i].gram_weight;
        }
      }
      return 0;
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
              $scope.findMeasurementWeightById($scope.mealItem.measurement),
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
        $scope.mealItem.measurement = $scope.measurements[0].id;
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
          $scope.findMeasurementWeightById($scope.mealItem.measurement),
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

    $scope.populateMeasurements();
    $scope.nutritionData = nutritionService.calculateNutrition(
      {},
      $scope.findMeasurementWeightById($scope.mealItem.measurement),
      $scope.mealItem.amount);
  });
