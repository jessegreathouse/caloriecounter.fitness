'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:MealItemAddCtrl
 * @description
 * # MealItemAddCtrl
 * Controller of the caloriecounterfitnessApp
 */
angular.module('caloriecounterfitnessApp')
  .controller('MealItemAddCtrl', function ($scope, $rootScope, $filter, $modalInstance, nutritionService, mealItemService, mealIngredientService, usdaService) {
      $scope.usda = undefined;
      $scope.nutritionList = undefined;
      $scope.mealItem = {
          srchTxt: 'USDA Database',
          name: null,
          amount: 1,
          ingredient: {}
      };

      $scope.ok = function () {
          $modalInstance.close($scope.mealItem);
      };

      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };

      $scope.onSelectItem = function () {
          var item = usdaService.unSerializeItem($scope.mealItem.name);
          var id = item.ndb_number;
          $scope.mealItem.name = item.long_description;
          usdaService.retrieveUsda({}, id).then(function () {
              $scope.populateNutrition(usdaService.data());
          });
      }

      $scope.populateNutrition = function (usdaData) {
          $scope.mealItem.ingredient = nutritionService.mapNutrientsToUsda(usdaData);
      }
      
      $scope.searchUsda = function (val) {
          var params = { 'search': val, 'limit': 25 };
          return usdaService.retrieveUsda(params).then(function () {
              return usdaService.list().map(function (item) {
                  return usdaService.serializeItem(item);
              });
          });
      }

      $scope.getIngredients = function (val) {
          var params = { 'search': val, 'limit': 25 };
          return mealIngredientService.retrieveMealIngredient(params).then(function () {
              return mealIngredientService.list().map(function (item) {
                  return item.name;
              });
          });
      }

      $scope.populateNutrition({})
      

  });
