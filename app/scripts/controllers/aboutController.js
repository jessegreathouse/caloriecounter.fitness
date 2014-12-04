'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:aboutController
 * @description
 * # aboutController
 * Controller of the caloriecounterfitnessApp
 */
function AboutController($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}
angular.module('caloriecounterfitnessApp').controller('aboutController', ['$scope', AboutController]);
