﻿//filter to take a data string and prepare it for display in presentation
DataToPresentationFilter = function () {
    return function (text) {
        //removes underscores
        text = text.replace(/_/g, ' ');
        return text;
    };
};
angular.module('caloriecounterfitnessApp').filter('dataToPresentationFilter', DataToPresentationFilter);