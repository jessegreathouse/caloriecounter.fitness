'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:mainController
 * @description
 * # mainController
 * Controller of the caloriecounterfitnessApp
 */
function MainController ($scope, $rootScope) {
  $scope.$on('like', console.log('user liked feature'));
  $rootScope.$on('help', console.log('help requested'));
}
angular.module('caloriecounterfitnessApp').controller('mainController', ['$scope', '$rootScope', MainController]);


