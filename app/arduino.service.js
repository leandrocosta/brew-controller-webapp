(function(){
    angular
        .module('App')
        .service('arduinoService', arduinoService);

    arduinoService.$inject = ['$q'];

    function arduinoService($q) {
        this.play = function(track, step) {
            // starts PID[track.id], returns a promise
            console.log('starts PID ' + track.id + ' with temperature ' + step.temperature);
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        };

        this.stop = function(track) {
            // stops |PID[track.id], returns a promise
            console.log('stops PID ' + track.id);
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        }

        this.getTemperature = function(track) {
            return track.mock_temperature;
        };
    }
})();