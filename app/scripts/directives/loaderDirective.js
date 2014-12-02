'use strict';

function LoaderDirective () {
  return function ($scope, element) {
    $scope.$on('loader_show', function () {
      return element.show();
    });
    return $scope.$on('loader_hide', function () {
      return element.hide();
    });
  };
}
angular.module('caloriecounterfitnessApp').directive('loader', ['$rootScope', LoaderDirective]);
