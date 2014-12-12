'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:mealCopyController
 * @description
 * # mealCopyController
 * Controller of the caloriecounterfitnessApp
 */
function MealCopyController($scope, $rootScope, $modalInstance, mealService, meal) {
  $scope.meal = meal;

  $rootScope.$on('meal-copied', function (scope, meal) {
    $modalInstance.close(meal);
  });

  $scope.save = function () {
    $scope.isDisabled = true;
    $scope.isDisabled = false;
    $rootScope.$broadcast('meal-copied', $scope.meal);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}
angular.module('caloriecounterfitnessApp').controller('mealCopyController', ['$scope', '$rootScope', '$modalInstance', 'mealService', 'meal', MealCopyController]);

