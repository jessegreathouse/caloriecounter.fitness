'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the caloriecounterfitnessApp
 */
angular.module('caloriecounterfitnessApp')
  .controller('HeaderCtrl', function ($scope, $location) {
      $scope.isActive = function (viewLocation) {
          return viewLocation === $location.path();
      };
  });
