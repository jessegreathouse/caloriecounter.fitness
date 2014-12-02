'use strict';

function MeasurementService($http, $q, $rootScope, flashService) {

  var measurementList = [];

  this.list = function (i) {
    if (angular.isUndefinedOrNull(i)) { return measurementList; }
    return measurementList[i] || null;
  };

  this.count = function () {
    return measurementList.length;
  };

  this.retrieveMeasurement = function () {
    var deferred = $q.defer();
    var url = $rootScope.settings.ccEndpoint.url + 'measurements/';

    var urlParams = {};

    $http.get(url,
      { params: urlParams }
    ).success(
      function (data) {
        measurementList = data;
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        flashService.addMessage('error', 'Failed to retrieve Measurements from "' + url + '".');
        $rootScope.$broadcast('flashAlert', data);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('measurementService', ['$http', '$q', '$rootScope', 'flashService', MeasurementService]);

