'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:mealItemEditController
 * @description
 * # mealItemEditController
 * Controller of the caloriecounterfitnessApp
 */
function MealItemEditController($scope, $controller, mealIngredientService) {
  $controller('mealItemController', {$scope: $scope});
  $scope.measurements = [$scope.mealItem.measurement];
  $scope.nutritionData = $scope.mealItem.ingredient;

  $scope.populateMeasurements();
  $scope.mealItemSelect(mealIngredientService.serializeItem($scope.mealItem.ingredient));
}
angular.module('caloriecounterfitnessApp').controller('mealItemEditController', ['$scope', '$controller', 'mealIngredientService', MealItemEditController]);
