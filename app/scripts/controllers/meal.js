'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:MealCtrl
 * @description
 * # MealCtrl
 * Controller of the caloriecounterfitnessApp
 */
angular.module('caloriecounterfitnessApp')
  .controller('MealCtrl', function ($scope, $rootScope, $filter, $modal, mealService, mealCategoryService, usdaService) {
      $scope.mealCategories = [];
      $scope.Meals = [];
      $scope.format = 'dd-MMMM-yyyy';
      $scope.urlFormat = 'yyyy-MM-dd';
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      $scope.maxDate = tomorrow;
      $scope.today = function () {
          $scope.dt = new Date();
      };
      $scope.today();
      $scope.usda = undefined;
      
      // Disable weekend selection
      $scope.disabled = function (date, mode) {
          return (mode === 'day' && (date > $scope.maxDate));
      };

      $scope.open = function ($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = true;
      };

      $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 0
      };

      $scope.fetchMeals = function (selectedDate) {
          $('#new-meal-btn').attr('disabled', true);
          mealService.retrieveMealByDate(selectedDate, selectedDate).then(function () {
              $('#new-meal-btn').removeAttr('disabled');
              $('#meal-day').val(selectedDate);
              $scope.Meals = mealService.list();
          });
      }

      $scope.fetchMealCategories = function () {
          mealCategoryService.retrieveMealCategories().then(function () {
              $scope.mealCategories = mealCategoryService.list();
              $scope.selectedMealCategory = $scope.mealCategories[0];
          });
      }

      $scope.searchUsda = function(val) {
          return usdaService.retrieveSearch(val).then(function () {
              return usdaService.list().map(function (item) {
                  return item.long_description;
              });
          });
      }

      $scope.newItem = function (id) {
          var modalInstance = $modal.open({
              templateUrl: 'views/mealItemAdd.html',
              controller: 'MealItemAddCtrl',
              size: 'lg',
              resolve: {
                  id: id
              }
          });

          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
          }, function () {
              $log.info('Modal dismissed at: ' + new Date());
          });
      }

      $scope.selectDate = function () {
          $scope.fetchMeals($filter('date')($scope.dt, $scope.urlFormat));
      };
      $scope.fetchMealCategories();
      $scope.fetchMeals($filter('date')($scope.dt, $scope.urlFormat));
     

  });
