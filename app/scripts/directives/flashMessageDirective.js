'use strict';

function FlashMessageDirective ($rootScope, $interval, flashService) {
  var templateString = '\
    <div id="messages-wrapper">\
      <div class="alert alert-{{ message.type }} {{ animation }}" ng-repeat="message in flashMessages">\
        <a class="close" ng-click="message.close();" data-dismiss="alert" aria-hidden="true">&times;</a>\
        <span>\
          {{ message.text }}\
        </span>\
      </div>\
    </div>\
    ';
  return {
    restrict: 'AE',
    template: templateString,
    link: function(scope, element, attrs) {

      var messageTimeout = function () {
        for (var i in $rootScope.flashMessages) {
          if ($rootScope.flashMessages[i].type !== 'danger') {
            $rootScope.flashMessages[i].close();
          }
        }
      };

      var changeReaction = function () {
        $rootScope.flashMessages = flashService.getMessages();
        $rootScope.animation = attrs.animation || 'fade in';
        $interval(messageTimeout, 5000, 0);
      };

      $rootScope.$on('flashAlert', changeReaction);
    }

  };
}
angular.module('caloriecounterfitnessApp').directive('flashMessageDirective', ["$rootScope", "$interval", "flashService", FlashMessageDirective]);
