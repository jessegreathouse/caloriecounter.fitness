'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:MacroPieController
 * @description
 * # MacroPieController
 * Controller of the caloriecounterfitnessApp
 */
function MacroPieController($scope) {

  $scope.labels = [
    'Protein',
    'Net Carbs',
    'Fat',
    'Fiber'
  ];

  $scope.$on('nutrition-data-update', function () {
    $scope.data = [
      $scope.nutritionData.protein,
      $scope.nutritionData.net_carbohydrate,
      $scope.nutritionData.total_fat,
      $scope.nutritionData.fiber
    ];
  });

}
angular.module('caloriecounterfitnessApp').controller('macroPieController', ['$scope', MacroPieController]);

