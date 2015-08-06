(function() {
    'use strict';

    angular.module('App')
        .service('trackService', function($interval, arduinoService, timerService) {
            var that = this;

            this.addStep = function(track, index) {
                track.steps.splice(index, 0, {
                    temperature: undefined,
                    time: undefined,
                    alarms: []
                });
            };

            this.delStep = function(track, index) {
                track.steps.splice(index, 1);
            };

            this.play = function(track) {
                arduinoService.play(track, track.steps[0]).then(function(response) {
                    console.log('arduinoService response: ' + response);
                    track.running = true;
                    track.paused = false;
                    that.playStep(track, 0);
                    that.startLoop(track);
                });
            };

            this.stop = function(track) {
                stopLoop(track);
                arduinoService.stop(track);
                track.running = false;
                track.current_step.running = false;
                track.steps.forEach(function(step) {
                    delete step.run;
                });
            };

            this.pause = function(track) {
                arduinoService.stop(track);

                track.paused = true;
                track.current_step.paused = true;

                if (track.current_step.run.timer) {
                    track.current_step.run.timer.pause();
                }
            };

            this.unpause = function(track) {
                arduinoService.play(track, track.current_step).then(function(response) {
                    console.log('arduinoService response: ' + response);
                });

                track.paused = false;
                track.current_step.paused = false;

                if (track.current_step.run.timer) {
                    track.current_step.run.timer.unpause();
                }
            };

            this.playStep = function(track, stepIdx) {
                track.current_step_idx = stepIdx;
                track.current_step = track.steps[stepIdx];
                track.current_step.running = true;
                track.current_step.paused = false;
                track.current_step.run = {
                    "init_temp": null,
                    "curr_temp": null,
                    "curr_time": null,
                    "timer": null,
                    "alarmed": []
                };
                track.current_step.run.init_temp = track.current_step.run.curr_temp = arduinoService.getTemperature(track);
            };

            this.stopStep = function(step) {
                step.running = false;
            };

            this.forwardStep = function(track, stepIdx) {
                this.stopStep(track.current_step);
                this.playStep(track, stepIdx);
            };

            this.finish = function(track) {
                this.stopStep(track.current_step);
                stopLoop(track);
            };

            this.startBoil = function(track, stepIdx) {
                console.log('startBoil');
                var step = track.current_step;

                if (!step.run.timer) {
                    step.run.timer = timerService.new();
                    step.run.timer.start();
                }
            };

            that.startLoop = function(track) {
                track.loop = $interval(function() {
                    var step = track.current_step;

                    step.run.curr_temp = arduinoService.getTemperature(track);
                    console.log('PID[' + track.id + '].temperature: ' + step.run.curr_temp);

                    if (!step.run.timer && step.run.curr_temp >= step.temperature) {
                        // start counting, play alarms
                        step.run.timer = timerService.new();
                        step.run.timer.start();
                    }

                    if (!step.paused && step.run.timer) {
                        step.run.curr_time = step.run.timer.time() / 1000;
                        if (!step.temperature) {
                            step.run.curr_time = step.time - step.run.curr_time;
                        }
                        var next_alarm_idx = step.run.alarmed.length;

                        if (step.temperature) {
                            if (step.alarms.length > next_alarm_idx &&
                                step.run.curr_time >= step.alarms[next_alarm_idx]) {
                                /*angular.element('audio').play();*/
                                /*alarmService.play();*/
                                step.run.alarmed.push(step.alarms[next_alarm_idx]);
                            }

                            if (step.time && step.run.curr_time >= step.time) {
                                if (track.current_step_idx + 1 < track.steps.length) {
                                    that.forwardStep(track, track.current_step_idx + 1);
                                } else {
                                    that.finish(track);
                                }
                            }
                        } else { // boiling step
                            if (step.alarms.length > next_alarm_idx &&
                                step.run.curr_time <= step.alarms[next_alarm_idx]) {
                                /*angular.element('audio').play();*/
                                step.run.alarmed.push(step.alarms[next_alarm_idx]);
                            }

                            if (step.time && step.run.curr_time <= 0) {
                                if (track.current_step_idx + 1 < track.steps.length) {
                                    that.forwardStep(track, track.current_step_idx + 1);
                                } else {
                                    that.finish(track);
                                }
                            }

                        }
                    }
                }, 1000);
            }

            function stopLoop(track) {
                console.log('stop_loop');
                if (angular.isDefined(track.loop)) {
                    $interval.cancel(track.loop);
                    track.loop = undefined;
                }
            }
        });
})();
