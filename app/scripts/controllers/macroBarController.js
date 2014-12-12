'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:MacroBarController
 * @description
 * # MacroBarController
 * Controller of the caloriecounterfitnessApp
 */
function MacroBarController($scope) {

  $scope.labels = [
    'Protein',
    'Net Carbs',
    'Fat',
    'Fiber'
  ];

  $scope.$on('nutrition-data-update', function () {
    $scope.data = [
      [
        $scope.nutritionData.protein,
        $scope.nutritionData.net_carbohydrate,
        $scope.nutritionData.total_fat,
        $scope.nutritionData.fiber
      ],
      [
        $scope.nutritionProfile.target_protein,
        $scope.nutritionProfile.target_carbohydrate,
        $scope.nutritionProfile.target_fat,
        $scope.nutritionProfile.target_fiber
      ]
    ];
  });

}
angular.module('caloriecounterfitnessApp').controller('macroBarController', ['$scope', MacroBarController]);


