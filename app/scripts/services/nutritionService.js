function NutritionService($http, $q, $rootScope) {

    var nutritionList = [];
    this.retrieveEventName = 'nutritionService.retrieveNutrition';

    this.list = function (i) {
        if (null == i) { return nutritionList; }
        return nutritionList[i] || null;
    }

    this.count = function () {
        return nutritionList.length;
    }

    this.mapNutrientsToUsda = function (usdaData) {
        var map = {};
        var values = {
            'Total lipid (fat)': 'total_fat',
            'Fatty acids, total saturated': 'saturated_fat',
            'Fatty acids, total trans': 'trans_fat',
            'Cholesterol': 'cholesterol',
            'Sodium, Na': 'sodium',
            'Carbohydrate, by difference': 'carbohydrate',
            'Fiber, total dietary': 'fiber',
            'Sugars, total': 'sugars',
            'Protein': 'protein',
            'Vitamin A, IU': 'vitamin_a',
            'Vitamin B-12': 'vitamin_b',
            'Vitamin C, total ascorbic acid': 'vitamin_c',
            'Vitamin D (D2 + D3)': 'vitamin_d',
            'Calcium, Ca': 'calcium',
            'Iron, Fe': 'iron',
            'Potassium, K': 'potassium',
        }

        for (var key in values) {
                map[values[key]] = 0;
        }

        if (usdaData.nutrients != undefined) {
            for (var i = 0; i < usdaData.nutrients.length; i++) {
                for (var key in usdaData.nutrients[i]) {
                    if (key in values) {
                        var val = 0;
                        if (usdaData.nutrients[i][key] != "") {
                            map[values[key]] = usdaData.nutrients[i][key];
                        }
                    }
                }
            }
        }
        return map;
    }

    this.retrieveNutrition = function () {
        var deferred = $q.defer();
        var url = settings.ccEndpoint.url + "nutrition/";

        var urlParams = {}

        $http.get(url,
            { params: urlParams, }
        ).success(
            function (data) {
                nutritionList = data;
                $rootScope.$broadcast(this.retrieveEventName, nutritionList);
                deferred.resolve(true);
            }
        ).error(
            function (data) {
                deferred.reject(data);
                $rootScope.$broadcast(this.retrieveEventName, nutritionList);
            }
        );
        return deferred.promise;
    }
}
angular.module('caloriecounterfitnessApp').service('nutritionService', ["$http", "$q", "$rootScope", NutritionService]);
