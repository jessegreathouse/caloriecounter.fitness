'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:headerController
 * @description
 * # headerController
 * Controller of the caloriecounterfitnessApp
 */
function HeaderController($scope, $location) {
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
}
angular.module('caloriecounterfitnessApp').controller('headerController', ['$scope', '$location', HeaderController]);
