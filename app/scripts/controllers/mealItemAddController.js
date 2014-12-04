'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:mealItemAddController
 * @description
 * # mealItemAddController
 * Controller of the caloriecounterfitnessApp
 */
function MealItemAddController($scope, $controller, $modalInstance, nutritionService, meal) {
  $controller('mealItemController', {$scope: $scope});
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
}
angular.module('caloriecounterfitnessApp').controller('mealItemAddController', ['$scope', '$controller', '$modalInstance', 'nutritionService', 'meal', MealItemAddController]);
