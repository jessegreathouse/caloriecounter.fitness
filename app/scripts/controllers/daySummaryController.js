'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:DaySummaryController
 * @description
 * # DaySummaryController
 * Controller of the caloriecounterfitnessApp
 */
function DaySummaryController($scope, $rootScope, nutritionService, nutritionProfileService) {
  $scope.isOpen = true;
  $scope.nutritionData = {
    calories: 0,
    calories_from_carbohydrate: 0,
    calories_from_protein: 0,
    calories_from_fat: 0,
    calories_from_net_carbohydrate: 0,
    net_carbohydrate: 0,
    total_fat: 0,
    saturated_fat: 0,
    trans_fat: 0,
    cholesterol: 0,
    sodium: 0,
    carbohydrate: 0,
    fiber: 0,
    sugars: 0,
    protein: 0,
    vitamin_a: 0,
    vitamin_b: 0,
    vitamin_c: 0,
    vitamin_d: 0,
    calcium: 0,
    iron: 0,
    potassium: 0
  };

  $scope.nutritionProfile = {
    'target_calories': 0,
    'target_protein': 0,
    'target_carbohydrate': 0,
    'target_fat': 0,
    'target_fiber': 0
  };

  $scope.dateFormat = 'MMMM d, yyyy';
  $scope.today = function () {
    $scope.date = new Date();
  };
  $scope.today();

  $rootScope.$on('select-date', function (scope, date) {
    $scope.date = date;
  });

  $rootScope.$on('fetch-meals', function (scope, meals) {
    $scope.nutritionData = nutritionService.composeMeals(meals);
    $scope.$broadcast('nutrition-data-update');
  });

  nutritionProfileService.retrieveNutritionProfile().then(function () {
    if (nutritionProfileService.count() > 0) {
      $scope.nutritionProfile = nutritionProfileService.getProfileByDate($scope.date);
    }
  });

}
angular.module('caloriecounterfitnessApp').controller('daySummaryController', ['$scope', '$rootScope', 'nutritionService', 'nutritionProfileService', DaySummaryController]);
