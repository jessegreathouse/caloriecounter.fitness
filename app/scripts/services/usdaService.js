function UsdaService($http, $q, $rootScope) {

  var usdaList = [];
  var usdaData = {
    nutrients : undefined
  };
  this.retrieveEventName = 'usdaService.retrieveMeal';

  this.list = function (i) {
    if (null == i) { return usdaList; }
    return usdaList[i] || null;
  };

  this.serializeItem = function (item) {
    return item.ndb_number + ' - ' + item.long_description;
  };

  this.unSerializeItem = function (string) {
    var pieces = string.split(' - ');
    return {
      ndb_number: pieces[0],
      long_description: pieces[1]
    };
  };

  this.normalizeNutrientData = function (data) {
    var normalized = {};
    var values = {
      'Total lipid (fat)'              : 'total_fat',
      'Fatty acids, total saturated'   : 'saturated_fat',
      'Fatty acids, total trans'       : 'trans_fat',
      'Cholesterol'                    : 'cholesterol',
      'Sodium, Na'                     : 'sodium',
      'Carbohydrate, by difference'    : 'carbohydrate',
      'Fiber, total dietary'           : 'fiber',
      'Sugars, total'                  : 'sugars',
      'Protein'                        : 'protein',
      'Vitamin A, IU'                  : 'vitamin_a',
      'Vitamin B-12'                   : 'vitamin_b',
      'Vitamin C, total ascorbic acid' : 'vitamin_c',
      'Vitamin D (D2 + D3)'            : 'vitamin_d',
      'Calcium, Ca'                    : 'calcium',
      'Iron, Fe'                       : 'iron',
      'Potassium, K'                   : 'potassium'
    };

    if (data.nutrients !== undefined) {
      for (var i = 0; i < data.nutrients.length; i++) {
        for (var key in data.nutrients[i]) {
          normalized[values[key]] = data.nutrients[i][key];
        }
      }
    }
    return normalized;
  };

  this.data = function () {
    return usdaData || null;
  };

  this.get = function (key) {
    return usdaData[key] || null;
  };

  this.count = function () {
    return usdaList.length;
  };

  this.retrieveUsda = function (params, id) {
    var deferred = $q.defer();
    var url = settings.ccEndpoint.url + "usda/";

    if (id != undefined && id != null) {
      url = url + id + "/";
    }

    if (params == undefined || params == null) {
      params = {};
    }

    if ('search' in params) {
      if (params.search.length < 4) {
        deferred = $q.defer();
        return deferred.promise;
      }
    }

    $http.get(url, { params: params }
    ).success(
      function (data) {
        if (angular.isArray(data)) {
          usdaList = data;
          $rootScope.$broadcast(this.retrieveEventName, usdaList);
        } else {
          usdaData = data;
          $rootScope.$broadcast(this.retrieveEventName, usdaData);
        }
        deferred.resolve(true);
      }
    ).error(
      function (data) {
        deferred.reject(data);
        $rootScope.$broadcast(this.retrieveEventName, usdaList);
      }
    );
    return deferred.promise;
  };
}
angular.module('caloriecounterfitnessApp').service('usdaService', ["$http", "$q", "$rootScope", UsdaService]);
