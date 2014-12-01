'use strict';

function FlashService () {
  var messages = [];

  var remove = function (message) {
    var index = messages.indexOf(message);
    messages.splice(index, 1);
  };

  var message = {
    text: '',
    type: 'success',
    close: function() {
      return remove(this);
    }
  };

  this.addMessage = function (type, text) {
    var newMessage = {};
    angular.extend(newMessage, message);
    newMessage.type = (type === 'error') ? 'danger' : type;
    newMessage.text = text;
    messages.push(newMessage);
  };

  this.getMessages = function() {
    return messages;
  };

  this.flush = function () {
    messages = [];
  };
}
angular.module('caloriecounterfitnessApp').service('flashService', [ FlashService]);
