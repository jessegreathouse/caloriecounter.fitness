'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:MealItemAddCtrl
 * @description
 * # MealItemAddCtrl
 * Controller of the caloriecounterfitnessApp
 */
angular.module('caloriecounterfitnessApp')
  .controller('MealItemAddCtrl', function ($scope, $rootScope, $controller, $filter, $modalInstance, nutritionService, measurementService, mealItemService, mealIngredientService, usdaService, meal) {
    // Initialize the super class and extend it.
    $controller('MealItemCtrl', {$scope: $scope});
    $scope.mealItem = {
      meal: meal.url,
      amount: 1,
      measurement: {id: 1, unit: '100 Grams', gram_weight:100},
      ingredient: {name: null, id: undefined}
    };
    $scope.measurements = [$scope.mealItem.measurement];
    $scope.nutritionData = $scope.mealItem.ingredient;

    $scope.$on('meal-item-saved', function () {
      $modalInstance.close(meal);
    });

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.populateMeasurements();
    $scope.nutritionData = nutritionService.calculateNutrition(
      {},
      $scope.findMeasurementWeightById($scope.mealItem.measurement),
      $scope.mealItem.amount);
  });
