'use strict';

/**
 * @ngdoc overview
 * @name caloriecounterfitnessApp
 * @description
 * # caloriecounterfitnessApp
 *
 * Main module of the application.
 */

/**
 * function extension for determining if a value is null
 *
 */
angular.isUndefinedOrNull = function (val) {
  return (angular.isUndefined(val) || val === null);
};

angular
  .module('caloriecounterfitnessApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'xeditable',
    'UserApp',
    'chartjs'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'partials/userapp-angular/login.html',
        login: true
      })
      .when('/signup', {
        templateUrl: 'partials/userapp-angular/signup.html',
        public: true
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'aboutController',
        public: true
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainController'
      })
      .when('/token', {
        templateUrl: 'views/token.html',
        controller: 'TokenController'
      })
      .when('/meal', {
        templateUrl: 'views/meal.html',
        controller: 'mealController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptorFactory');
  })
  .run(function (user) {
    user.init({ appId: '54361db1ae584' });
  })
  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';
  })
  .run(function ($rootScope, settingsProvider) {
    $rootScope.settings = settingsProvider.settings;
    $rootScope.flashMessages = [];
  })
  .run(function ($rootScope, $location, user, $http, tokenService) {
    $rootScope.$on('user.login', function () {
      tokenService.retrieveToken(user.current.email);
      var ccToken = tokenService.get('key');
      if (angular.isUndefinedOrNull(ccToken)) {
        $location.path('/token');
      }
      $http.defaults.headers.common.Authorization = 'Token ' + ccToken;
      $rootScope.$on('tokenService.retrieveToken', function () {
        window.location = '/';
      });
    });

    $rootScope.$on('user.logout', function () {
      tokenService.dropToken(user.current.email);
    });
  })

;


