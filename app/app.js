(function() {
    angular.module('App', ['ngMaterial', 'ngMdIcons', 'ui.utils.masks'])
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('indigo')
                .accentPalette('blue-grey')
                .warnPalette('red')
                .backgroundPalette('grey');
        })
        .filter('secondsToDateTime', function() {
            return function(seconds) {
                var d = new Date(0, 0, 0, 0, 0, 0, 0);
                d.setSeconds(seconds);
                return d;
            };
        });
})();
