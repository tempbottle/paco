pacoApp.controller('ExperimentCtrl', ['$scope', '$http', '$routeParams',
  '$mdDialog', '$filter', '$location', 'template',
  function($scope, $http, $routeParams, $mdDialog, $filter, $location,
    template) {

    $scope.experimentId = false;
    $scope.tabIndex = 0;
    $scope.newExperiment = false;

    if (angular.isDefined($routeParams.experimentId)) {
      if ($routeParams.experimentId == 'new') {
        $scope.experiment = angular.copy(template.experiment);
        $scope.newExperiment = true;
        $scope.tabIndex = 1;
      } else {
        $scope.experimentId = parseInt($routeParams.experimentId);
      }
    }

    if ($scope.experimentId) {
      $http.get('/experiments?id=' + $scope.experimentId).success(function(
        data) {
        $scope.experiment = data[0];
        $scope.$broadcast('experimentChange');
      });
      $scope.tabIndex = 1;
    }

    $http.get('/userinfo').success(function(data) {

      // For now, make sure email isn't bobevans999@gmail for local dev testing
      if (data.user && data.user !== "bobevans999@gmail.com") {
        $scope.user = data.user;

        if ($scope.newExperiment) {
          $scope.experiment.creator = $scope.user;
          $scope.experiment.contactEmail = $scope.user;
          $scope.experiment.admins.push($scope.user);
        }

        $http.get('/experiments?mine').success(function(data) {
          $scope.experiments = data;
        });
      } else {
        $scope.loginURL = data.login;
      }

    }).error(function(data) {
      console.log(data);
    });


    $scope.saveExperiment = function() {
      $http.post('/experiments', $scope.experiment).success(function(data) {
        if (data.length > 0) {
          if (data[0].status === true) {
            $mdDialog.show(
              $mdDialog.alert()
              .title('Save Status')
              .content('Success!')
              .ariaLabel('Success')
              .ok('OK')
            );

            if (angular.isUndefined($scope.experiment.id)) {
              $scope.experimentId = data[0].experimentId;
              $location.path('/experiment/' + $scope.experimentId);
            }

          } else {
            console.dir(data);
            var errorMessage = data[0].errorMessage;
            $mdDialog.show({
              templateUrl: 'partials/error.html',
              locals: {
                errorMessage: errorMessage
              },
              controller: 'ErrorCtrl'
            });
          }
        }
      }).error(function(data, status, headers, config) {
        console.log(data);
      });
    };

    $scope.addExperiment = function() {
      $location.path('/experiment/new');
    };

    $scope.addGroup = function() {
      $scope.experiment.groups.push(angular.copy(template.group));
    };

    $scope.remove = function(arr, idx) {
      arr.splice(idx, 1);
    };

    $scope.convertBack = function(event) {
      var json = event.target.value;
      $scope.experiment = JSON.parse(json);
    };
  }
]);


pacoApp.controller('ExpandCtrl', ['$scope', function($scope) {

  $scope.expand = false;

  $scope.toggleExpand = function(flag) {
    if (flag === undefined) {
      $scope.expand = !$scope.expand;
    } else {
      $scope.expand = flag;
    }
  }

  $scope.$on('experimentChange', function(event, args) {
    $scope.expand = true;
  });
}]);


pacoApp.controller('GroupCtrl', ['$scope', 'template', 
  function($scope, template) {

    $scope.addInput = function(event, expandFn) {
      $scope.group.inputs.push({});
      expandFn(true);
      event.stopPropagation();
    };

    $scope.addScheduleTrigger = function(event, expandFn) {
      $scope.group.actionTriggers.push(angular.copy(template.scheduleTrigger));
      expandFn(true);
      event.stopPropagation();
    };

    $scope.addEventTrigger = function(event, expandFn) {
      $scope.group.actionTriggers.push(angular.copy(template.eventTrigger));
      expandFn(true);
      event.stopPropagation();
    };
  }
]);


pacoApp.controller('InputCtrl', ['$scope', 'config', function($scope, config) {

  $scope.responseTypes = config.responseTypes;

  $scope.$watch('input.responseType', function(newValue, oldValue) {
    if ($scope.input.responseType === 'list' && 
        $scope.input.listChoices === undefined) {
      $scope.input.listChoices = [''];
    }
  });

  $scope.addChoice = function() {
    $scope.input.listChoices.push('');
  }
}]);


pacoApp.controller('TriggerCtrl', ['$scope', '$mdDialog', 'config', 'template',
  function($scope, $mdDialog, config, template) {

    $scope.scheduleTypes = config.scheduleTypes;

    $scope.addAction = function(actions, event) {
      var action = angular.copy(tempalte.action);
      action.id = actions.length;
      actions.push(action);
    }

    $scope.showSchedule = function(event, schedule) {
      $mdDialog.show({
        templateUrl: 'partials/schedule.html',
        locals: {
          schedule: schedule
        },
        controller: 'ScheduleCtrl'
      });
    };

    $scope.showAction = function(event, action) {
      $mdDialog.show({
        templateUrl: 'partials/action.html',
        locals: {
          action: action
        },
        controller: 'ActionCtrl'
      });
    };

    $scope.showCue = function(event, cue) {
      $mdDialog.show({
        templateUrl: 'partials/cue.html',
        locals: {
          cue: cue
        },
        controller: 'CueCtrl'
      });
    };
  }
]);


pacoApp.controller('ActionCtrl', ['$scope', '$mdDialog', 'config', 'action',
  function($scope, $mdDialog, config, action) {

    $scope.action = action;
    $scope.actionTypes = config.actionTypes;

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.$watch('action.actionCode', function(newValue, oldValue) {
      if (newValue) {
        action.actionCode = parseInt(action.actionCode);
      }
    });
  }
]);


pacoApp.controller('CueCtrl', ['$scope', '$mdDialog', 'config', 'cue',
  function($scope, $mdDialog, config, cue) {

    $scope.cue = cue;
    $scope.cueTypes = config.cueTypes;

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.$watch('cue.cueCode', function(newValue, oldValue) {
      if (newValue) {
        cue.cueCode = parseInt(cue.cueCode);
      }
    });
  }
]);


pacoApp.controller('ErrorCtrl', ['$scope', '$mdDialog', 'config',
  'errorMessage',
  function($scope, $mdDialog, config, errorMessage) {

    $scope.errorMessage = errorMessage;
    var lines = errorMessage.split('\n');
    var errors = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf("ERROR:") === 0) {
        errors.push(lines[i].substr(7));
      }
    }
    $scope.errors = errors;

    $scope.hide = function() {
      $mdDialog.hide();
    };
  }
]);


pacoApp.controller('ScheduleCtrl', ['$scope', '$mdDialog', 'config', 'template',
  'schedule',
  function($scope, $mdDialog, config, template, schedule) {

    $scope.schedule = schedule;
    $scope.scheduleTypes = config.scheduleTypes;
    $scope.weeksOfMonth = config.weeksOfMonth;
    $scope.esmPeriods = config.esmPeriods;
    $scope.repeatRates = range(1, 30);
    $scope.daysOfMonth = range(1, 31);

    function range(start, end) {
      var arr = [];
      for (var i = start; i <= end; i++) {
        arr.push(i);
      }
      return arr;
    }

    $scope.addTime = function(times, idx) {
      times.splice(idx + 1, 0, angular.copy(template.signalTime));
    };

    $scope.remove = function(arr, idx) {
      arr.splice(idx, 1);
    };

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.$watchCollection('schedule.days', function(days) {
      var sum = 0;
      if (days) {
        for (var i = 0; i < 7; i++) {
          if ($scope.schedule.days[i]) {
            sum += Math.pow(2, i);
          }
        }
        $scope.schedule.weekDaysScheduled = sum;
      }
    });

    $scope.$watch('schedule.scheduleType', function(newValue, oldValue) {
      if (newValue) {
        schedule.scheduleType = parseInt(schedule.scheduleType);
        if ($scope.schedule.signalTimes == undefined) {
          $scope.schedule.signalTimes = [angular.copy(template.signalTime)];
          $scope.schedule.repeatRate = 1;
        }
      }
    });
  }
]);


pacoApp.controller('SummaryCtrl', ['$scope', 'config', function($scope, config) {

  $scope.getActionSummary = function() {
    if ($scope.action.actionCode !== undefined) {
      return config.actionTypes[$scope.action.actionCode];
    } else {
      return 'Undefined';
    }
  };

  $scope.getCueSummary = function() {
    if ($scope.cue.cueCode !== undefined) {
      return config.cueTypes[$scope.cue.cueCode];
    } else {
      return 'Undefined';
    }
  };

  $scope.getScheduleSummary = function() {
    var sched = $scope.schedule;
    var str = '';

    //ispiro:using === for these comparisons breaks on schedule edit
    if (sched.scheduleType == 0) {
      if (sched.repeatRate == 1) {
        str += 'Every day';
      } else if (sched.repeatRate != undefined) {
        str += 'Every ' + sched.repeatRate + ' days'
      }
    } else if (sched.scheduleType == 1) {
      str += 'Every weekday';
    } else if (sched.scheduleType == 2) {
      if (sched.repeatRate == 1) {
        str += 'Every week';
      } else if (sched.repeatRate != undefined) {
        str += 'Every ' + sched.repeatRate + ' weeks'
      }
    } else if (sched.scheduleType == 3) {
      if (sched.repeatRate == 1) {
        str += 'Every month';
      } else if (sched.repeatRate != undefined) {
        str += 'Every ' + sched.repeatRate + ' months'
      }
    } else if (sched.scheduleType == 4) {
      str += config.scheduleTypes[4] + ', ' + sched.esmFrequency +
        ' time';
      if (sched.esmFrequency > 1) {
        str += 's per day';
      } else {
        str += ' per day';
      }
      //TODO(ispiro):Use period when model supports it
    } else if (sched.scheduleType == 5) {
      str = 'Self report only';
    } else {
      str = 'Undefined';
    }

    if (sched.scheduleType >= 0 && sched.scheduleType <= 3) {
      if (sched.signalTimes) {
        str += ', ' + sched.signalTimes.length;
        if (sched.signalTimes.length == 1) {
          str += ' time each';
        } else {
          str += ' times each';
        }
      }
    }

    return str;
  };
}]);
