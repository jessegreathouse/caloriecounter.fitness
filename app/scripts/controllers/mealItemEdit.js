'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:MealItemEditCtrl
 * @description
 * # MealItemEditCtrl
 * Controller of the caloriecounterfitnessApp
 */
angular.module('caloriecounterfitnessApp')
  .controller('MealItemEditCtrl', function ($scope, $rootScope, $controller, $filter, nutritionService, measurementService, mealItemService, mealIngredientService) {
    // Initialize the super class and extend it.
    //console.log($scope.mealItem);
    $controller('MealItemCtrl', {$scope: $scope});
    $scope.measurements = [$scope.mealItem.measurement];
    $scope.nutritionData = $scope.mealItem.ingredient;


    $scope.populateMeasurements();
    $scope.mealItemSelect(mealIngredientService.serializeItem($scope.mealItem.ingredient));
  });

