(function() {
    'use strict';

    angular.module('App')
        .directive('trackHead', function() {
            return {
                template: '<span class="md-subhead" style="white-space: nowrap;">Controlador {{$index+1}}</span>' +
                    '<ng-transclude layout="column" layout-align="center center"></ng-transclude>',
                transclude: true
            };
        });
})();
