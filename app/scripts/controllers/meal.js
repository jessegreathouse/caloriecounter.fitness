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
    $scope.isDisabled = false;
    $scope.format = 'dd-MMMM-yyyy';
    $scope.urlFormat = 'yyyy-MM-dd';
    $scope.today = function () {
      $scope.dt = new Date();
    };
    $scope.today();
    $scope.usda = undefined;
    $scope.newMealBtnStatus = {
      isOpen: false
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.newMealBtnStatus.isOpen = !$scope.newMealBtnStatus.isOpen;
    };

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

    $scope.findMealCategoryById = function (id) {
      for (var i = 0; $scope.mealCategories.length > i; i++) {
        if ($scope.mealCategories[i].id === id) {
          return $scope.mealCategories[i];
        }
      }
      return $scope.mealCategories[1];
    };

    $scope.fetchMeals = function (selectedDate, activeMeal) {
      $scope.isDisabled = true;
      mealService.retrieveMealByDate(selectedDate, selectedDate).then(function () {
        $scope.isDisabled = false;
        $scope.Meals = mealService.list();
        for (var i=0; i < $scope.Meals.length; i++) {
          $scope.Meals[i].meal_category = $scope.findMealCategoryById($scope.Meals[i].meal_category);
          $scope.Meals[i].isOpen = !!((!angular.isUndefinedOrNull(activeMeal)) && ($scope.Meals[i].id === (activeMeal.id)));
        }
      });
    };

    $scope.fetchMealCategories = function () {
      mealCategoryService.retrieveMealCategories().then(function () {
        $scope.mealCategories = mealCategoryService.list();
        $scope.selectedMealCategory = $scope.mealCategories[0];
      });
    };

    $scope.searchUsda = function(val) {
      return usdaService.retrieveUsda({search: val}).then(function () {
        return usdaService.list().map(function (item) {
          return item.long_description;
        });
      });
    };

    $scope.newItem = function (meal) {
      var myMeal = function () {
        return meal;
      };
      var modalInstance = $modal.open({
        templateUrl: 'views/mealItemAdd.html',
        controller: 'MealItemAddCtrl',
        size: 'lg',
        resolve: {
          meal: myMeal
        }
      });

      modalInstance.result.then(function (meal) {
        $scope.fetchMeals($filter('date')($scope.dt, $scope.urlFormat), meal);
      }, function () {

      });
    };

    $scope.newMeal = function($event, category) {
      $event.preventDefault();
      $event.stopPropagation();
      var meal = {
        day: $filter('date')($scope.dt, $scope.urlFormat),
        meal_items: [],
        meal_category: category.id
      };
      mealService.saveMeal(meal).then(function() {
        $scope.fetchMeals($filter('date')($scope.dt, $scope.urlFormat), mealService.data());
      });
      $scope.newMealBtnStatus.isOpen = false;
    };

    $scope.selectDate = function () {
      $scope.fetchMeals($filter('date')($scope.dt, $scope.urlFormat));
    };
    $scope.fetchMealCategories();
    $scope.fetchMeals($filter('date')($scope.dt, $scope.urlFormat));



  });
