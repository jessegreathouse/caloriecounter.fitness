'use strict';

function MeasurementService($http, $q, $rootScope) {

  var measurementList = [];
  var retrieveEventName = 'measurementService.retrieveMeasurement';

  this.list = function (i) {
    if (null == i) { return measurementList; }
    return measurementList[i] || null;
  };

  this.count = function () {
    return measurementList.length;
  };

  this.retrieveMeasurement = function () {
    var deferred = $q.defer();
    var url = settings.ccEndpoint.url + "measurements/";

    var urlParams = {};

    $http.get(url,
      { params: urlParams }
    ).success(
      function (data) {
        measurementList = data;
        $rootScope.$broadcast(retrieveEventName, measurementList);
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(retrieveEventName, measurementList);
      }
    );
    return deferred.promise;
  }
}
angular.module('caloriecounterfitnessApp').service('measurementService', ["$http", "$q", "$rootScope", MeasurementService]);

