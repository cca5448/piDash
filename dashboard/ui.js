
var app = angular.module("Dashboard", ['ngMaterial', 'nvd3']);

app.config(function($mdThemingProvider) {

	$mdThemingProvider.definePalette('red', {
    '50': 'AF0606',
    '100': 'AF0606',
    '200': 'AF0606',
    '300': 'AF0606',
    '400': 'AF0606',
    '500': 'AF0606',
    '600': 'AF0606',
    '700': 'AF0606',
    '800': 'AF0606',
    '900': 'AF0606',
    'A100': 'AF0606',
    'A200': 'AF0606',
    'A400': 'AF0606',
    'A700': 'AF0606',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('red');
});

app.factory('updateService', function(){
	var updateService = {};

	updateService.data = {
		commands: {
			fieldOrientedDrive: false,
			lockAngleFront: false,
			lockAnglePickup: false,
			lockAngleLeftGear: false,
			lockAngleRightGear: false,
			unlockAngle: false,
			autoAlignPickup: false,
			autoAlignGear: false
		},
		motors: {
			motorLeftFront: 1,
			motorRightFront: -1,
			motorLeftRear: 1,
			motorRightRear: -1,
			encoderLeftFront: 45,
			encoderLeftRear: 45,
			encoderRightFront: 45,
			encoderRightRear: 45,
			motorClimber: 0
		},
		vision: {
			targetVisible: false,
			displacement: -34.2,
			xDistance: 0
		},
		gear: {
			isOpen: false
		},
		power: {
			batteryVoltage: 12.73,
			totalPowerUse: 28.6,
			powerLeftFront: 7.3,
			powerRightFront: 7.5,
			powerLeftRear: 7.3,
			powerRightRear: 7.4,
			powerClimber: 0.1,
			powerRio: 0.8,
			powerJetson: 2.3,
			powerLed: 1.40,
			powerPcm: 0.0,
			RioCpu: 63.3,
			RioRam: 34.6
		},
		match: {
			time: 0,
			phase: 'not started'
		},
		cameras: {

		},
		sensors: {
			gyroAngle: 74,
			ultrasonicLeft: 43,
			ultrasonicRight: 44
		},
		autoMode:{
			selectedMode: 'forward',
			availibleModes: {}
		},
		connected: false
	};

	updateService.sendValue = function(key, value){
		NetworkTables.putValue(key, value);
	};

	updateService.getValue = function(key){
		NetworkTables.getValue(key);
	};

  updateService.getProperty = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('/');
    for (var i = 0, n = a.length - 1; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  };

	updateService.onValueChanged = function(key, value, isNew){
		if (value == 'true') {
			value = true;
		} else if (value == 'false') {
			value = false;
		}

    var a = key.split('/');
    updateService.getProperty(updateService.data, key)[a[a.length - 1]] = value;
	};

	updateService.onConnection = function(connected){
		updateService.data.connected = connected;
	};

	NetworkTables.addRobotConnectionListener(updateService.onConnection, true);
	NetworkTables.addGlobalListener(updateService.onValueChanged, true);

	return updateService;
});

app.controller('uiCtrl', function($scope, updateService){
  $scope.data = updateService.data;

  /*$scope.data.power.batteryVoltage = 10.3;
  $scope.data.power.totalPowerUse = 20.6;
  $scope.data.power.powerFrontLeft = 18;
  $scope.data.power.powerFrontright = 3;
  $scope.data.power.powerBackRight = 15;
  $scope.data.power.powerBackLeft = 4;*/

});

app.controller('clockCtrl', function($scope, updateService){
  var data = updateService.data;
  $scope.data = data;

  $scope.getTime = function(){
    var minutes = data.match.time / 60;
    var seconds = data.match.time % 60;

    return (minutes < 10 ? '' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };
  $scope.getStatus = function(){
    if(data.connected)
      return 'yes';
    else
      return 'no';
  };
});

app.controller('angleLockCtrl', function($scope, updateService){
	$scope.info = {
		selected: 'off'
	};

	$scope.select = function(name){
		$scope.info.selected = name;
		updateService.sendValue('autoMode/selectedMode', name);
	};
});

app.controller('fieldOrientedCtrl', function($scope, updateService){
	$scope.info = {
		fieldOriented: true
	};

	$scope.toggleFieldOriented = function(){
		$scope.info.fieldOriented = !$scope.info.fieldOriented;
	};
});

app.controller('autoCtrl', function($scope, updateService){
	$scope.info = {
		selected: 'forward'
	};

	$scope.select = function(name){
		$scope.info.selected = name;
	};
});

app.controller('autoGearCtrl', function($scope, updateService){
		$scope.info = {

		};
});

app.controller('compassCtrl', function($scope, updateService){
  $scope.info = {
    value: updateService.data.sensors.gyroAngle * Math.PI / 180
  };
});
