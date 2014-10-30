function TokenService($http, $q, $cookies, $rootScope) {

    var tokenData = {};
    var retrieveEventName = 'tokenService.retrieveToken';
    var dropEventName = 'tokenService.dropToken';

    this.get = function (key) {
        return tokenData[key] || null;
    }

    this.dropToken = function () {
        delete $cookies.ccTokenKey;
        delete $cookies.ccTokenUserId;
        $rootScope.$broadcast(dropEventName, tokenData);
    }

    this.retrieveToken = function (email) {
        //if the cookie data exists then use the cookie if not, make remote call
        if (angular.isDefined($cookies.ccTokenKey) && angular.isDefined($cookies.ccTokenUserId)) {
            tokenData = {
                "key" : $cookies.ccTokenKey,
                "user": $cookies.ccTokenUserId
            };
        } else {
            $http.jsonp(
                settings.ccEndpoint.url + "token/",
                {
                    params: {
                        email: email,
                        format: 'jsonp',
                        callback: 'JSON_CALLBACK'
                    },
                }
            ).success(
                function (data) {
                    tokenData = data;
                    $cookies.ccTokenKey = tokenData.key;
                    $cookies.ccTokenUserId = tokenData.user;
                    $rootScope.$broadcast(retrieveEventName, tokenData);
                }
            ).error(
                function (data) {
                    if (
                        !angular.isObject(data) ||
                        !data.detail
                    ) {
                        tokenData = ($q.reject("An unknown error occurred."));
                    }
                    tokenData = ($q.reject(data.detail));
                    $rootScope.$broadcast(retrieveEventName, tokenData);
                }
            );
        }
    }
}
angular.module('caloriecounterfitnessApp').service('tokenService', ["$http", "$q", "$cookies", "$rootScope", TokenService]);
