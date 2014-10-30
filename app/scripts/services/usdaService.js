function UsdaService($http, $q, $rootScope) {

    var usdaList = [];
    var usdaData = {};
    this.retrieveEventName = 'usdaService.retrieveMeal';

    this.list = function (i) {
        if (null == i) { return usdaList; }
        return usdaList[i] || null;
    }

    this.serializeItem = function (item) {
        return item.ndb_number + ' - ' + item.long_description;
    }

    this.unSerializeItem = function (string) {
        var pieces = string.split(' - ');
        var item = {
            ndb_number: pieces[0],
            long_description: pieces[1]
        };
        return item;
    }

    this.data = function () {
        return usdaData || null;
    }

    this.get = function (key) {
        return usdaData[key] || null;
    }

    this.count = function () {
        return usdaList.length;
    }

    this.retrieveUsda = function (params, id) {
        var deferred = $q.defer();
        var url = settings.ccEndpoint.url + "usda/";

        if (id != undefined && id != null) {
            url = url + id + "/";
        }

        if (params == undefined || params == null) {
            var params = {}
        }

        if ('search' in params) {
            if (params.search.length < 4) {
                var deferred = $q.defer();
                return deferred.promise;
            }
        }

        $http.get(url, { params: params, }
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
    }

    this.retrieveFood = function (ndb_number) {
        var deferred = $q.defer();
        var url = settings.ccEndpoint.url + "usda/" + ndb_number + "/";

        $http.get(url)
        .success(
            function (data) {
                usdaData = data;
                deferred.resolve(true);
                $rootScope.$broadcast(this.retrieveEventName, usdaData);
            }
        ).error(
            function (data) {
                deferred.reject(data);
                $rootScope.$broadcast(this.retrieveEventName, usdaData);
            }
        );
        return deferred.promise;
    }
}
angular.module('caloriecounterfitnessApp').service('usdaService', ["$http", "$q", "$rootScope", UsdaService]);
