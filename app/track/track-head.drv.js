(function() {
    'use strict';

    angular.module('App')
        .directive('trackHead', function() {
            return {
<<<<<<< HEAD
                template: '<span class="md-subhead" style="white-space: nowrap;">Controlador {{$index+1}}</span>' +
=======
                template: '<span class="md-subhead" style="white-space: nowrap;">Controller {{$index+1}}</span>' +
>>>>>>> master
                    '<ng-transclude layout="column" layout-align="center center"></ng-transclude>',
                transclude: true
            };
        });
})();
