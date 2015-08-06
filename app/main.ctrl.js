(function() {
    angular.module('App')
        .controller('MainCtrl', function($scope /*$mdDialog, $mdToast, $interval, */ , dataService) {
            var vm = this;

            dataService.getData().then(function(response) {
                vm.tracks = response.data;
            });

            vm.addStep = function(track, stepIdx) {
                $scope.$broadcast('add-step', {
                    track: track,
                    stepIdx: stepIdx
                });
            };

            vm.delStep = function(track, stepIdx) {
                console.log('del');
                $scope.$broadcast('del-step', {
                    track: track,
                    stepIdx: stepIdx
                });
            };

            vm.playPause = function(track) {
                $scope.$broadcast('play-pause', track);
            };

            vm.stop = function(track) {
                $scope.$broadcast('stop', track);
            }

            vm.forwardStep = function(track, stepIdx) {
                $scope.$broadcast('forward-step', track, stepIdx);
            };

            vm.finish = function(track) {
                $scope.$broadcast('finish', track);
            };

            vm.startBoil = function(track, stepIdx) {
                console.log('main.startBoil');
                $scope.$broadcast('start-boil', track, stepIdx);
            }

            /*$scope.$on('alarm', function(event, obj) {
                console.log(obj);
                var timer = $interval(function() {
                    document.getElementsByTagName('audio')[0].play()
                }, 1000);

                var dialog = $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Alarm: ' + obj.value + ' min')
                    .ok('OK')
                    .targetEvent(event);
                $mdDialog.show(dialog).then(function() {
                    $interval.cancel(timer);
                });
                var toast = $mdToast.simple()
                    .content('Alarm (' + obj.value + ' min)')
                    .action('OK')
                    .hideDelay(0)
                    .highlightAction(false)
                    .position('bottom right');
                $mdToast.show(toast).then(function() {
                    $interval.cancel(timer);
                });
            });*/

            /*vm.showAlarm = function(track, value) {
                console.log('showAlarm', track, value);
            }*/
        });
})();
