'use strict';

/**
 * @ngdoc function
 * @name caloriecounterfitnessApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the caloriecounterfitnessApp
 */
angular.module('caloriecounterfitnessApp')
  .controller('MainCtrl', function ($scope, $rootScope) {
    $scope.$on('like', console.log('user liked feature'));
    $rootScope.$on('help', console.log('help requested'));
  });


