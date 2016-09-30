/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 
 // -- Define Global Variables -- //
var address,
	btnPressed,
	foundDevices = [],
	foundRssi = [],
	deviceToTry = 0,
	addressTried,
	syncStartTime,
	syncEndTime,
	platform,
	deviceSetup = false,
	packetCounter,
	expectedCount = 0,
	accelX = [],
	accelY = [],
	accelZ = [],
	tones = [],
	sigStrength = [],
	motionPerSample = [],
	desiredName = "SSV1_00000",
	needCurrentVolume = true,
	volumeSetDisabled = true,
	currentVolume,
	currentBalance,
	volumeUpdateTime = 0,
	balanceUpdateTime = 0,
	serviceUuid = "ffe0",
	charUuid = "ffe1",
	lastSleepSummary, // Can probably remove this here...
	sleepState, // Can probably remove this here...
	trends, // Can probably remove this here...
	lastSleep = {},
	secondsPerReading = 15, // can differ from sample rate since the fastest we can get TGAM data is 1 Hz (i.e. if sampleRate is set to < 1, we'll see 1 Hz)
	sampleRate = 15,
	dataTime,
	dayData = [], 	// array with 7 day objects
	weekData = [], 	// array with 7 week objects
	monthData = [], // array with 7 month objects
	currentWeekAvgs = {},
	currentMonthAvgs = {},
	allTimeAvgs = {},
	sevenDayAvgs = {},
	sevenWeekAvgs = {},
	sevenMonthAvgs = {},
	currentWrite = "none",
	promptToConnect = false,
	reconnect = false,
	afterForcedDisconnect = false,
	scorePlotOptions,
	orientationPlotOptions,
	neverConnected = false,
	connected = false,
	dataStored = "false",
	settingsConnect = false,
	forgettingDevice = false,
	accidentalDisconnect = false,
	startBtnPressed = false,
	endBtnPressed = false,
	emailData = "true",
	globalData = [],
	currentTrend = "daily",
	continueSync = false,
	myDataTimeout,
	myScroll,
	labelAwake = "awake",
	labelLight = "light",
	labelDeep = "deep",
	labelLeft = "left",
	labelUp = "up",
	labelRight = "right",
	labelOtherOrientations = "other orientations", 
	labelStanding = "standing",
	labelDown = "down",
	labelHeadstand = "headstand",
	labelSleepLevel = "sleep level",
	labelHeadOrientation = " head orientation",
	labelL7sleeps = "last 7 sleeps",
	labelL7weeks = "last 7 weeks",
	labelL7months = "last 7 months",
	labelAllTime = "all-time",
	labelAvgL7sleeps = "average for last 7 sleeps",
	labelAvgL7weeks = "average for last 7 weeks",
	labelAvgL7months = "average for last 7 months",
	labelAvgAllTime = "average for all time",
	labelHours = "hrs", 
	labelMins = "mins", 
	labelMin = "min", 
	labelConnect = "connect",
	labelDisconnect = "disconnect",
	labelConnecting = "connecting",
	labelConnected = "connected",
	labelProcessing = "processing",
	labelDisconnecting = "disconnecting",
	labelStarting = "starting",
	labelRetrieving = "retrieving",
	labelEndSleep = "End Sleep",
	labelStartSleep = "Start Sleep",
	labelTime = "%l<br>%p",
	labelTimeAlt = "%h%:%M% %P%",
	labelWeekly = "%m1%/%d1%-<br>%m2%/%d2%",
	labelDaily = "%m%/%d%",
	labelYear = "%m%/%d%/%y%",
	labelDisconnectMessage = "You're connected. To disconnect, press the button below",
	labelConnectMessage = "To access volume controls, connect with the button below",
	labelSelectRating = "Select your rating below",
	labelRatingError = "Please select a rating first",
	labelEnglish = "English | English",
	labelChinese = "中文 | Chinese",
	labelCurrentLanguage = "English",
	labelMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	/*-ADD IN NEW LABELS (FOR TUTORIAL, ETC) HERE-*/
	labelTut1Title = "Welcome to Sleep Shepherd",
	labelTut1P = "This interactive tutorial will help you set up and learn about your Sleep Shepherd",
	labelTut1Setup = "Set Up",
	labelTut1Later = "Later",
	labelTut2Title = "Connect to your device",
	labelTut2P1 = "Turn on your Sleep Shepherd using the power switch located at the top of the case",
	labelTut2P2 = "After the blue LED stops blinking, the device is ready to function",
	labelTut2P3 = "Press the Connect button to initiate a bluetooth connection",
	labelTut3Title = "Put on your headband",
	labelTut3P1 = "Make sure the conductive fabric ear sensors sit over both ears and the forehead sensor is just above your left eyebrow",
	labelTut3P2 = "Make sure the sensors contact skin, not hair",
	labelTut3P3 = "When you're done adjusting, press Next",
	labelNext = "Next",
	labelTut4Title = "Check Signal Strength",
	labelTut4P1 = "The Sleep Shepherd can measure your brain activity, but not without a good signal!",
	labelTut4P2 = "Press Next to continue",
	labelTut4P3 = "Try to stay still while your signal strength is tested.",
	labelTut4GoodMessage = "Receiving adequate signal! Pull a sensor away from your head and watch signal strength drop",
	labelTut4BadMessage = "Make sure all three sensors have firm pressure against skin. Hair touching a sensor can block a good signal",
	labelTut4BadMessage2 = "If needed, use water to dampen the skin of the ears and forehead to increase signal <br> Do NOT use water on the Sleep Shepherd",
	labelBad = "Poor",
	labelOkay = "Okay",
	labelGood = "Good",
	labelVeryGood = "Very Good",
	labelTut5Title = "Adjust volume",
	labelTut5P1 = "Position the speakers within their fabric pockets so that each speaker aligns with the natural indentation of your ear.",
	labelTut5P2 = "Use the slider to se the volume to your preferred level (can be adjusted later)",
	labelTut5P3 = "Make sure you can hear the tones at the same volume in each ear.",
	labelTut6Title = "Track Head Position",
	labelTut6P1 = "The Sleep Shepherd is able to track head position throughout the night",
	labelTut6P2 = "Now, lay down, alternate sleeping positions and watch the Sleep Shepherd automatically track your head position",
	labelTut7Title = "Track Your Sleep",
	labelTut7P1 = "You can start tracking your sleep from anywhere in the app. Simply press the blue Start Sleep button at the bottom of any page.",
	labelTut7P2 = "As soon as you wake up, be sure to sync new sleep data by pressing the yellow End Sleep button at the bottom of any page",
	labelTut8Title = "That's it! You're Ready!",
	labelTut8P = "You're ready to start using your Sleep Shepherd! Press Finish to begin exploring the app",
	labelFinish = "Finish",
	labelStartImg = "Start Sleep.PNG",
	labelEndImg = "End Sleep.PNG",
	labelOn = "On",
	labelOff = "Off",
	labelAlarmError = "Please set alarm for at least 10 minutes from now",
	labelAlarmReminder = "Alarm set for: %h% hours %m% minutes from now",
	labelPowerOnImg = "Power On.png",
	labelSpeakerPositionImg = "Speaker Positioning.png",
	labelSensorDiagramImg = "Sensor Diagram.png",
	labelDataCheck = "It looks like there's %h% hours of data from %m%/%d%/%y% on the device. Would you like to retrieve this data, or start recording new data?",
	labelBack = "Back",
	labelWithinNorm = "Within norm",
	labelEarlier = "Earlier than usual",
	labelLater = "Later than usual",
	labelRem = "REM",
	labelNoEEG = "No EEG",
	labelPoorEEG = "Poor EEG Signal",
	connectBtnMode = "connect",
	accelInterval,
	accelIntervalTutorial,
	sigStrengthInterval,
	toLanguage = "",
	yesConfirmHat = false,
	yesReconnect = false,
	connectTimeout,
	notEnoughData = false,
	disconnecting = false,
	posStates = {
        DOWN : 1,
        LEFT : 2,
        UP : 3,
        RIGHT : 4,
        STANDING : 5,
        HEADSTAND : 6
    },
	oldPosition,
	homeSetUp = false,
	openTutorialPopup = false,
	volumeBtnClicked = false,
	alarmBtnClicked = false,
	alarmOnOffClicked = false,
	alarmTurnedOn = false,
	retrieveDataClicked = false,
	startRecordingClicked = false,
	globalAlarmTime = 86400000,
	currentLanguage = "en",
	storedDataLength = 0,
	closeInTutorial = false,
	bluetoothEnabled = false,
	splashHidden = false,
	errorCode = ''
	;


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {		
		$.mobile.hashListeningEnabled = false;
		platform = device.platform;
		// -- ENABLE BACKGROUND MODE --//
		cordova.plugins.backgroundMode.enable();
		
		 //alert('Device Ready');
		if (typeof jQuery == 'undefined') {  
			alert('jQuery has not been loaded!');  
		}	
		
		// $('#toHome').on('click',function(){
			// $('#connectingPopup').popup('open');
		// });
		
		// Load Home Page: Resize, iScroll, i18n
		//loadHomePage();
		
		
		// $(document).on('click','.tutorialReturn',function(){
			// $('.ui-popup').popup('close');
			// setTimeout(function(){
				// $('#tutorialTest').popup('open');
			// },100);
		// });
		//localStorage.tutorialDone = "false";
		//alert(homeSetUp+" "+localStorage.tutorialDone);
		if(!homeSetUp && ((localStorage.tutorialDone === "false") || !localStorage.tutorialDone) ){
			// alert('boom! first startup');
			// setTimeout(function(){
				// $('#tutorialPopup').popup('open');
			// },3000);
			openTutorialPopup = true;
		}
		
		
		
		if (device.platform == "iOS"){
			StatusBar.backgroundColorByHexString("#33495D");
		}
		//--------------- Intial setup: element resizing, iScroll loading, popup instanitation, Highcharts settings/colors----------------//
		
		
		if( localStorage.tutorialDone !== "true"){
			// alert('in tutorialDone conditional');
			// navigator.splashscreen.hide();
			// resizeTutorial();
		}else{
		}
		
		$(document).on('click','#tutorialStep2',function(){
			var newContent = "<h3>"+labelTut2Title+"</h3><p>"+labelTut2P1+"</p><img src='img/"+labelPowerOnImg+"'  style='width:100%'/><p>"+labelTut2P3+"</p>";
			var newFooter = "<div id='tutorialConnect' class='ui-btn clear' style='margin:0 0 1em 0; width:60%;'>"+labelConnect+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage1' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialConnect' style='margin:0 0 1em 0; width:100%;'>"+labelConnect+"</div></div><div style='display:inline-block;width:20%'></div>";
			$('#tutorial-image').css('display','none'); //prop('src','img/Power On.png');
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
		});
		
		$(document).on('click','#backToPage2',function(){
			clearInterval(sigStrengthInterval);
			//alert(sigStrengthInterval);
			//clearInterval(accelInterval);
			setTimeout(function(){
				//alert('before clearing timeout');
				clearInterval(sigStrengthInterval);
				bluetoothle.disconnect(disconnectSuccess,disconnectFail,{"address":address});
			},300);
			var newContent = "<h3>"+labelTut2Title+"</h3><p>"+labelTut2P1+"</p><img src='img/"+labelPowerOnImg+"'  style='width:100%'/><p>"+labelTut2P2+"</p><p>"+labelTut2P3+"</p>";
			var newFooter = "<div id='tutorialConnect' class='ui-btn clear' style='margin:0 0 1em 0; width:60%;'>"+labelConnect+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage1' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialConnect' style='margin:0 0 1em 0; width:100%;'>"+labelConnect+"</div></div><div style='display:inline-block;width:20%'></div>";
			$('#tutorial-image').css('display','none'); //prop('src','img/Power On.png');
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
		});
		
		$(document).on('click','#backToPage3',function(){
			clearInterval(sigStrengthInterval);
			var newContent = "<h3>"+labelTut3Title+"</h3><p><img src='img/"+labelSensorDiagramImg+"' style='width:100%'/></p><p>"+labelTut3P1+"</p><p>"+labelTut3P2+"</p><p>"+labelTut3P3+"</p>";
			var newFooter = "<div id='tutorialStep3' class='ui-btn clear' style='margin:1em; width:60%;'>"+labelNext+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage2' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep3' style='margin:0 0 1em 0; width:100%;'>"+labelNext+"</div></div><div style='display:inline-block;width:20%'></div>";
			$('#tutorial-image').css('display','none');
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
		});
		
		/* $(document).on('click','#tutorialConnect',function(){
			$('#connectingPopup').popup('open');
			bluetoothle.startScan(scanSuccess, scanFail,null);
		if (localStorage.alarmOn === "true"){
			$('#alarmTime, #alarmOnOff').addClass('on');
			$('#alarmOnOff').html('On');
		}else{
			//$('#alarmTime, #alarmOnOff').removeClass('on');
			$('#alarmOnOff').html('Off');
		}
		
		
		//alert($('.ui-header').height());
				resize();
				//$('.pieLabel').height( $('.pieLabel').width());		
				//var headMargin = $('#sleeplab .content .center ').height();
				//var headHeight = $('#head').height();
				//alert('after resize');
				loadiScroll(); 		// iScroll Stuff
				//alert('after iScroll');
				
				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
				
				// Setup i18n 
				
				var options ={   
				   lng: "en" ,  
				   resGetPath: 'locales/__lng__/__ns__.json'
				};

				// Initial Translation
				i18n.init(options, function() {
					$("#home").i18n(); //.navbar, #lastsleep, #sleeplab, #trends
					//alert('here');
					//Grab values for dynamically loaded content (i.e. plot labels, loading widgets, etc.);
					loadLabels();
					$('#languageBtn').html(labelCurrentLanguage);
					// Pull graph data from localStorage and update plots
					loadPlots();
					
				
						   
				});
				
				//alert('after i18n');
				
				//alert(i18n.t("lastsleep.legend.legend1"));

			setTimeout(function(){
				scanOver();
				//bluetoothle.stopScan(stopSuccess,stopFail)
			
			},1000);
			
		}); */
		
		if (localStorage.alarmTime){
			updateAlarmDisplay(retrieveAlarm(parseInt(localStorage.alarmTime)));
		}else{
			updateAlarmDisplay(retrieveAlarm(7*3600*1000));
		}
		
		$(document).on('click','#tutorialConnect',function(){
			//alert('get to click handler');
			/* promptToConnect = false;
			if (address){
				alert('in if(address)');
				bluetoothle.isConnected(isConnectedCallback, {"address":address}); // can only be called successfully IF ADDRESS IS KNOWN!!!
				//alert('setting connectTimeout on start sleep click-'+btnHit);
				connectTimeout = setTimeout(function(){
					//alert('In connectBtn click handler with address truthly?');
					checkConnection();
				}, 3000);
			}else{ */
				$('#connectingPopup').popup('open');
				deviceSetup = false;
				//alert('no local storage');
				var d = new Date();
				syncStartTime = d.getTime();
				//alert('before scan');
				bluetoothle.startScan(scanSuccess, scanFail,null);

				setTimeout(function(){
					scanOver();
					//bluetoothle.stopScan(stopSuccess,stopFail)
				
				},1000);
			/* } */
			
		});
		
		$(document).on('click','#backToPage1',function(){
			var newContent = "<h1 style='text-align:center;margin-bottom:0;text-shadow:none'>"+labelTut1Title+"</h1><p>"+labelTut1P+"</p>";
			var newFooter = "<div style='display:inline-block;width:20%'></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep2' style='margin:0 0 1em 0; width:100%;'>"+labelTut1Setup+"</div></div><div style='display:inline-block;width:20%'><a href='#home' id='toHome' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelTut1Later+"</a></div>";
			$('#tutorial-image').css('display','inline');
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
		});
		
		$(document).on('click','#tutorialStep3, #backToPage4',function(){
			//var newContent = "<h3>Check signal strength</h3><p>The Sleep Shepherd can measure your brain activity, but not without a good signal!</p><div class='center'><div id='sigContainer' style=''><div class='vert-spacer'></div><div id='signalStrengthCircle' style='display:inline-block;vertical-align:middle'>Bad</div></div></div><p id='signalTip'>Make sure all three sensors are touching skin. Hair touching a sensor can block a good signal</p><p>Press Next to continue</p>";
			var newContent = "<h3>"+labelTut4Title+"</h3><p>"+labelTut4P1+"</p><p>"+labelTut4P3+"</p><div class='center'><div id='sigContainer1' class='sigContainer off' style=''><div class='vert-spacer'></div><div class='signalStrengthCircle' style='display:inline-block;vertical-align:middle'></div></div><div id='sigContainer2' class='sigContainer off' style=''><div class='vert-spacer'></div><div class='signalStrengthCircle' style='display:inline-block;vertical-align:middle'></div></div><div id='sigContainer3' class='sigContainer off' style=''><div class='vert-spacer'></div><div class='signalStrengthCircle' style='display:inline-block;vertical-align:middle'></div></div></div><div class='center'><div class='indLabel' style='display:inline-block;width:33%;text-align:center'>"+labelBad+"</div><div class='indLabel' style='display:inline-block;width:33%;text-align:center'>"+labelGood+"</div><div class='indLabel' style='display:inline-block;width:33%;text-align:center'>"+labelVeryGood+"</div></div><p id='signalTip'>"+labelTut4BadMessage+"<br>"+"<br>"+labelTut4BadMessage2+"</p><p>"+labelTut4P2+"</p>";
			var newFooter = "<div id='tutorialStep4' class='ui-btn clear' style='margin:0 0 1em 0; width:60%;'>"+labelNext+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage3' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep4' style='margin:0 0 1em 0; width:100%;'>"+labelNext+"</div></div><div style='display:inline-block;width:20%'></div>";
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
			var windowWidth = $(window).width();
			$('.sigContainer').width(windowWidth/6).height(windowWidth/6);
			$('.indLabel').width(windowWidth/6);
			$('.signalStrengthCircle').css('font-size', windowWidth/20+'px');
			clearInterval(sigStrengthInterval);
			sigStrengthInterval = setInterval(function(){
				getSignalStrength();
			},1000);
		});
		
		$(document).on('click','#tutorialStep4, #backToPage5',function(){
		
			oldPosition = null;
			clearInterval(accelIntervalTutorial);
			var newContent = "<h3>"+labelTut5Title+"</h3><div style='display:inline-block;width:60%;vertical-align:top;padding-right:10px'><p>"+labelTut5P1+"</p></div><img src='img/"+labelSpeakerPositionImg+"' style='display:inline-block;width:40%;vertical-align:top;' /><p>"+labelTut5P2+"</p>			<div style='padding-left: 1em;padding-right: 1em'><div style='display:inline-block;width:12.5%;vertical-align:middle;text-align:left;'><i class='fa fa-volume-down'></i></div><div style='display:inline-block;width:75%;vertical-align:middle;' id=''><input type='range' id='tutorialVolume' data-theme='a' class='ui-hidden-accessible' min='0' max='100' step='10' /></div><div style='display:inline-block;width:12.5%;vertical-align:middle;text-align:right'><i class='fa fa-volume-up'></i></div><p>"+labelTut5P3+"</p>			<div style='display:inline-block;width:12.5%;vertical-align:middle;text-align:left'><b>L</b></div><div style='display:inline-block;width:75%;vertical-align:middle;' id='vol2container'><input type='range'  data-theme='a' id='tutorialBalance' class='ui-hidden-accessible'  min='-20' max='20' step='4' /></div><div style='display:inline-block;width:12.5%;vertical-align:middle;text-align:right;'><b>R</b></div></div>";
			var newFooter = "<div id='tutorialStep5' class='ui-btn clear' style='margin:0 0 1em 0; width:60%;'>"+labelNext+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage4' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep5' style='margin:0 0 1em 0; width:100%;'>"+labelNext+"</div></div><div style='display:inline-block;width:20%'></div>";

			//$('#tutorial-image').prop('src','img/Speaker Positioning.png');
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
			needCurrentVolume = true;
			getVolume();
		});
		
		$(document).on('click','#tutorialStep5, #backToPage6',function(){
			clearInterval(sigStrengthInterval);
			var newContent = "<h3>"+labelTut6Title+"</h3><p class=''>"+labelTut6P1+"</p><p>"+labelTut6P2+"</p><div class='center'><div id='cf7' class='shadow'><img class='opaque' src='img/head-down.png' /><img src='img/head-left.png' /><img src='img/head-right.png' /><img src='img/head-standing.png' /> <img src='img/head-up.png' /><img src='img/head-upside-down.png' /></div><div id='tutorialOrientation'></div></div>";
			var newFooter = "<div id='tutorialStep6' class='ui-btn clear' style='margin:0 0 1em 0; width:60%;'>"+labelNext+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage5' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep6' style='margin:0 0 1em 0; width:100%;'>"+labelNext+"</div></div><div style='display:inline-block;width:20%'></div>";
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			$('#cf7').height($('#cf7').width());
			resizeTutorial();
			accelIntervalTutorial = setInterval(function(){
				getAccel();
			},200);
		});
		
		$(document).on('click','#tutorialStep6, #backToPage7',function(){
			oldPosition = null;
			clearInterval(accelIntervalTutorial);
			var newContent = "<h3>"+labelTut7Title+"</h3><p style='display:inline-block; width:50%;margin: 0; padding: 5px !important;vertical-align: top'>"+labelTut7P1+"</p><p style='display:inline-block; width:50%; margin: 0 ;padding: 5px !important;vertical-align: top;margin-bottom: 3px;'>"+labelTut7P2+"</p><img style='width:40%;margin-left:7%' src='img/"+labelStartImg+"' /><img style='width:40%;margin-left:6%;' src='img/"+labelEndImg+"' />";
			var newFooter = "<div id='tutorialStep7' class='ui-btn clear' style='margin:0 0 1em 0; width:60%;'>"+labelNext+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage6' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep7' style='margin:0 0 1em 0; width:100%;'>"+labelNext+"</div></div><div style='display:inline-block;width:20%'></div>";
			$('#tutorial-image').css('display','none');
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
		});
		
		$(document).on('click','#tutorialStep7',function(){
			var newContent = "<h3>"+labelTut8Title+"</h3><p>"+labelTut8P+"</p>";
			var newFooter = "<div id='finishTutorial' class='ui-btn clear' style='margin:0 0 1em 0; width:60%;'>"+labelFinish+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage7' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='finishTutorial' style='margin:0 0 1em 0; width:100%;'>"+labelFinish+"</div></div><div style='display:inline-block;width:20%'></div>";
			$('#tutorial-image').css('display','inline');
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
		});
		
		$(document).on('pagecontainerbeforeshow',function(event, ui){			
			//alert("in before show "+ui.toPage[0].id);
			if (ui.toPage[0].id === "home"){
				$('#loadingCover').popup('open');
			}else{
				
			}
		}); 
		
		
		
		 $(document).on('pagecontainershow',function(event, ui){
			//alert("in  show "+ui.toPage[0].id);
			if (ui.toPage[0].id === "home"){
				//alert('before home load');
				loadHomePage();
				$('#forgetDevice').removeClass('noDisplay');	
				}else{
					$('.ui-popup').popup('close');
				}
		}); 
		
	 	$(document).on('pagecontainertransition',function(event, ui){
			//alert('in transition');
			if (ui.toPage[0].id === "home"){
				
				//$('.pieLabel').height(232);
			}
		});  
	 	
		$(document).on('pagecontainerbeforechange',function(){
			//alert('pagecontainerbeforechange');
		}); 
		
		// Instantiate popups

		$('#errorPopup, #dataCheckPopup,#alarmWarningPopup,#forceReconnectPopup,#alarmReminderPopup,#alarmPopup,#volumePopup,#tutorialPopup,#reconnectPopup, #confirmHatPopup, #connectPopup, #timeoutPopup, #noDevicesPopup, #noDataPopup, #forgetPopup, #startPopup, #endPopup, #noSavedPopup, #ratingPopup, #syncFailPopup, #algPrefPopup, #bluetoothPopup, #loadingPopup, #lastSleepHelp, #sleepLabHelp, #trendsHelp, #settingsHelp,#languageHelp, #startingPopup, #processingPopup, #retrievingPopup, #connectingPopup, #disconnectingPopup,#changingPopup, #loadingCover').enhanceWithin().popup({positionTo: "window"});
				
		// add in center line to volume balance slider
		$('#vol2container .ui-slider .ui-slider-track').append("<div style='width:50%;height:100%;border-right:1px solid #BBB;'></div>");
		
		$('#toHome').on('click',function(){
			//alert('here');
			// localStorage.tutorialDone = "true";
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");
			
			//$('.ui-popup').popup('close');
			
		});
		
		$('.toFakePage').on('click',function(){
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#fakePage");
		});
		
		$('#returnHome').on('click',function(){
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");
		});
		
		
		
		$(document).on('click','#finishTutorial',function(){
			//alert('here');
			volumeSetDisabled = true;
			localStorage.tutorialDone = "true";
			bluetoothle.disconnect(disconnectSuccess,disconnectFail,{"address":address});
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");
		});
		
		 $('#headerLogo').on('click',function(){
			/* localStorage.tutorialDone = "false";
			var newContent = "<h1 style='text-align:center;margin-bottom:0;text-shadow:none'>Welcome to <br>SleepHat</h1><p>This interactive tutorial will help you set up and learn about your Sleep Shepherd</p>";
			var newFooter = "<div style='display:inline-block;width:20%'></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep2' style='margin:0 0 1em 0; width:100%;'>Set Up Device</div></div><div style='display:inline-block;width:20%'><a href='#home' id='toHome' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >Later</a></div>";
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			resizeTutorial();
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#tutorialTest");
			//setWakeFlag();
			setWakeTime(6000); */
			
			//getVersionNumber();
		}); 
		
		
		
		//--------------- Handle non-BLE button clicks: help btn, email flip btn,  popup btns, slider events, on page button events  ----------------//
		
		
		// Help btn
		
		$('#openHelp').on('touchend',function(){
				//alert('here');
				var currentPage = myScroll.currentPage.pageX;
				switch (currentPage){
					case 0:
						$('#lastSleepHelp').popup('open');
					break;
					case 1:
						$('#sleepLabHelp').popup('open');
					break;
					case 2:
						$('#trendsHelp').popup('open');
					break;
					case 3:
						$('#settingsHelp').popup('open');
					break;
				}
			});	
		
		// Email flip button
		
		if (localStorage.emailData === "true"){
			emailData = localStorage.emailData;
			//alert("in the local storage check: "+emailData);
			if (emailData === "true"){
				$("#email-flip").val('true').slider('refresh');
			}else if (emailData === "false"){
				$("#email-flip").val('false').slider('refresh');
			}
		}else{
			emailData = "false";
			localStorage.emailData = "false";
		}
		
		$('#email-flip').on('change',function(){
			//alert( $('#email-flip').val() );
			if ($('#email-flip').val() === "true"){
				emailData = "true";
				localStorage.emailData = emailData;
			}else{
				emailData = "false";
				localStorage.emailData = emailData;
			}
			//alert(emailData);
		});	
		
		// Popup buttons
		
		$('#closeLShelp').on('touchend',function(){
			$('#lastSleepHelp').popup('close');
		});
		
		$('#closeSLhelp').on('touchend',function(){
			$('#sleepLabHelp').popup('close');
		});
		
		$('#closeThelp').on('touchend',function(){
			$('#trendsHelp').popup('close');
		});
		
		$('#closeShelp').on('touchend',function(){
			$('#settingsHelp').popup('close');
		});
		
		$('#closeBluetooth').on('touchend',function(){
			$('#bluetoothPopup').popup('close');
		});
		
		$('#closeError').on('touchend',function(){
			$('#errorPopup').popup('close');
		});
		
		$('#closeTutorial').on('touchend',function(){
			$('#tutorialPopup').popup('close');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#tutorialTest");
		});
		
		$('#tutorialTest').on('pagebeforeshow',function(){
			resizeTutorial();
		});

		$('#closeVolume').on('touchend',function(){
			volumeBtnClicked = false;
			$('#volumePopup').popup('close');
		});
		
		$('#openLShelp').on('touchend',function(){
			$('#lastSleepHelp').popup('open');
		});
		
		$('#openSLhelp').on('touchend',function(){
			$('#sleepLabHelp').popup('open');
		});
		
		$('#openThelp').on('touchend',function(){
			$('#trendsHelp').popup('open');
		});
		
		$('#volumePopup').on('popupafterclose',function(){
			if (connected){
				bluetoothle.disconnect(disconnectSuccess,disconnectFail,{"address":address});
			}
		});
		
		$('#volumePopup').on('popupafteropen',function(){
			getVolume();
		});
		
		$('#retrieveData').on('touchend',function(){
			retrieveDataClicked = true;
			endBtnPressed = true;
			sendEndCommand();
			clearTimeout(myDataTimeout);
			myDataTimeout = setTimeout(checkForNewData, 1000);
		});
		
		$('#closeDataCheck').on('touchend',function(){
			$('.ui-popup').popup('close');
		});
		
		$('#dataCheckPopup').on('popupafterclose',function(){
			startBtnPressed = false;
			//alert(connected+" "+startRecordingClicked+" "+retrieveDataClicked)
			if (connected && !startRecordingClicked && !retrieveDataClicked){
				//alert('we still connected? we shouldnt be...');
				
				bluetoothle.disconnect(disconnectSuccess,disconnectFail,{"address":address});
			}
		});
		
		$('#alarmPopup').on('popupafterclose',function(){
			if (connected){
				bluetoothle.disconnect(disconnectSuccess,disconnectFail,{"address":address});
			}
		});
		
		$('#startRecording').on('touchend',function(){
			startRecordingClicked = true;
			sendStartCommand();
		});
		
		$('#volumeDescription').on('click', function(){
			// sendDataRecordingCmd();
			//sendTurnOffRecordCmd();
		});
		
		// Open Rating Popup
		//$('#ratingPopup').popup('open');
		
		// $('#main-pie').on("click",function(){
			//$('#lastSleepHelp').popup('open');
		// });
		
		$('.cloudBtn').on("click",function(){
			$('.cloudBtn').removeClass('hover-low hover-mid hover-high');
			var number = $(this).prop('id').charAt(6), classToAdd;
			//alert(number);
			if (number == 1){
				classToAdd = 'hover-low';
			}else if(number == 5){
				classToAdd = 'hover-high';
			}else{
				classToAdd = 'hover-mid';
			}
			for (i = 1 ; i <= number ; i++){
				$('#cloud-'+i).addClass(classToAdd);
			}
		});
		
		$('#yesReconnect').on("click",function(){
			yesReconnect = true;
			$('#reconnectPopup').popup('close');
			
		});
		
		$('#yesForceReconnect').on("click",function(){
			$('#forceReconnectPopup').popup('close');
			
		});

		$('#forceReconnectPopup').on('popupafterclose',function(){
				//$('#connectingPopup').popup('open');
				settingsConnect = true;
				//$.mobile.loading('show', {text: labelConnecting,textVisible: true, theme:'b'});
				/* bluetoothle.isConnected(isConnectedCallback, {"address": address});
				connectTimeout = setTimeout(function(){
					checkConnection();
				}, 2000); */
				
				// Close this connection 
				//alert('before close '+address);
				
				bluetoothle.close(closeSuccess,closeFail,{"address":address});
				
				
				/* if (address){
					bluetoothle.close(closeSuccess,closeFail,{"address":address});
				}else{
					bluetoothle.startScan(scanSuccess, scanFail,null);

					setTimeout(function(){
						//alert('timeout');
						//$.mobile.loading('hide');
						scanOver();
						//bluetoothle.stopScan(stopSuccess,stopFail)
					
					},1000);
				} */
				
		});
		
		$('#noReconnect').on("click",function(){
			yesReconnect = false;
			$('#reconnectPopup').popup('close');
		});
		
		$('#reconnectPopup').on('popupafterclose',function(){
			if (yesReconnect === true){
				$('#connectingPopup').popup('open');
				reconnect = true;
				settingsConnect = true;
				//$.mobile.loading('show', {text: labelConnecting,textVisible: true, theme:'b'});
				bluetoothle.isConnected(isConnectedCallback, {"address": address});
				connectTimeout = setTimeout(function(){
					checkConnection();
				}, 2000);
			}else{
				var activePage = $('body').pagecontainer('getActivePage').prop('id');
				if (activePage === 'home'){
					$('#volumeControl').slider('disable').slider('refresh');
					$('#volumeBalance').slider('disable').slider('refresh');
					$('#startBtn, #endBtn').addClass("ui-state-disabled");
					$("#connectBtn").removeClass("ui-state-disabled");
					$("#cBtn").removeClass("ui-state-disabled").html(labelConnect);
				}
				

				promptToConnect = false;
				bluetoothle.close(closeSuccess, closeFail, {"address":address});
			}
		});
		
		
		$('#yesConnect').on("click",function(){
			$('#connectPopup').popup('close');
			settingsConnect = true;
			if (address){
				if (promptToConnect && neverConnected){
					//$.mobile.loading('show', {text: labelConnecting,textVisible: true, theme:'b'});
					//alert('before connect');
					bluetoothle.connect(connectSuccess, connectFail, {"address": address});
				}else if(promptToConnect){
					//$.mobile.loading('show', {text: labelConnecting,textVisible: true, theme:'b'});
					bluetoothle.reconnect(connectSuccess, connectFail, {"address":address});
				}
				
				connectTimeout = setTimeout(function(){
					checkConnection();
				}, 2000);
			}else{
				//$.mobile.loading('show', {text: labelConnecting,textVisible: true, theme:'b'});
				bluetoothle.startScan(scanSuccess, scanFail,null);

				setTimeout(function(){
					//alert('timeout');
					//$.mobile.loading('hide');
					scanOver();
					//bluetoothle.stopScan(stopSuccess,stopFail)
				
				},1000);
			}
			
			
			
		});
		
		$('#noConnect').on("click",function(){
			$('#connectPopup').popup('close');
			promptToConnect = false;
		});
		
		
		$('#yesConfirmHat').on("click",function(){
			//alert('click for yes confirm');
			yesConfirmHat = true;
			$('#confirmHatPopup').popup('close');
		});
		
		$('#noConfirmHat').on("touchend",function(){
			//alert('click for no confirm');
			yesConfirmHat = false;
			startBtnPressed = false;
			endBtnPressed = false;
			disconnecting = false;
			forgettingDevice = false;
			notEnoughData = false;
			$('#confirmHatPopup').popup('close');
			
		});
		
		$('#confirmHatPopup').on('popupafterclose',function(){
			//alert('in confirm after close');
			if (yesConfirmHat === true){
			
				var activePage = $('body').pagecontainer('getActivePage').prop('id');
				if (activePage === "tutorialTest"){
				
				}else if(activePage === "home"){
					$("#connectBtn, #cBtn").html(labelDisconnect);
					$("#settingsMessage").html(labelDisconnectMessage);
					$('#connectCircle').css('background','radial-gradient(lightblue,blue)');
					$('#forgetDevice').removeClass('noDisplay');
				}
			
				//$('#confirmHatPopup').popup('close');
				
				var d = new Date();
				syncStartTime = d.getTime();
				address = addressTried;
				localStorage.address = address;
				deviceSetup = true;
				settingsConnect = true;
				platform = device.platform;
				//alert(platform);
				/* if (platform == "iOS"){
					bluetoothle.services(servSuccess,servFail,{ "address": address,"serviceUuids": [] });
				}else if (platform == "Android"){
					//$('#syncreturn').append("<p>Before discover</p>");
					bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
				}else{
				// Unsupported Platform
				}	 */			
				bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });

				
			}else if (yesConfirmHat === false){
				//alert('no confirm');
				// $.mobile.loading('show',{text:labelConnecting,textVisible: true, theme:'b'});
				clearTimeout(connectTimeout);
				$('#connectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail,{ "address": address});
			}else{
				//alert('hit third option for confirm');
			}
		});
		
		$('#confirmHatPopup').on('popupafteropen',function(){
			//alert('after open');
		});	
		
		
		
		$('#closeTimeout').on("click",function(){
			//alert('here - before closing timeoutPopup');
			$('#timeoutPopup').popup('close');
		});
		
		$('#timeoutPopup').on('popupafterclose',function(){
			//bluetoothle.disconnect(disconnectSuccess, disconnectFail,{ "address": address});
			//alert('we get to timeoutPopup after close right?');
			var activePage = $('body').pagecontainer('getActivePage').prop('id');
			if (activePage === "tutorialTest"){
				setTimeout(function(){
					$('#forceReconnectPopup').popup('open');
				},100);
			}
		});
		
		$('#closeNoDevices').on("click",function(){
			$('#noDevicesPopup').popup('close');
			var activePage = $('body').pagecontainer('getActivePage').prop('id');
			/* if (activePage === "tutorialTest"){
				setTimeout(function(){
					$('#forceReconnectPopup').popup('open');
				},100);
			} */
		});
		
		$('#closeNoData').on("click",function(){
			$('#noDataPopup').popup('close');
		});
		
		$('#forgetDevice').on("click",function(){
			if (address){
				$('#forgetPopup').popup('open');
			}else{
				$('#noSavedPopup').popup('open');
			}
		});
		
		
		$('#yesForget').on('click',function(){
			forgettingDevice = true;
			$('#forgetPopup').popup('close');
			bluetoothle.isConnected(isConnectedCallback, {"address":address});
		});
		
		$('#noForget').on('click',function(){
			$('#forgetPopup').popup('close');
		});
		
		$("#closeStart").on('click', function(){
			$('#startPopup').popup('close');
		});
		
		$("#closeEnd").on('click', function(){
			$('#endPopup').popup('close');
			// setTimeout(function(){
				// $('#algPrefPopup').popup('open');
			// },200);
		});
		
		$('#endPopup').on('popupafterclose',function(){
			$('#connectingPopup #description').html(labelConnecting);
			globalData.push("");
			setTimeout(function(){
				emailDataNow(globalData);
			},200);
		});
		
		
		
		$("#closeNoSaved").on('click', function(){
			$('#noSavedPopup').popup('close');
		});
		
		$("#closeSyncFail").on('click', function(){
			$('#syncFailPopup').popup('close');
		});
		
		// $('#syncFailPopup').on('popupafterclose',function(){
			// bluetoothle.close(closeSuccess, closeFail, {"address":address});
		// });
		
		
		$('#closeRating').on('touchend', function(){
			var firstCloud = $('#cloud-1');
			if (firstCloud.hasClass('hover-low') || firstCloud.hasClass('hover-mid') || firstCloud.hasClass('hover-high')){
				var blahrating = $('.cloudBtn.hover-low').length + $('.cloudBtn.hover-mid').length + $('.cloudBtn.hover-high').length ; // this works! Now we just need to append this to globalData and get it into the processRawData fcn
				globalData.push(blahrating);
				//alert("rating: "+blahrating);
				$('#ratingPopup').popup('close');
			}else{
				//alert("Please select a rating first");
				$('#ratingMessage').html(labelRatingError); // swap with labelRating
			}
		});
		
		$('#ratingPopup').on('popupafterclose',function(){
			//$.mobile.loading('show',{text:labelProcessing,textVisible: true, theme:'b'});
			//$('#processingPopup').popup('open');
			
			$('#connectingPopup #description').html(labelProcessing);
			$('#connectingPopup').popup('open');
			
			setTimeout(function(){
				// Swap this with bluetoothle.disconnect() ?
				processRawData(globalData);
			},300);
		});
		

		$('#algA').on('click',function(){
			$('#algPrefPopup').popup('close');
			globalData.push(1);
		});
		
		$('#algB').on('click',function(){
			$('#algPrefPopup').popup('close');
			globalData.push(2);
		});
		
		$('#algAB').on('click',function(){
			$('#algPrefPopup').popup('close');
			globalData.push(0);
		});
		
		$('#algPrefPopup').on('popupafterclose',function(){
			//$.mobile.loading('show',{text:'Processing...',textVisible: true, theme:'b'});
			//alert('in after close of algorithm preference');
			
			$('#connectingPopup #description').html(labelConnecting);
			
			setTimeout(function(){
				emailDataNow(globalData);
			},200);
		});
		
		$('#languageBtn').on('click',function(){
			$('#languageHelp').popup('open');
		});
		$('#closeLanguage').on('click',function(){
			$('#languageHelp').popup('close');
		});
		
		// where slider events were handled... now moved to w/in home pageCreate
		// Slider Events
		
			
			
		$(document).on("change mousemove",'#tutorialVolume',function(e){ // removed mousemove handler
			//alert('mousemove on tutorialVolume slider');
			if (/* volumeRange.prop("disabled") */ volumeSetDisabled ){
			
			}else{
				//alert('swipe off');
				// disableSwipe();
				// var newVal = - (volumeRange.val() - 140);
				var rawVal = $('#tutorialVolume').val();
				
				var newVal = volumeUnmap2(rawVal);
				//alert(rawVal + " " + newVal );
				if (newVal !== currentVolume){
					var now = new Date().getTime();
					if ( now - volumeUpdateTime > 100){
						setVolCmd(newVal);
						volumeUpdateTime = now;
					}
				}else{
				}
			}
		});
		
		$(document).on("change mousemove",'#tutorialBalance', function(e){ // removed mousemove handler
					//alert('tutorial balance change event');
					
			if (/* balanceRange.prop("disabled") */ volumeSetDisabled ){
			
			}else{
				
				// disableSwipe();
				var balVal = parseInt($('#tutorialBalance').val());	
				if (balVal < 0){
					balVal += 256;
				}
				//alert("New Balance: "+ balVal + ", Current Balance: "+ currentBalance);
				if (balVal != currentBalance){
					var now = new Date().getTime();
					if ( now - balanceUpdateTime > 100){
						setBalCmd(balVal);
						balanceUpdateTime = now;
					}
					
				}else{
				}
			}
		});
		
		
		
		// On page buttons
		
		$('#sleepBtn').on('touchstart',function(){
			//alert("blah");
			$(this).addClass('hover');
		});
		
		$('#sleepBtn').on('touchend',function(){
			//alert("blah 2");
			$(this).removeClass('hover');
		});
		

		$(document).on('touchstart','.ui-btn.clear',function(){
			$(this).addClass('hover');
		});
		
		$(document).on('touchend','.ui-btn.clear',function(){
			$(this).removeClass('hover');
		});			

		
		$('#forgetDevice').on('touchstart',function(){
			//alert("blah");
			$(this).addClass('hover');
		}).on('touchend',function(){
			//alert("blah 2");
			$(this).removeClass('hover');
		});
				
		
		$('.popup-footer .ui-btn').on('touchstart',function(){
			//alert("blah");
			$(this).addClass('hover');
		});
		
		$('.popup-footer .ui-btn').on('touchend',function(){
			//alert("blah 2");
			$(this).removeClass('hover');
		});
		
		$('#orientationBtn').click(function () {
			$('#line').highcharts(orientationPlotOptions);
			$('#openSLhelp').css('top','10%');
			$('#head').removeClass('noDisplay');
			$('#lineTitle').html(labelHeadOrientation);
			$('#orientationBtn').addClass('current');
			$('#scoreBtn').removeClass('current');
		});
		
		$('#scoreBtn').click(function () {
			$('#openSLhelp').css('top','-1%');
			$('#head').addClass('noDisplay');
			$('#line').highcharts(scorePlotOptions);
			$('#lineTitle').html(labelSleepLevel);
			$('#scoreBtn').addClass('current');
			$('#orientationBtn').removeClass('current');
		});
		
		var dailyBtn = $('#daily');
		dailyBtn.on("touchend", function(){
			// alert(" click daily");
			currentTrend = "daily";
			//alert("dayData: "+JSON.stringify(dayData));
			var otherButtons = $('#weekly, #monthly, #alltime');
			otherButtons.removeClass("current");
			dailyBtn.addClass("current");
			var trendTitle = $('.trendTitleTable');
			trendTitle.html(labelAvgL7sleeps);
			$('.statlabel, .avgScore, .avgRating, .avgBreakdown').addClass('noDisplay');
			updateTrends2(getTrendsData(dayData));
			updateTrendsTable(getPast7Avgs(dayData));
			
		});
		
		var weeklyBtn = $('#weekly');
		weeklyBtn.on("touchend", function(){
			// alert("click weekly");
			
			currentTrend = "weekly";
			//alert("weekData: "+JSON.stringify(weekData));
			//alert(currentTrend);
			var otherButtons = $('#daily, #monthly, #alltime');
			otherButtons.removeClass("current");
			weeklyBtn.addClass("current");
			var trendTitle = $('.trendTitleTable');
			trendTitle.html(labelAvgL7weeks);
			$('.statlabel, .avgScore, .avgRating, .avgBreakdown').addClass('noDisplay');
			updateTrends2(getTrendsData(weekData));
			updateTrendsTable(getPast7Avgs(weekData));
			
		});
		
		var monthlyBtn = $('#monthly');
		monthlyBtn.on("touchend", function(){
			//alert("click monthly");
			
			currentTrend = "monthly";
			//alert(currentTrend);
			//alert("monthData: "+JSON.stringify(monthData));
			var otherButtons = $('#weekly, #daily, #alltime');
			otherButtons.removeClass("current");
			monthlyBtn.addClass("current");
			var trendTitle = $('.trendTitleTable');
			trendTitle.html(labelAvgL7months);
			$('.statlabel, .avgScore, .avgRating, .avgBreakdown').addClass('noDisplay');
			updateTrends2(getTrendsData(monthData));
			updateTrendsTable(getPast7Avgs(monthData));
		});
		
		var allTimeBtn = $('#alltime');
		allTimeBtn.on("touchend", function(){
			//alert("click monthly");
			currentTrend = "allTime";
			//alert(currentTrend);
			var otherButtons = $('#daily, #weekly, #monthly');
			otherButtons.removeClass("current");
			allTimeBtn.addClass("current");
			var trendTitle = $('.trendTitleTable');
			trendTitle.html(labelAvgAllTime);
			$('.statlabel, .avgScore, .avgRating, .avgBreakdown').removeClass('noDisplay');
			var windowWidth = $(window).width();
			var avgScoreWidth = $('.avgScore').width();
			var avgRatingWidth = $('.avgRating').width();
			var avgBreakdownWidth = $('.avgBreakdown').width();
			$('.avgScore').css('left',(2.27*windowWidth - 0.5*avgScoreWidth)+"px");
			$('.avgRating').css('right',(1.26*windowWidth - 0.5*avgRatingWidth)+"px");
			$('.avgBreakdown').css('left',(2.5*windowWidth - 0.5*avgBreakdownWidth)+"px");
			updateStats(allTimeAvgs.totalScore, allTimeAvgs.rating, allTimeAvgs.states);
			updateStatsTable(allTimeAvgs);
			//updateTrends2(getTrendsData(monthData));
			//updateTrendsTable(getPast7Avgs(monthData));
		});
		
		
		
		
		//localStorage.clear();
		
		
		// dataStored = true;
		//toggleNSbtn(dataStored);
		
		dataTime = new Date().getTime();
		
		// ---- Handle Login/Create Account Form Submit  ---- //
		
		// $('#blahBtn').on('click',function(){
			// alert('work!!!!!!');
		// });
		/* $('#createBtn').on('click',function(){
			var data = $('#createAccountForm').serialize();
			alert(data);
			$.ajax({
			  type: "POST",
			  url: "http://www.sleephat.com/admin/createAccount.php",
			  data: data,
			  success: function(returndata){
				alert("successful call to createAccount.php - Result: "+returndata);
				alert(returndata[0]);
				
				if (returndata[0] == "Success"){
					//Successful Account Creation => Redirect to Walkthrough
					$.mobile.navigate('#tutorialTest');
				}else{
				
				}
				
				
			  },
			  dataType: 'json',
			  error:function (xhr, err) {
				alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
				alert("responseText: " + xhr.responseText);
				alert(err);
			  }
			});
		});
		
		
		$('#loginBtn').on('click',function(){
			var data = $('#loginForm').serialize();
			alert(data);
			$.ajax({
			  type: "POST",
			  url: "http://www.sleephat.com/admin/login.php",
			  data: data,
			  success: function(returndata){
				alert("successful call to login.php - Result: "+returndata);
				alert(returndata[0]);
				
				if (returndata[0] == "Success"){
					// Successful Login => Redirect to Home
					$.mobile.navigate('#home');
				}else{
				
				}
			  },
			  dataType: 'json',
			  error:function (xhr, err) {
				alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
				alert("responseText: " + xhr.responseText);
				alert(err);
			  }
			}); 
		}); */
		bluetoothle.initialize(initSuccess, initFail,{"request":true,"statusReceiver":true});
		
		
		
		
		
    }, // onDeviceReady end tag
    
};

// -- FUNCTIONS -- //

function initSuccess() {
	bluetoothEnabled = true;
	//alert('init success');
	if (openTutorialPopup && splashHidden){
		setTimeout(function(){
			$('#tutorialPopup').popup('open');	
		},200);
		openTutorialPopup = false;
	}
	
	//alert("init success");
	if (localStorage.address){
		//alert(localStorage.address);
		address = localStorage.address;
		deviceSetup = true;
		//bluetoothle.connect(connectSuccess,connectFail, {"address":address});
		$('#forgetDevice').removeClass('noDisplay');
	}else{
		$('#forgetDevice').addClass('noDisplay');
	}
	
	$(document).off("click","#connectBtn, #connectBtn2, #sleepBtn, #testConnect");
	$('#volumeBtn').off('click');
	$('#alarmBtn').off('click');
	$('#alarmOnOff').off('click');
	$('.tutorialReturn').on('click',function(){
		$('.ui-popup').popup('close');
		//localStorage.tutorialDone = "false";
		var newContent = "<h1 style='text-align:center;margin-bottom:0;text-shadow:none'>"+labelTut1Title+"</h1><p>"+labelTut1P+"</p>";
		var newFooter = "<div style='display:inline-block;width:20%'></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep2' style='margin:0 0 1em 0; width:100%;'>"+labelTut1Setup+"</div></div><div style='display:inline-block;width:20%'><a href='#home' id='toHome' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelTut1Later+"</a></div>";
		$('#tutorial-content').html(newContent);
		$('#tutorial-footer').html(newFooter);
		$('#tutorialTest').trigger('create');
		if (currentLanguage === "zh"){
			$('#tutorialTest *').addClass('fontWeightNormal');
		}
		resizeTutorial();
		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#tutorialTest");
	});
	
	$('#volumeBtn').on('click',function(){
		if (localStorage.tutorialDone === "true"){
			volumeBtnClicked = true;
			settingsConnect = true;
			if (address){
					bluetoothle.isConnected(isConnectedCallback, {"address":address}); // can only be called successfully IF ADDRESS IS KNOWN!!!
					//alert('setting connectTimeout on start sleep click-'+btnHit);
					connectTimeout = setTimeout(function(){
						//alert('In connectBtn click handler with address truthly?');
						checkConnection();
					}, 3000);
			}else{
				$('#connectingPopup').popup('open');
				//alert('no local storage');
				var d = new Date();
				syncStartTime = d.getTime();
				bluetoothle.startScan(scanSuccess, scanFail,null);

				setTimeout(function(){
					scanOver();
					//bluetoothle.stopScan(stopSuccess,stopFail)
				
				},1000);
			}
		}else{
			$('#tutorialPopup').popup('open');
		}
	});
	
	/* $('#alarmOnOff').on('click', function(){
		//alert('in alarm on/off btn handler');
		
		if (localStorage.alarmOn === "true"){
			//alert('localStorage.alarmOn === true');
			localStorage.alarmOn = "false";
			$('#alarmOnOff').html(labelOff);
			$('#alarmTime, #alarmOnOff').removeClass('on');
			
		}else{
			//alert('localStorage.alarmOn === false, now we are going to turn it on');
			//-- Set localStorage variable that indicates alarm is on! --//
			if ( !localStorage.alarmTime){
				var defaultAlarm = new Date().setHours(7,0,0,0);
				localStorage.alarmTime = msFromMidnightUnshifted(defaultAlarm);
			}
			
			var temporal = getTemporalFromNow(retrieveAlarm(parseInt(localStorage.alarmTime)));
			var replacementObj = {
				"%h%":temporal[0].toString(),
				"%m%":temporal[1].toString()			
			};
			
			var str = labelAlarmReminder;
			
			str = str.replace(/%\w+%/g, function(all) {
				return replacementObj[all] || all;
			});
			
			//$('#alarmReminder').html("Alarm set for: <br>"+temporal[0]+" hrs "+temporal[1]+" mins from now");
			$('#alarmReminder').html(str);
			$('#alarmReminderPopup').popup('open');
			setTimeout(function(){
				$('#alarmReminderPopup').popup('close');
			},1200);
			localStorage.alarmOn = "true";
			$('#alarmOnOff').html(labelOn);
			$('#alarmTime, #alarmOnOff').addClass('on');
			if (dataStored === "true"){
				//send setAlarm command
				alarmTurnedOn = true;
				if (address){
						bluetoothle.isConnected(isConnectedCallback, {"address":address}); // can only be called successfully IF ADDRESS IS KNOWN!!!
						//alert('setting connectTimeout on start sleep click-'+btnHit);
						connectTimeout = setTimeout(function(){
							//alert('In connectBtn click handler with address truthly?');
							checkConnection();
						}, 3000);
				}else{
					$('#connectingPopup').popup('open');
					//alert('no local storage');
					var d = new Date();
					syncStartTime = d.getTime();
					bluetoothle.startScan(scanSuccess, scanFail,null);

					setTimeout(function(){
						scanOver();
						//bluetoothle.stopScan(stopSuccess,stopFail)
					
					},1000);
				}
				
				
				
			}
		}
		console.log(localStorage.alarmOn);
	});	
		
	$('#alarmBtn').on('click',function(){
		//alert('alarm btn clicked');
		var now = new Date();
		now.setHours(7,0,0,0);
		//$('#timepicker').datebox({"mode":"timebox","useInline":true,"useLang":"en","hideInput":true,"useSetButton":false,"useImmediate":true,"repButton":false,"defaultValue": now ,"lockInput": true});
		
		$('#alarmPopup').popup('open');
		if (parseInt(localStorage.alarmTime) > 0){
			$('#timepicker').datebox('setTheDate', new Date(now.setHours(0,0,0,0)+ parseInt(localStorage.alarmTime))).datebox({"useLang":currentLanguage});
		}else{
			$('#timepicker').datebox('setTheDate', new Date(now)).datebox({"useLang":currentLanguage});
		}
		$('.ui-datebox-container input').prop('readonly','true');
		
	}); */
	
	$('#alarmBtn').on('click',function(){
		if (localStorage.tutorialDone === "true"){
			alarmBtnClicked = true;
			settingsConnect = true;
			if (address){
					bluetoothle.isConnected(isConnectedCallback, {"address":address}); // can only be called successfully IF ADDRESS IS KNOWN!!!
					//alert('setting connectTimeout on start sleep click-'+btnHit);
					connectTimeout = setTimeout(function(){
						//alert('In connectBtn click handler with address truthly?');
						checkConnection();
					}, 3000);
			}else{
				$('#connectingPopup').popup('open');
				//alert('no local storage');
				var d = new Date();
				syncStartTime = d.getTime();
				bluetoothle.startScan(scanSuccess, scanFail,null);

				setTimeout(function(){
					scanOver();
					//bluetoothle.stopScan(stopSuccess,stopFail)
				
				},1000);
			}
		}else{
			$('#tutorialPopup').popup('open');
		}
	});
	
	$('#alarmOnOff').on('click',function(){
		if (localStorage.tutorialDone === "true"){
			//alert('button clicked after tutorial');
			var temporalStuff = getTemporalFromNow(retrieveAlarm(parseInt(localStorage.alarmTime)));
			//alert(temporalStuff);
			if ( temporalStuff[0] === 0 && temporalStuff[1] < 6){
				// some error popup warning about minimum alarm time
				//alert('alarm set too short');
				$('#alarmWarningPopup').popup('open');
				setTimeout(function(){
					$('#alarmWarningPopup').popup('close');
				},1200);
			}else{
				//alert('alarm NOT set too short');
				alarmOnOffClicked = true;
				settingsConnect = true;
				if (address){
						bluetoothle.isConnected(isConnectedCallback, {"address":address}); // can only be called successfully IF ADDRESS IS KNOWN!!!
						//alert('setting connectTimeout on start sleep click-'+btnHit);
						connectTimeout = setTimeout(function(){
							//alert('In connectBtn click handler with address truthly?');
							checkConnection();
						}, 3000);
				}else{
					$('#connectingPopup').popup('open');
					//alert('no local storage');
					var d = new Date();
					syncStartTime = d.getTime();
					bluetoothle.startScan(scanSuccess, scanFail,null);

					setTimeout(function(){
						scanOver();
						//bluetoothle.stopScan(stopSuccess,stopFail)
					
					},1000);
				}
			}
		
			
		}else{
			$('#tutorialPopup').popup('open');
		}
	});
	
	// $('#alarmblah').on('click',function(){
		// alert('dummy btn click');
	// });
	
	$('#closeAlarm').on('click',function(){
		$('.ui-popup').popup('close');
		//-- Need to disconnect here now
		
		//bluetoothle.disconnect(disconnectSuccess,disconnectFail, {"address":adress});
	});
		
	$('#setAlarm').on('click',function(){
		if( $('#alarmError').is(':empty') ){
			console.log('here');
			var alarmDate = $('#timepicker').datebox('getTheDate');
			console.log("what the time picker spits back: "+alarmDate);
			var correctedAlarmDate = correctAlarmTime(alarmDate);
			console.log("after correcting: "+ new Date(correctedAlarmDate));
			updateAlarmDisplay(correctedAlarmDate);
			//-- Set localStorage variable for alarm time --//
			localStorage.alarmOn = "true";
			localStorage.alarmTime = msFromMidnightUnshifted(correctedAlarmDate);
			//alert("localStorage.alarmTime: "+localStorage.alarmTime);
			
			//alarmTime = getMSfromNow(correctedAlarmDate);
			//alert("ms from now: "+ getMSfromNow(correctedAlarmDate)+" "+getMSfromNow(retrieveAlarm(parseInt(localStorage.alarmTime))));
			$('#alarmTime, #alarmOnOff').addClass('on');
			$('#alarmOnOff').html(labelOn);
			
			// -- Since we're connecting before we open alarm popup, anytime the Set Alarm button is pressed, send the alarm cmd to BLE --//
			setWakeTime(getMSfromNow(retrieveAlarm(parseInt(localStorage.alarmTime))));
			
			setTimeout(function(){
				$('#alarmTime, #alarmOnOff').removeClass('on');
				$('#alarmOnOff').html(labelOff);
			},getMSfromNow(retrieveAlarm(parseInt(localStorage.alarmTime)))-5*60*1000);
			
			/* $('.ui-popup').popup('close');
			if (dataStored === "true"){ // Only connect and set timer manually if sleep is already started
				setTimeout(function(){
					alarmTurnedOn = true;
					if (address){
						bluetoothle.isConnected(isConnectedCallback, {"address":address}); // can only be called successfully IF ADDRESS IS KNOWN!!!
						//alert('setting connectTimeout on start sleep click-'+btnHit);
						connectTimeout = setTimeout(function(){
							//alert('In connectBtn click handler with address truthly?');
							checkConnection();
						}, 3000);
					}else{
						$('#connectingPopup').popup('open');
						//alert('no local storage');
						var d = new Date();
						syncStartTime = d.getTime();
						bluetoothle.startScan(scanSuccess, scanFail,null);

						setTimeout(function(){
							scanOver();
							//bluetoothle.stopScan(stopSuccess,stopFail)
						
						}
						, 1000);
					}
				},100);
			} */
		}
	});
		
		
		
		
	//$('.ui-datebox-container input').prop('readonly','true');
	$('#timepicker, .ui-datebox-container input').on('change',function(){
		$('.ui-datebox-container input').prop('readonly','true');
		//console.log('change');
		var alarmDate = $('#timepicker').datebox('getTheDate');
		var correctedAlarmDate = correctAlarmTime(alarmDate);
		// var hoursFromNow = parseFloat((alarmMS/1000/3600).toFixed(0));
		// var minutesFromNow = Math.round((alarmMS - hoursFromNow*3600*1000)/1000/60);
		var temporalStuff = getTemporalFromNow(correctedAlarmDate);
		if ( temporalStuff[0] === 0 && temporalStuff[1] < 11){
			$('#alarmError').html(labelAlarmError);
		}else{
			$('#alarmError').html('');
		}
		// Do a string replacement here for i18n!
		var replacementObj = {
			"%h%":temporalStuff[0].toString(),
			"%m%":temporalStuff[1].toString()			
		};
		
		var str = labelTemporal;
		
		str = str.replace(/%\w+%/g, function(all) {
			return replacementObj[all] || all;
		});
		
		$('#temporalAlarm').html(str);
	});

	
	// Handle click of CONNECT BUTTON: scans for device, connects, discovers services+characteristics, subscribes, the writes confirm command
	

	$(document).on("click","#connectBtn, #connectBtn2, #sleepBtn, #testConnect",function(){
		if(localStorage.tutorialDone && (localStorage.tutorialDone !== "false")){
			var btnHit = $(this).prop('id');
			// if (!connected){
				//alert('connect btn clicked');
				if (connectBtnMode === "connect"){
					//$.mobile.loading('show',{text:labelConnecting,textVisible: true, theme:'b'});
					//$('#connectingPopup').popup('open');
				}else{
					//alert('disconnect btn clicked');
					//$.mobile.loading('show',{text:labelDisconnecting,textVisible: true, theme:'b'});
					clearTimeout(connectTimeout);
					//$('#disconnectingPopup').popup('open');
				}
			// }
			
			if ("connectBtn2" === btnHit || "testConnect" === btnHit || "viewport" === btnHit){
				$('#cBtn').html(labelConnecting);
				settingsConnect = true;
			}else if("sleepBtn" === btnHit){
				if (dataStored === "true"){
					//alert("data stored == true");
					endBtnPressed = true;
				}else if (dataStored === "false"){	
					//alert("do we see when start btn is pressed?");
					startBtnPressed = true;
				}
			}
			promptToConnect = false;
			if (address){

				bluetoothle.isConnected(isConnectedCallback,/* isConnectedCallback, */ {"address":address}); // can only be called successfully IF ADDRESS IS KNOWN!!!

				//alert('setting connectTimeout on start sleep click-'+btnHit);
				connectTimeout = setTimeout(function(){
					//alert('In connectBtn click handler with address truthly?');
					checkConnection();
				}, 3000);
			}else{
				$('#connectingPopup').popup('open');
				//alert('no local storage');
				var d = new Date();
				syncStartTime = d.getTime();
				bluetoothle.startScan(scanSuccess, scanFail,null);

				setTimeout(function(){
					scanOver();
					//bluetoothle.stopScan(stopSuccess,stopFail)
				
				},1000);
			}
			// startScanTime = new Date();
			// bluetoothle.startScan(scanSuccess, scanFail,null);
			// setTimeout(function(){
				// bluetoothle.stopScan(stopSuccess,stopFail)
			// }, 1000);
		/* }else{
			//clearInterval(accelInterval);
			bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
		} */
		
		}else{
			$('#tutorialPopup').popup('open');
		}
	});
	
	// Handle click of buttons that write commands to hat: just writes command to hat
	// $('#checkData').on('click',function(){
		// alert("check data btn pressed");
		// sendCheckDataCommand();
	// });
	
	
	
	
	// $('#eraseData').on('click',function(){
		// sendEraseDataCommand();
	// });
	
	
} // initSuccess - End Bracket
        
function sendCheckDataCommand(){
	currentWrite = "Check for data";
	// Write getAccel command
	var hexArray = ["AA","AA","03","94","20","00",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("writing get accel command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
	// Set flag in subscribeSuccess (data.status === "subscribedResult")
}
		
function sendGetHeaderCommand(){
	//alert('before requesting data header');
	currentWrite = "Get header";
	// Write getAccel command
	var hexArray = ["AA","AA","03","93","20","00",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("writing get accel command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
	// Set flag in subscribeSuccess (data.status === "subscribedResult")
}
		
function sendEraseDataCommand(){
	
	currentWrite = "erase data";
	// Write getAccel command
	var hexArray = ["AA","AA","03","96","20","00",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("writing get accel command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
	// Set flag in subscribeSuccess (data.status === "subscribedResult")
}

		
function getAccel(){
	currentWrite = "Get Accel";
	// Write getAccel command
	var hexArray = ["AA","AA","03","58","20","00",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("writing get accel command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
	// Set flag in subscribeSuccess (data.status === "subscribedResult")
}

function sendConfirmationCommand(){
	currentWrite = "confirm connection";
	// Write BLE confirm command
	var hexArray = ["AA","AA","03","9A","10","01",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
}

// Success Callbacks
        
function scanSuccess(data){
	//alert('scan success');
	if (data.status == "scanResult"){
		if (foundDevices.indexOf(data.address) < 0 && data.name === desiredName/* "SSV1_00000" */){
			
			foundDevices.push(data.address);	
			foundRssi.push(data.rssi);
			
			//alert(foundDevices+" "+deviceToTry);
			
			console.log(JSON.stringify(foundDevices));
			address = data.address;
		}else{
			console.log('No devices found');
		}
	}
	
}

function stopSuccess(data){
	//alert('hit stop success');
	//console.log("Stop Success "+foundDevices[deviceToTry]);
	connectRecursive(deviceToTry);
	
}
    
var connectRecursive = function(n){
	//alert("in recursive function: "+n+" "+foundDevices.length);
	if (n < foundDevices.length){
		address = foundDevices[n];
		bluetoothle.connect(connectSuccess,connectFail,{"address":address});
	}else{
		// alert('No Devices to try');
		//notEnoughData = true;
		setTimeout(function(){
			//$.mobile.loading('hide');
			//alert('popup 1');
			$('.ui-popup').popup('close');
			clearTimeout(connectTimeout);
			$('#cBtn').html(labelConnect);
			foundDevices = [];
			foundRssi = [];
			deviceToTry = 0;
			//alert('address = null in connectRecursive');
			address = null;
			
			endBtnPressed = false;
			startBtnPressed = false;
			forgettingDevice = false;
			disconnecting = false;
			notEnoughData = false;
			
			setTimeout(function(){
				$('#noDevicesPopup').popup('open');
			},200);
		},400);
		
		
		
		// 
	}
};
		
function connectSuccess(data){
	addressTried = data.address;
	//alert('connect success'+charUuid+" "+serviceUuid);
	var activePage;
	if (data.status === "connected"){
		//sendConfirmationCommand();
		if (deviceSetup){
			//$("#connectBtn, #cBtn").html(labelConnected);
			
			
			activePage = $('body').pagecontainer('getActivePage').prop('id');
			if (activePage === "tutorialTest"){
			}else if (activePage === "home"){
				$("#connectBtn, #cBtn").html(labelDisconnect);
				$('#connectCircle').css('background','radial-gradient(lightblue,blue)');
				$('#settingsMessage').html(labelDisconnectMessage);
			}
			
			platform = device.platform;
			if (platform == "iOS"){
				bluetoothle.services(servSuccess,servFail,{ "address": address,"serviceUuids": [] });
			}else if (platform == "Android"){
				//alert('before calling isDiscovered');
				bluetoothle.isDiscovered(isDiscoveredCallBack,/* isDiscoveredCallback, */ {"address":address});
				//bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
			}else{
			// Unsupported Platform
			}
		}else{
			//$.mobile.loading('hide');
			//alert('connecting popup close');
			
			platform = device.platform;
			if (platform == "iOS"){
				//alert('start getting services');
				bluetoothle.services(servSuccess,servFail,{ "address": address,"serviceUuids": [] });
			}else if (platform == "Android"){
				//alert('before calling isDiscovered');
				bluetoothle.isDiscovered(isDiscoveredCallBack,/* isDiscoveredCallback, */ {"address":address});
				//bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
			}else{
			// Unsupported Platform
			}
			
			/* $('.ui-popup').popup('close');
			setTimeout(function(){
				$('#confirmHatPopup').popup('open');
			},100); */
			
		}
		
	}else if(data.status === "disconnected"){
		connected = false;
		volumeSetDisabled = true;	
		activePage = $('body').pagecontainer('getActivePage').prop('id');
		if (activePage === "tutorialTest"){
			//deviceSetup = false;
			clearInterval(accelIntervalTutorial);
			clearInterval(sigStrengthInterval);
			closeInTutorial = true;
			connected = false;
			accidentalDisconnect = true;
			needCurrentVolume = true;
			//alert("Uh oh. We were disconnected!");
			//$.mobile.loading('hide');
			deviceSetup = false;
			$( "#forceReconnectPopup" ).popup("open");
			
		}else if (activePage === "home"){
			$("#cBtn").html(labelConnect);
			$('#settingsMessage').html(labelConnectMessage);
			$('#connectCircle').css('background','radial-gradient(#333,black)');
			connected = false;
			accidentalDisconnect = true;
			needCurrentVolume = true;
			//alert("Uh oh. We were disconnected!");
			//$.mobile.loading('hide');
			$('.ui-popup').popup('close');
			setTimeout(function(){
				$( "#reconnectPopup" ).popup("open");
			},100);
		}
		
		
	}
}
        
function servSuccess(data){
	//$('#syncreturn').append("<p>Service Success: "+JSON.stringify(data)+"</p>");
	//alert("service success");
	bluetoothle.characteristics(charSuccess,charFail,{"address":address,"serviceUuid":serviceUuid,"characteristicUuids":[]});
}

        
function charSuccess(data){
	//$('#syncreturn').append("<p>Characteristic Success: "+data.status+"</p>");
	//alert("char success 1");
	sendConfirmationCommand();
	//alert("char success 2");
	if (deviceSetup){
		setTimeout(function(){				
			bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
		},300);
	}else{
		//alert('before opening confirm popup');
		$('.ui-popup').popup('close');
		setTimeout(function(){
			$('#confirmHatPopup').popup('open');
		},100);
	}
	
}
        
function disconnectSuccess(data){
	//$('#syncreturn').append("<p>Disconnect Success</p>");
	//alert("in disconnect success");
	if (data.status == "disconnected"){
		//alert("disconnect success");
		if (deviceSetup){
			
				bluetoothle.close(closeSuccess, closeFail,{ "address": address});
		}else{
				// address = null;
				// forgettingDevice = false;
				// alert('address 2: '+address);
				// deviceSetup = false;
				bluetoothle.close(closeSuccess, closeFail,{ "address": address});
		}
		
	}
}
        
function closeSuccess(data){
	//alert("in close success");
	
	// $('#volumeControl').slider('disable').slider('refresh');
	// $('#volumeBalance').slider('disable').slider('refresh');
	//$('#startBtn, #endBtn').addClass("ui-state-disabled");
	// $('#startBtn').addClass("ui-state-disabled");
	// $('#endBtn').addClass("ui-state-disabled");
	
	// $('#volumeControl').slider('disable').slider('refresh');
	// $('#volumeBalance').slider('disable').slider('refresh');
	// var activePage = $('body').pagecontainer('getActivePage').prop('id');
	// if (activePage === "settings"){
		
	// }
	
	var activePage = $('body').pagecontainer('getActivePage').prop('id');
	if (activePage === "tutorialTest"){
		clearInterval(sigStrengthInterval);
		clearInterval(accelInterval);
	}else if (activePage === "home"){
		// $("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
		// $('#settingsMessage').html(labelConnectMessage);
		// $('#connectCircle').css('background','radial-gradient(#333,black)');
		// $('#volumeControl').slider('disable').slider('refresh');
		// $('#volumeBalance').slider('disable').slider('refresh');
	}
	
	
	connected = false;
	
	volumeSetDisabled = true;
	needCurrentVolume = true;
	connectBtnMode = "connect";
	setTimeout(function(){
		//alert('We get here right?');
		//$.mobile.loading('hide');
		//$('.ui-popup').popup('close');
		if (startBtnPressed){
			//alert('popup 2');
			$('.ui-popup').popup('close');
			setTimeout(function(){
			$('#startPopup').popup('open');
			},100);
			startBtnPressed = false;
			startRecordingClicked = false;
		}else if(endBtnPressed){
			//alert('popup 3');
			
			// swap all this with processRawData() ? Or open rating popup here?
			$('.cloudBtn').removeClass('hover-low hover-mid hover-high');
			$('.ui-popup').popup('close');
			setTimeout(function(){
				$('#ratingPopup').popup('open');
			},100);
			
			// $('.ui-popup').popup('close');
			// setTimeout(function(){
				// $('#endPopup').popup('open');
			// },100);
			endBtnPressed = false;
			retrieveDataClicked = false;
		}else if (forgettingDevice){
			$('.ui-popup').popup('close');
			//alert('forgetting device');
			address = null;
			localStorage.removeItem('address');
			forgettingDevice = false;
			deviceSetup = false;
			$('#forgetDevice').addClass('noDisplay');
			
			/*-- Uncomment below to reinstate forgetting device -> Start Sleep only --*/ 
			// dataStored = "false";
			// localStorage.dataStored = "false";
			// toggleNSbtn(dataStored);
			
		}else if(notEnoughData){
			//alert('popup 4');
			notEnoughData = false;
			$('.ui-popup').popup('close');
			setTimeout(function(){
				$('#noDataPopup').popup('open');
				//alert('after noDataPopup open');
			},100);
			
			//$('.ui-popup').popup('close');
		}/* else if(settingsConnect){
			settingsConnect = false;
			$('.ui-popup').popup('close');
		} */
		else if(disconnecting){
			disconnecting = false;
			//alert('popup 14');
			$('.ui-popup').popup('close');
		}else if(reconnect && activePage === "home"){
			//alert('before reconnect');
			bluetoothle.connect(connectSuccess, connectFail, {"address": address});
		}else if(reconnect && activePage === "tutorialTest"){
			// Put in first time connection protocol here
			//alert('before reconnect in tutorialTest loop');
			//address = null;
			deviceToTry = 0;
			foundDevices = [];
			foundRssi = [];
			closeInTutorial = true;
			$('#connectingPopup').popup('open');
			//alert('close in tutorial');
			var d = new Date();
			syncStartTime = d.getTime();
			bluetoothle.startScan(scanSuccess, scanFail, null);

			setTimeout(function(){
				scanOver();
				//bluetoothle.stopScan(stopSuccess,stopFail)
			
			},1000);
		
		}else if(alarmBtnClicked){
			alarmBtnClicked = false;
			$('.ui-popup').popup('close');
		}else if(alarmOnOffClicked){
			
			alarmOnOffClicked = false;
			$('.ui-popup').popup('close');
			
			var alarmBtn = $('#alarmOnOff');
			if (alarmBtn.hasClass('on')){
				var temporal = getTemporalFromNow(retrieveAlarm(parseInt(localStorage.alarmTime)));
				var replacementObj = {
					"%h%":temporal[0].toString(),
					"%m%":temporal[1].toString()			
				};
				
				var str = labelAlarmReminder;
				
				str = str.replace(/%\w+%/g, function(all) {
					return replacementObj[all] || all;
				});
				
				//$('#alarmReminder').html("Alarm set for: <br>"+temporal[0]+" hrs "+temporal[1]+" mins from now");
				$('#alarmReminder').html(str);
				$('#alarmReminderPopup').popup('open');
				setTimeout(function(){
					$('#alarmReminderPopup').popup('close');
				},1200);
			}
		}
		notEnoughData = false;
		$('#connectingPopup #description').html(labelConnecting);
		
		if (deviceSetup){
			foundDevices = [];
			foundRssi = [];
			//deviceToTry = 0;
			//alert(data.status);
		}else{
			//$('#syncreturn').append("<p>Close Success"+deviceToTry+"</p>");
			if (closeInTutorial){
				//alert('closeInTutorial');
				deviceToTry = 0;
				foundDevices = [];
				foundRssi = [];
				// -- Load the first page of tutorial here -- //
				var newContent = "<h1 style='text-align:center;margin-bottom:0;text-shadow:none'>"+labelTut1Title+"</h1><p>"+labelTut1P+"</p>";
				var newFooter = "<div style='display:inline-block;width:20%'></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep2' style='margin:0 0 1em 0; width:100%;'>"+labelTut1Setup+"</div></div><div style='display:inline-block;width:20%'><a href='#home' id='toHome' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelTut1Later+"</a></div>";
				$('#tutorial-image').css('display','inline');
				$('#tutorial-content').html(newContent);
				$('#tutorial-footer').html(newFooter);
				$('#tutorialTest').trigger('create');
				if (currentLanguage === "zh"){
					$('#tutorialTest *').addClass('fontWeightNormal');
				}
				resizeTutorial();
				
				closeInTutorial = false;
				//break;
			}else{
				//alert('increment deviceToTry');
				yesConfirmHat = "blah";
				deviceToTry++;				
				connectRecursive(deviceToTry);
			}
		}
		
	},600);
	
	
	
}
		
function writeSuccess(data){
	//$('#syncreturn').append("<p>Write Success- "+JSON.stringify(data)+"</p>");
}
        
function readDescSuccess(){
	console.log("Read Descriptor Success");
}
        
function discoverSuccess(data){
	console.log(JSON.stringify(data));
	//$('#syncreturn').append(JSON.stringify(data));
	//alert("services: "+serviceUuid+" chars: "+charUuid);
	//bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
	//alert("discover success");
	sendConfirmationCommand();
	
	if (deviceSetup){
		setTimeout(function(){				
			bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
		},300);
	}else{
		$('.ui-popup').popup('close');
		setTimeout(function(){
			$('#confirmHatPopup').popup('open');
		},100);
	}
	
}
                
function subSuccess(data){
	//alert("subscribe success");
	var activePage;
	if (data.status == "subscribed"){
		//sendConfirmationCommand()
		
		//setVolCmd(130);
		//alert('subscribed');
		clearTimeout(connectTimeout);
		//alert('after clearing connection timeout');
		connectBtnMode = "disconnect";
		connected = true;
		reconnect = false;
		promptToConnect = false;
		afterForcedDisconnect = false;
		accidentalDisconnect = false;
		neverConnected = false;
		//$.mobile.loading('show', {text:labelConnected,textVisible: true, theme:'b'});
		
		if (localStorage.tutorialDone !== "true"){
			//alert('boom! connected');
			
			
			
		}
		
		
		//$('#startBtn, #endBtn').removeClass("ui-state-disabled");
		
		activePage = $('body').pagecontainer('getActivePage').prop('id');
		if (activePage === "tutorialTest"){
			var newContent = "<h3>"+labelTut3Title+"</h3><p><img src='img/"+labelSensorDiagramImg+"' style='width:100%'/></p><p>"+labelTut3P1+"</p><p>"+labelTut3P2+"</p><p>"+labelTut3P3+"</p>";
			var newFooter = "<div id='tutorialStep3' class='ui-btn clear' style='margin:1em; width:60%;'>"+labelNext+"</div>";
			newFooter = "<div style='display:inline-block;width:20%'><a href='' id='backToPage2' style='padding:0;margin:0;background:transparent;color:white;border:none;text-shadow:none; font-size:12px; text-decoration:none' >"+labelBack+"</a></div><div style='display:inline-block;width:60%'><div class='ui-btn clear' id='tutorialStep3' style='margin:0 0 1em 0; width:100%;'>"+labelNext+"</div></div><div style='display:inline-block;width:20%'></div>";
			$('#tutorial-image').css('display','none');
			$('#tutorial-content').html(newContent);
			$('#tutorial-footer').html(newFooter);
			$('#tutorialTest').trigger('create');
			if (currentLanguage === "zh"){
				$('#tutorialTest *').addClass('fontWeightNormal');
			}
			resizeTutorial();
			//$('#tutorialVolume').slider('enable').slider('refresh');
		}else if (activePage === "home"){
			//$("#connectBtn").addClass("ui-state-disabled");
			//$('#connectBtn2').addClass("ui-state-disabled");
		/* 	$('#volumeControl').slider('enable').slider('refresh');
			$('#volumeBalance').slider('enable').slider('refresh');
			
			if (needCurrentVolume && !startBtnPressed && !endBtnPressed){
				getVolume();
			} */
		}
		
		
		volumeSetDisabled = false;
		//alert("Sub success "+dataStored);

		if (needCurrentVolume && !startBtnPressed && !endBtnPressed){
			//getVolume();
		}
		//getAccel();
		
		if (startBtnPressed){ // Here, we could send the Check For Data command, then depending on the response: 1-Yes,Data: Open a popup prompting user to download data, on Yes send End Command, 2-No Data: send Start Command. NOTE: If I do this, I do need to erase data on sync! 
			//alert("start button pressed");
			
			// if (localStorage.alarmOn === "true"){ // probably don't need this part anymore
				// setWakeTime(getMSfromNow(retrieveAlarm(parseInt(localStorage.alarmTime))));
			// }else{
				// sendStartCommand(); // NORMALLY NOT COMMENTED
			// }
			
			sendCheckDataCommand();
			// sendGetHeaderCommand();
			
			//-- if we want to check for data prior to starting sleep, check for data here --//
			
			//clearTimeout(myDataTimeout);
			
			
			// --------- Make start button temporarily end sleep  --------------//
			// sendEndCommand();
			// clearTimeout(myDataTimeout);
			// myDataTimeout = setTimeout(checkForNewData, 1000);
			
		}else if (endBtnPressed){
		
			//alert("or here");
			sendEndCommand();
			clearTimeout(myDataTimeout);
			myDataTimeout = setTimeout(checkForNewData, 1000);
		}else if(volumeBtnClicked){
			$('.ui-popup').popup('close');
			setTimeout(function(){
				$('#volumePopup').popup('open');
			},100);
		}else if(alarmBtnClicked){
			$('.ui-popup').popup('close');
			setTimeout(function(){
				$('#alarmPopup').popup('open');
			},100);
		}else if (alarmOnOffClicked){
			var alarmOnOffBtn = $('#alarmOnOff');
			
			if( alarmOnOffBtn.hasClass('on')){ // the button is on now, so we're turning OFF alarm
				//alert('we get here dont we? alarm currently on, turning off');
				setTimeout(function(){
					setWakeTime(18*3600*1000);
				},300);
				$('#alarmOnOff').html(labelOff);
				$('#alarmTime, #alarmOnOff').toggleClass('on');
			}else{ // the button is off now, so we're turning ON alarm
				//alert('or do we get here? alarm currently off, turning on');
				setTimeout(function(){
					setWakeTime(getMSfromNow(retrieveAlarm(parseInt(localStorage.alarmTime))));
				},300);
				
				setTimeout(function(){
					$('#alarmTime, #alarmOnOff').removeClass('on');
					$('#alarmOnOff').html(labelOff);
				},getMSfromNow(retrieveAlarm(parseInt(localStorage.alarmTime)))-5*60*1000+300);
				$('#alarmOnOff').html(labelOn);
				$('#alarmTime, #alarmOnOff').toggleClass('on');
			}
			
			
		}else if (alarmTurnedOn){
			$('.ui-popup').popup('close');
			//alert('set alarm: '+localStorage.alarmTime);
			setWakeTime(getMSfromNow(retrieveAlarm(parseInt(localStorage.alarmTime))));
			alarmTurnedOn = false;
		}else {
			settingsConnect = false;
			setTimeout(function(){
				//$.mobile.loading('hide');
				//alert('popup 5');
				$('.ui-popup').popup('close');
			},500);
			
			// accelInterval = setInterval(function(){
				// getAccel();
			// },200);
		}
	// ----------------- SUBSCRIBED RESULT ------------------------//
	}else if(data.status == "subscribedResult"){
		var returnedBytes = bluetoothle.encodedStringToBytes(data.value);
		//alert("received: "+JSON.stringify(returnedBytes));
		var countArray;
		// -- Received Signal Strength -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 3 && returnedBytes[3] == 68){
			var signalStrength = returnedBytes[5];
			//alert("sig: "+signalStrength);
			
			updateSignalStrengthColor(parseInt(signalStrength));
			
			// $('#signalStrengthCircle').html(signalStrength);
			// $('#sigContainer').css('background-color','rgb(0,'+(255-parseInt(signalStrength))+',0)');
			
			//alert("received signal strength of: "+signalStrength);
			
			// $('#signalStrength').html(signalStrength);
			// if (signalStrength < 25){
				// $('#sigStrengthContainer').css('background',"#77b03c");
			// }else if (signalStrength < 100){
				// $('#sigStrengthContainer').css('background',"#fbe372");
			// }else{
				// $('#sigStrengthContainer').css('background',"#db4b4e");
			// }
		}
		// -- Received volume level -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 3 && returnedBytes[3] == 132 && returnedBytes[4] == 48){
			activePage = $('body').pagecontainer('getActivePage').prop('id');
			var volumeRaw, volumeMapped, volumeControl = $('#tutorialVolume');
			if (needCurrentVolume && activePage === 'home'){
				volumeRaw = returnedBytes[5];
				volumeMapped = volumeMap2(volumeRaw);
				
				volumeControl.val(volumeMapped).slider("refresh");
				
				getBalance();
			}else if(needCurrentVolume && activePage === 'tutorialTest'){
				volumeRaw = returnedBytes[5];
				volumeMapped = volumeMap2(volumeRaw);
				
				volumeControl.val(volumeMapped).slider("refresh");
				
				getBalance();
			}
			
			currentVolume = returnedBytes[5];
			// alert("Volume: "+volumeMap(currentVolume));
			// alert("Current Volume: "+currentVolume);
			// $('#volumeLabel').html(volumeMapped);
			// $('#volumeBar').css('width',volumeMapped+'%');
		}
		
		// -- Received volume balance -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 3 && returnedBytes[3] == 133 && returnedBytes[4] == 48){
			activePage = $('body').pagecontainer('getActivePage').prop('id');
			var balanceRaw, volumeBalance = $('#volumeBalance');
			if (needCurrentVolume && activePage === 'home') {
				
				//alert("received signal strength of: "+returnedBytes[4]);
				balanceRaw = returnedBytes[5];
				if (balanceRaw > 30){
					balanceRaw -= 256;
				}
				// var volumeMapped = volumeMap(volumeRaw);
				// alert("balance raw "+balanceRaw);
				
				volumeBalance.val(balanceRaw).slider("refresh");					
				needCurrentVolume = false;
			}else if( needCurrentVolume && activePage === 'tutorialTest'){
				balanceRaw = returnedBytes[5];
				if (balanceRaw > 30){
					balanceRaw -= 256;
				}
				// var volumeMapped = volumeMap(volumeRaw);
				// alert("balance raw "+balanceRaw);
				
				volumeBalance.val(balanceRaw).slider("refresh");					
				needCurrentVolume = false;
			}
		}
		
		// -- Received balance level -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 3 && returnedBytes[3] == 133 && returnedBytes[4] == 48){
			currentBalance = returnedBytes[5];
			console.log("Current Balance: "+currentBalance);  
		}
		
		// -- Received alarm set response --//
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 6 && returnedBytes[3] == 52 && returnedBytes[4] == 48){
			//alert('received alarm echo');
			/* if (startBtnPressed){
				sendStartCommand();
			}else{
				bluetoothle.disconnect(disconnectSuccess,disconnectFail, {"address":address});
			} */
			//bluetoothle.disconnect(disconnectSuccess,disconnectFail, {"address":address});
			if (alarmOnOffClicked){
				bluetoothle.disconnect(disconnectSuccess,disconnectFail, {"address":address});
			}else{
				$('.ui-popup').popup('close');
			}
		}
		
		// -- Received version number --//
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 /* && returnedBytes[2] == 3 */ && returnedBytes[3] == 153 && returnedBytes[4] == 48){
			// returnedBytes[5] is A, returnedBytes[6] is B if version number is A.B
			//alert(JSON.stringify(returnedBytes));
		}
		
		// -- Received accel data -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 88 && returnedBytes[4] == 48){
			//alert("received signal strength of: "+returnedBytes[4]);
			var xArray = [returnedBytes[5], returnedBytes[6]];
			var yArray = [returnedBytes[7], returnedBytes[8]];
			var zArray = [returnedBytes[9], returnedBytes[10]];
			var dataX = pack(xArray);
			var dataY = pack(yArray);
			var dataZ = pack(zArray);
			//$('#placeholder').html(dataX+" "+dataY+" "+dataZ);
			// $('#xLabel').html(dataX);
			// $('#yLabel').html(dataY);
			// $('#zLabel').html(dataZ);
			//alert("here");
			// var headPosition = processAccelData(dataX,dataY,dataZ);
			//alert(headPosition);
			// $('#angle').html(headPosition[0]);
			// $('#tilt').html(headPosition[1]);
			// updateOrientationPlots(headPosition);
			
			if (dataX > 600 && Math.abs(dataY) < 600 && Math.abs(dataZ) < 500){
				//$('#placeholder').html('Up');
			}else if (dataY > 600 && Math.abs(dataX) < 600 && Math.abs(dataZ) < 500){
				//$('#placeholder').html('Right');
			}else if (dataY < -600 && Math.abs(dataX) < 600 && Math.abs(dataZ) < 500){
				//$('#placeholder').html('Left');
			}else if (dataX < -600 && Math.abs(dataY) < 600 && Math.abs(dataZ) < 500){
				//$('#placeholder').html('Down');
			}else if (dataZ > 400){
				//$('#placeholder').html('Sitting Up');
			}else if (dataZ < -400){
				//$('#placeholder').html('Head Stand');
			}
			
			var blahOrientation = orientationCalc2([dataX],[dataY],[dataZ],1);
			//alert(JSON.stringify(blahOrientation));
			// var gx = dataX/1025;
			// var gy = dataY/1025;
			// var gz = dataZ/1025;
			// var phi = Math.round(Math.atan2(gy,gz)*180/Math.PI);
			// var theta = Math.round(Math.atan2(-gx, Math.sqrt(Math.pow(gy,2)+Math.pow(gz,2)))*180/Math.PI);
			
			//$('#tutorialOrientation').html(dataX+" "+dataY+" "+dataZ);
			
			if (blahOrientation[0] !== oldPosition){
				switch(blahOrientation[0]){
					case posStates.UP:
						$('#tutorialOrientation').html(labelUp);
						// $('#orientationImg').fadeOut(300,function(){
						// $('#orientationImg').prop('src','img/head-up.png');
						// });
						// $('#orientationImg').fadeIn(300);
						
						$("#cf7 img").removeClass("opaque");
						$("#cf7 img").eq(4).addClass("opaque");
					break;
					case posStates.LEFT:
						$('#tutorialOrientation').html(labelLeft);
						// $('#orientationImg').fadeOut(300,function(){
						// $('#orientationImg').prop('src','img/head-left.png');
						// });
						// $('#orientationImg').fadeIn(300);
						
						$("#cf7 img").removeClass("opaque");
						$("#cf7 img").eq(1).addClass("opaque");
					break;
					case posStates.RIGHT:
						$('#tutorialOrientation').html(labelRight);
						// $('#orientationImg').fadeOut(300,function(){
						// $('#orientationImg').prop('src','img/head-right.png');
						// });
						// $('#orientationImg').fadeIn(300);
						
						$("#cf7 img").removeClass("opaque");
						$("#cf7 img").eq(2).addClass("opaque");
					break;
					case posStates.DOWN:
						$('#tutorialOrientation').html(labelDown);
						// $('#orientationImg').fadeOut(300,function(){
						// $('#orientationImg').prop('src','img/head-down.png');
						// });
						// $('#orientationImg').fadeIn(300);
						
						$("#cf7 img").removeClass("opaque");
						$("#cf7 img").eq(0).addClass("opaque");
					break;
					case posStates.STANDING:
						$('#tutorialOrientation').html(labelStanding);
						// $('#orientationImg').fadeOut(300,function(){
						// $('#orientationImg').prop('src','img/head-standing.png');
						// });
						// $('#orientationImg').fadeIn(300);
						
						$("#cf7 img").removeClass("opaque");
						$("#cf7 img").eq(3).addClass("opaque");
					break;
					case posStates.HEADSTAND:
						$('#tutorialOrientation').html(labelHeadstand);
						// $('#orientationImg').fadeOut(300,function(){
						// $('#orientationImg').prop('src','img/head-upside-down.png');
						// });
						// $('#orientationImg').fadeIn(300);
						
						$("#cf7 img").removeClass("opaque");
						$("#cf7 img").eq(5).addClass("opaque");
					break;
				}
				//$('#tutorialOrientation').html(blahOrientation[0]);
				//$('#placeholder').html(theta+" "+phi);
				oldPosition = blahOrientation[0];
			}
		
		}
		
		// -- Received Sleep Data Header Packet -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 129 && returnedBytes[4] == 48){
			//alert('header received - before checking for start btn pressed');
			if (startBtnPressed){
				//alert('received header after start btn pressed');
				var startDate = packUnsigned([returnedBytes[7],returnedBytes[8],returnedBytes[9],returnedBytes[10],returnedBytes[11],returnedBytes[12]]);
				startDate = new Date(startDate);
				//alert(new Date(startDate)+" "+storedDataLength);
				
				var hour = (storedDataLength*15/3600).toFixed(1);
				var month = startDate.getMonth()+1;
				var day = startDate.getDate();
				var year = startDate.getFullYear();
				var replacementObj = {
					"%h%":hour,
					"%m%":month,
					"%d%":day,
					"%y%":year
				};
				
				var str = labelDataCheck;
				
				str = str.replace(/%\w+%/g, function(all) {
					return replacementObj[all] || all;
				});
				
				$('#dataCheckPopup #dataCheckDescription').html(str);
				$('.ui-popup').popup('close');
				setTimeout(function(){
					$('#dataCheckPopup').popup('open');
				},100);
			}else{
			
				clearTimeout(myDataTimeout);
				myDataTimeout = setTimeout(checkForNewData, 1000);
				//alert("header received - in else loop");
				countArray = [returnedBytes[5], returnedBytes[6]]; //returnedBytes.slice(5,7);
				var sampleRateArray = [returnedBytes[13],returnedBytes[14],returnedBytes[15],returnedBytes[16]];
				//alert("sample rate: "+pack(sampleRateArray));
				expectedCount = 0;
				
				//alert("header received: "+expectedCount);
				packetCounter = packUnsigned(countArray);
				// alert("here maybe?");
				//since we also get this sequence of bytes when chip echos start command, this will be specific to a sync header!
				if (returnedBytes.length > 10){ // length will be greater than 10 for a header
					dataTime = packUnsigned([returnedBytes[7],returnedBytes[8],returnedBytes[9],returnedBytes[10],returnedBytes[11],returnedBytes[12]]);
					//alert("Date Time: "+dataTime);
				}else{  // length will NOT be greater than 10 for echo of start recording command
					// alert('before disconnecting');
					
				}
				//if (expectedCount === packetCounter) {alert('correct header counter');};
			}
		}
		
		// -- Received Sleep Data Stream Packet -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 11 /* 16 */){
			clearTimeout(myDataTimeout);
			myDataTimeout = setTimeout(checkForNewData, 1000);
			// while (myDataTimeout--){
				// window.clearTimeout(myDataTimeout);
			// }
			
			// continueDataSync = true;
			// myDataTimeout = window.setTimeout(checkForNewData, 1000);
			//alert('received stream packet');
			
			countArray = [returnedBytes[3], returnedBytes[4]]; //returnedBytes.slice(3,5);
			packetCounter = packUnsigned(countArray);
			//alert("before incr: "+expectedCount);
			expectedCount++;
			//alert("after incr: "+expectedCount);
			if (expectedCount !== packetCounter){
				
				//alert('Did not receive packet: ' + expectedCount + "received packet: "+packetCounter);
				//////////////////////////////////////
				// this is the long-term solution!
				// see how many packets we missed, append nulls until they match, modify expectedCount accordingly?
				while (expectedCount < packetCounter){
					// tones.push(null, null);
					// accelX.push(null, null);
					// accelY.push(null, null);
					// accelZ.push(null, null);
					
					// for single sample per packet
					tones.push(null);
					accelX.push(null);
					accelY.push(null);
					accelZ.push(null);
					sigStrength.push(null);
					motionPerSample.push(null);
					expectedCount++;
				}
				
				// tones.push(returnedBytes[5], returnedBytes[12]);
				// accelX.push(pack([returnedBytes[6], returnedBytes[7] ]),pack([returnedBytes[13], returnedBytes[14] ]));
				// accelY.push(pack([returnedBytes[8], returnedBytes[9] ]),pack([returnedBytes[15], returnedBytes[16] ]));
				// accelZ.push(pack([returnedBytes[10], returnedBytes[11] ]),pack([returnedBytes[17], returnedBytes[18] ]));
				
				// for single sample per packet
				tones.push(returnedBytes[5]);
				accelX.push(pack([returnedBytes[6], returnedBytes[7] ]));
				accelY.push(pack([returnedBytes[8], returnedBytes[9] ]));
				accelZ.push(pack([returnedBytes[10], returnedBytes[11] ]));
				sigStrength.push(returnedBytes[12]);
				motionPerSample.push(returnedBytes[13]);
				//////////////////////////////////////
				
				//$('#syncreturn').append("<p>Didn't receive packet: Expected: "+expectedCount+", Received: "+packetCounter+"<p>");
				// tones.push(null, null, returnedBytes[5], returnedBytes[12]);
				// accelX.push(null, null, pack([returnedBytes[6], returnedBytes[7] ]),pack([returnedBytes[13], returnedBytes[14] ]));
				// accelY.push(null, null, pack([returnedBytes[8], returnedBytes[9] ]),pack([returnedBytes[15], returnedBytes[16] ]));
				// accelZ.push(null, null, pack([returnedBytes[10], returnedBytes[11] ]),pack([returnedBytes[17], returnedBytes[18] ]));
				// expectedCount++;
				// set expectedCount to packetCounter + 1
				// alert(expectedCount+" "+packetCounter);
			}else{
				//alert('Correct packet received');
				//$('#syncreturn').append("<p>Correct packet received: "+packetCounter+"<p>");
				
				// tones.push(returnedBytes[5], returnedBytes[12]);
				// accelX.push(pack([returnedBytes[6], returnedBytes[7] ]),pack([returnedBytes[13], returnedBytes[14] ]));
				// accelY.push(pack([returnedBytes[8], returnedBytes[9] ]),pack([returnedBytes[15], returnedBytes[16] ]));
				// accelZ.push(pack([returnedBytes[10], returnedBytes[11] ]),pack([returnedBytes[17], returnedBytes[18] ]));
				
				// for single sample per packet
				tones.push(returnedBytes[5]);
				accelX.push(pack([returnedBytes[6], returnedBytes[7] ]));
				accelY.push(pack([returnedBytes[8], returnedBytes[9] ]));
				accelZ.push(pack([returnedBytes[10], returnedBytes[11] ]));
				sigStrength.push(returnedBytes[12]);
				motionPerSample.push(returnedBytes[13]);
				//alert(tones);
			}
		}
		
		// -- Received Sleep Data Footer Packet -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 131 && returnedBytes[4] == 48){
			clearTimeout(myDataTimeout);
			
			// $('#syncreturn').append("<p>Footer Received<p>");
			countArray = [returnedBytes[5], returnedBytes[6]];//returnedBytes.slice(5,7);
			packetCounter = packUnsigned(countArray);
			expectedCount++;
			//alert('received footer: '+expectedCount+" "+packetCounter);
			// Remove last second of data since high chance of being empty packet (don't need for single sample per packet)
			// tones.pop();
			// accelX.pop();
			// accelY.pop();
			// accelZ.pop();
			
			if (expectedCount !== packetCounter){
				//$.mobile.loading('hide');
				
				while (expectedCount < packetCounter){
					// tones.push(null, null);
					// accelX.push(null, null);
					// accelY.push(null, null);
					// accelZ.push(null, null);
					
					// for single sample per packet
					tones.push(null);
					accelX.push(null);
					accelY.push(null);
					accelZ.push(null);
					sigStrength.push(null);
					motionPerSample.push(null);
					expectedCount++;
				}
				
				//alert('popup 6: expected: '+expectedCount+" packetCounter: "+packetCounter);
				//$('.ui-popup').popup('close');
				
				globalData = [accelX, accelY, accelZ, tones, dataTime, sigStrength, motionPerSample];
				accelX = []; accelY = []; accelZ = []; tones = []; dataTime = '' ; sigStrength = []; motionPerSample = [];
				
				
				// sendEraseDataCommand();
				
				setTimeout(function(){  // Disconnect here?
					bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
				},100);
				
				
				//alert('Sync Complete. Expected Footer Count: '+expectedCount+ ", Actual Footer Counter: "+packetCounter);
				
				//$('#syncreturn').append("<p>Footer Counter WRONG. Packet Number: sent "+packetCounter+" expected "+expectedCount+"<p>");
			}else{
				if (accelX.length < 240){
					//alert('no data');
					endBtnPressed = false;
					startBtnPressed = false;
					//alert('popup 7');
					setTimeout(function(){
						/* $('.ui-popup').popup('close');
						setTimeout(function(){
							$('#noDataPopup').popup('open');
							//alert('after noDataPopup open');
						},100); */
					},500);
					//$.mobile.loading('hide');
					
					
					notEnoughData = true;
					dataStored = "false";
					localStorage.dataStored = "false";
					toggleNSbtn(dataStored);
					afterForcedDisconnect = true;
					bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
				}else{
					var d = new Date();
					syncEndTime = d.getTime();
					//alert("Sync Seconds :"+(syncEndTime - syncStartTime)/1000+" Accel x: "+JSON.stringify(accelX));
					//alert('Footer contains correct packet! Sync complete!');
					//$('#syncreturn').append("<p>Footer Counter Correct<p>");
					//alert("Total Packets Received: "+packetCounter);
					// alert(accelX);
					// alert(tones);
					//alert(sigStrength);
					// -- Eventually, switch to opening Rating Popup; then, when rating selected, send accel data, tone data, and rating to processRawData -- //
					globalData = [accelX, accelY, accelZ, tones, dataTime, sigStrength, motionPerSample];
					accelX = []; accelY = []; accelZ = []; tones = []; dataTime = '' ; sigStrength = []; motionPerSample = [];
					//$.mobile.loading('hide');
					//alert('popup 8');
					
					//---- Instead of disconnecting here, let's erase the data, and disconnect on successful erase ----//
					
					
					// sendEraseDataCommand();
					
					setTimeout(function(){  // Disconnect here?
						bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
					},100);
					
					
					//$('.ui-popup').popup('close');
					/* setTimeout(function(){  // Disconnect here?
						bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
						
						// $('.cloudBtn').removeClass('hover-low hover-mid hover-high');
						// $('#ratingPopup').popup('open');
					},100); */
					//processRawData(accelX, accelY, accelZ, tones, dataTime);
				}
			}
			
			// $.mobile.loading('hide');
			//$.mobile.loading('show',{text:'Disconnecting...',textVisible: true, theme:'b'});
			// afterForcedDisconnect = true;
			// bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
			
		}
		
		// -- Received Data Check Result -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 148 && returnedBytes[4] == 48){
			//alert(JSON.stringify(returnedBytes));	
			var dataLength = packUnsigned([returnedBytes[5],returnedBytes[6]]);
			//alert('dataLength ' + dataLength);
			if (dataLength > 0){
				//alert("Data available for upload ");
				//-- Prompt user to either download available data, or start new sleep session (deleting old data)
				storedDataLength = dataLength;
				sendGetHeaderCommand();
				
				// $('.ui-popup').popup('close');
				// setTimeout(function(){
					// $('#dataCheckPopup').popup('open');
				// },100);
			}else {
				//alert("No data available for upload");
				
				//-- Start new sleep session
				
				sendStartCommand();
			}
		}
		
		// -- Received Get Data Header Result -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 147 && returnedBytes[4] == 48){
			
			//alert("data date received");
			
			
			//alert("data date received "+ JSON.stringify(returnedBytes));
			/* if (returnedBytes[5] ){
				alert("Data available for upload");
				//-- Prompt user to either download available data, or start new sleep session (deleting old data)
				
				$('.ui-popup').popup('close');
				setTimeout(function(){
					$('#dataCheckPopup').popup('open');
				},100);
			}else {
				alert("No data available for upload");
				
				//-- Start new sleep session
				
				//sendStartCommand()
			} */
		}
		
		// -- Received confirm for Start Sleep Command -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 130 && returnedBytes[4] == 48){
			// alert("received start sleep command echo");	
			dataStored = "true";
			localStorage.dataStored = dataStored;
			toggleNSbtn(dataStored);
			afterForcedDisconnect = true;
			//$.mobile.loading('hide');
			//alert('popup 9');
			setTimeout(function(){
				// $('.ui-popup').popup('close');
				// setTimeout(function(){
					// $('#disconnectingPopup').popup('open');
					// bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
				// },100);
				
				$('#connectingPopup #description').html(labelDisconnecting);
				bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
			},300);
							
		}
		
		// -- Received response for isRecording -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 149 && returnedBytes[4] == 48){
			//alert("Is Recording: "+ JSON.stringify(returnedBytes));					
		}
		
		// -- Received erase command echo -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 150 && returnedBytes[4] == 48){
			//alert("Erasing Echo: "+ JSON.stringify(returnedBytes));	

			//---- Now that data is erased, we can disconnect. Data is still stored in globalData variable though! ----//
			setTimeout(function(){  // Disconnect here?
				bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address});
			},100);
		}
		
		
		
		
	}
	//
}
        
function readSuccess(data){

}
		
        //Failure Callbacks
        
function initFail(e){
	bluetoothEnabled = false;
	//alert('Init fail. Is bluetooth enabled?');
	//$('#sleepBtn, #connectBtn2,#volumeBtn, .tutorialReturn, #alarmBtn, #alarmOnOff').off('click');
	//--- Fallback click handlers for bluetooth disabled ---//
	$("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
	$('#connectCircle').css('background','radial-gradient(#333,black)');
	$('#volumeControl').slider('disable').slider('refresh');
	$('#volumeBalance').slider('disable').slider('refresh');
	
	$(document).off("click","#connectBtn, #connectBtn2, #sleepBtn, #testConnect").on("click","#connectBtn, #connectBtn2, #sleepBtn, #testConnect",function(){
		$('#bluetoothPopup').popup('open');
	});
	$('#volumeBtn').off('click').on("click",function(){
		$('#bluetoothPopup').popup('open');
	});
	$('#alarmBtn').off('click').on("click",function(){
		$('#bluetoothPopup').popup('open');
	});
	$('#alarmOnOff').off('click').on("click",function(){
		$('#bluetoothPopup').popup('open');
	});
	
	$('.tutorialReturn').off('click').on("click",function(){
		$('#bluetoothPopup').popup('open');
	});
	/* $('#sleepBtn, #connectBtn2,#volumeBtn, .tutorialReturn').off('click').on('click',function(){
		$('#bluetoothPopup').popup('open');
	}); */
	$('#bluetoothPopup').popup('open');
}
        
        
        
function scanFail(e){
	//alert('Scan failed: '+JSON.stringify(e));
	errorCode = '0001';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}
        
        
        
function stopFail(e){
	//alert('Stop failed: '+JSON.stringify(e));
	errorCode = '0002';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}
        
        
        
function connectFail(e){
	if (e.error === 'isNotDisconnected'){
		//alert('Connect failed: '+JSON.stringify(e));
	}/* else if (e.error === 'connect'){
	
	} */else{
		alert('Connect failed: '+JSON.stringify(e));
		errorCode = '0003';
		$('#errorCode').html(errorCode);
		$('#errorPopup').popup('open');
	}
}
        
        
        
function servFail(e){
	alert('Service failed: '+JSON.stringify(e));
	errorCode = '0004';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}



function charFail(e){
	alert('Char failed: '+JSON.stringify(e));
	errorCode = '0005';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}



function disconnectFail(e){
	alert("Disconnect Fail: "+JSON.stringify(e));
	errorCode = '0006';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}



function writeFail(e){
	//alert("Write Fail " +JSON.stringify(e)+" "+currentWrite+" "+sigStrengthInterval);
	//clearInterval(sigStrengthInterval);
	errorCode = '0007';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}



function readDescFail(e){
	//alert("Read Descriptor Fail: "+JSON.stringify(e));
	errorCode = '0008';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}



function discoverFail(e){
	//alert("Discovery Fail: "+JSON.stringify(e));
	console.log("Discovery Fail: "+JSON.stringify(e));
	errorCode = '0009';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}

function readFail(e){
	//alert("Read Fail"+JSON.stringify(e));
	errorCode = '0010';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}

function subFail(e){
	alert("Subscribe Fail:"+JSON.stringify(e));
	errorCode = '0011';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}

function closeFail(e){
	if (e.error === "isNotDisconnected"){
	}else{
		alert("Close Fail: " + JSON.stringify(e));
		errorCode = '0012';
		$('#errorCode').html(errorCode);
		$('#errorPopup').popup('open');
	}
}
		
function pack(byteArray) {
	byteArray.reverse();
	var value = 0;
	for ( var i = byteArray.length - 1; i >= 0; i--) {
		value = (value * 256) + byteArray[i];
	}
	
	if (value > Math.pow(2,8*byteArray.length-1)-1){
		value -= Math.pow(2,8*byteArray.length);
	}
	return value;
}

		
function packUnsigned(byteArray) {
	byteArray.reverse();
	var value = 0;
	for ( var i = byteArray.length - 1; i >= 0; i--) {
		value = (value * 256) + byteArray[i];
	}

	return value;
}

function intToBytes(number,arrayLen){
	var hex = number.toString(16);
	if (hex.length % 2){
		hex = '0' + hex;
	}
	var array = hex.match(/.{1,2}/g); //.map(function(entry){return parseInt(entry,16);});
	while (array.length < arrayLen){
		array.unshift("00");
	}
	return array;
}

function getChecksum(array){
	var sum = array.reduce(function(pv, cv){return pv + cv;},0);
	return 255 - sum%256;
}


function hexToUint8(hexArray){
	var writeArray2 = [];
	for ( i = 0; i < hexArray.length; i++){
		writeArray2.push(parseInt(hexArray[i],16));
	}
	writeArray2[writeArray2.length-1] = getChecksum(writeArray2.slice(3,3+writeArray2[2]));
	// alert("Decimal byte array: "+JSON.stringify(writeArray2));
	//alert(writeArray2);
	writeArray2 = new Uint8Array(writeArray2);
	return writeArray2;
}


function isConnectedCallback(data){
	//alert("in isConnectedCallback: "+JSON.stringify(data));
	var blah;
	if (data.error === "neverConnected"){ // hits if you haven't been connected to the device since opening the app
		//scan as usual...
		// alert("never connected");
		/* var d = new Date();
		syncStartTime = d.getTime();
		bluetoothle.startScan(scanSuccess, scanFail,null);

		setTimeout(function(){
	
			bluetoothle.stopScan(stopSuccess,stopFail)
		
		}
		, 1000); */
		//alert('here');
		if (promptToConnect){
			// alert("prompt to connect = true");
			// open connectPopup: yes calls connect fcn, no does nothing
			neverConnected = true;
			//$('#connectPopup').popup('open');
			/* var reply = confirm("In order to use this page, you must connect to your Sleep Shepherd. Connect now?");
			if (reply){
				$.mobile.loading('show', {text: 'Connecting...',textVisible: true, theme:'b'});
				bluetoothle.connect(connectSuccess, connectFail, {"address": address});
			} */
		}else if (forgettingDevice){
			//alert('forget device 1');
			$('#forgetDevice').addClass('noDisplay');
			//alert('address = null in isConnected - never connected');
			address = null;
			localStorage.removeItem('address');
			forgettingDevice = false;
			deviceSetup = false;
			
			dataStored = "false";
			localStorage.dataStored = "false";
			toggleNSbtn(dataStored);
		}else{
			//alert('never connected, before connect');
			$('#connectingPopup').popup('open');
			// alert("prompt to connect = false");
			bluetoothle.connect(connectSuccess, connectFail, {"address": address});
		}
		
		if (afterForcedDisconnect){
			// alert("after forced disconnect = true");
			// bluetoothle.connect(connectSuccess, connectFail, {"address": address});
		}else{
			// alert("after forced disconnect = false");
		}
		
		
	}else
	if (platform === "iOS"){
		// alert(" data.isConnected : "+data.isConnected);
		
		if (data.isConnected === true){ // connected to previously-connected device; hits if you have have connected before or are connected now. on iOS returns false when connected/true when not... on Android works as expected  
			
			
			if (forgettingDevice){
				//alert('forget device 2');
				$('#disconnectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});		
			}else if(settingsConnect){
				//alert('here?');
				disconnecting = true;
				$('#disconnectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});	
				clearTimeout(connectTimeout);
			}else{
				blah = {status: "subscribed"};
				subSuccess(blah);
			}
		}else if (data.isConnected === false){ // not connected to a previously-connected device

			//alert('here' + +reconnect+" "+accidentalDisconnect+" "+settingsConnect+" "+forgettingDevice);
			if (reconnect){
				// alert('did we get here?');
				$('#connectingPopup').popup('open');
				//bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
				
				bluetoothle.close(closeSuccess,closeFail, {"address": address});
			}else if(accidentalDisconnect && !settingsConnect && !forgettingDevice){
				// alert("i get in here huh?");
				//$('#connectPopup').popup('open');
			}else if (settingsConnect){

				//alert('yep we get here, not connected before reconnect');
				$('#connectingPopup').popup('open');
				// alert("prompt to connect = false");
				bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
			}else if (forgettingDevice){
				//alert('forget device 3');
				$('#forgetDevice').addClass('noDisplay');
				//alert('address = null in isConnected - not connected to a previous connected device');
				address = null;
				localStorage.removeItem('address');
				forgettingDevice = false;
				deviceSetup = false;
				
				dataStored = "false";
				localStorage.dataStored = "false";
				toggleNSbtn(dataStored);
			}else{
				//alert('else in isConnected under iOS not connected');
				$('#connectingPopup').popup('open');
				// alert("prompt to connect = false");
				bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
					
			}
		}
	}else if (platform === "Android"){
		if (data.isConnected === true){ // connected to previously-connected device; hits if you have have connected before or are connected now. on iOS returns false when connected/true when not... on Android works as expected  
			
			
			if (forgettingDevice){
				$('#disonnectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});		
			}else if(settingsConnect){
				//alert('here?');
				disconnecting = true;
				$('#disconnectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});	
				clearTimeout(connectTimeout);
			}else{
				blah = {status: "subscribed"};
				subSuccess(blah);
			}
		}else if (data.isConnected === false){ // not connected to a previously-connected device
			//alert('here' + +reconnect+" "+accidentalDisconnect+" "+settingsConnect+" "+forgettingDevice);
			if (reconnect){
				// alert('did we get here?');

				//bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
				$('#connectingPopup').popup('open');
				bluetoothle.close(closeSuccess,closeFail, {"address": address});

			}else if(accidentalDisconnect && !settingsConnect && !forgettingDevice){
				// alert("i get in here huh?");
				//$('#connectPopup').popup('open');
			}else if (settingsConnect){
				//alert('yep we get here');
				$('#connectingPopup').popup('open');
				// alert("prompt to connect = false");
				bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
			}else if (forgettingDevice){
				// alert('or did we get here?');
				$('#forgetDevice').addClass('noDisplay');
				//alert('address = null in isConnected - not connected to a previous connected device');
				address = null;
				localStorage.removeItem('address');
				forgettingDevice = false;
				deviceSetup = false;
				
				dataStored = "false";
				localStorage.dataStored = "false";
				toggleNSbtn(dataStored);
			}
		}
	}else{
		//alert('we get here dont we?');
		if (settingsConnect){

			//alert('huh here? before we get platform before connect');
			$('#connectingPopup').popup('open');
			// alert("prompt to connect = false");
			bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
		}
	}
}
		
		function isDiscoveredCallBack(data){
			connected = true;
			//alert("here in isDiscovered: "+JSON.stringify(data));
			if (data === null){
				sendConfirmationCommand();
				setTimeout(function(){				
					bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
				},300);
			}else if (data.isDiscovered === false){
				bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
			}else{
				sendConfirmationCommand();
				setTimeout(function(){				
					bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
				},300);

			}
		}
		
		function checkPacket(packet){
			// need to check for: 1) packet start bytes, 2) number of bytes = packetLength, and 3) checksum
			if (packet[0] === 170 && packet[1] === 170){
				var payload = packet[2];
				if (packet.length === (payload+3) ){
					var data = packet.slice(3,payload + 3);
					if (packet[packet.length-1] == getChecksum(data)){
						// Passed all checks
					}else{
						// Failed checksum
					}
				}else{
					// Failed packet length
				}
			}else{
				// Failed to get start bytes
			}
		}
		
		function volumeMap2(data){
			var maxRaw = 140; // lowest volume
			var minRaw = 50; // highest volume
			
			var max = 100;
			var min = 0;
			
			var percent = 1-(data-minRaw)/(maxRaw-minRaw);
			 
			return Math.round(percent*(max-min)+min);
		}
		
		function volumeMap(chip){
			 var slider = Math.floor(-10*(chip - 140)/9);
			return slider;
		}
		
		function volumeMap2(chip){
			var availableVolumes = [178,140,129,118,107,96,85,74,63,52,40];
			return availableVolumes.indexOf(chip)*10;
		}
		
		
		function volumeUnmap(slider){
			var chip = Math.floor(-9*slider/10 + 140);
			return chip;
		}
		
		function volumeUnmap2(slider){
			var availableVolumes = [178,140,129,118,107,96,85,74,63,52,40];
			return availableVolumes[Math.round(slider/10)];
		}
		
		/* function sendVolUpCmd(){
			//$("#sleepVolUpBtn").off("vclick");
			//alert("vol up btn pressed");
			var hexArray = ["AA","AA","03","84","40","D1",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		} */
			
			
		function sendDataRecordingCmd(){
			//$("#sleepVolUpBtn").off("vclick");
			//alert("vol up btn pressed");
			currentWrite = "checking if data is recording";
			var hexArray = ["AA","AA","03","95","20","00",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function sendTurnOffRecordCmd(){
			//$("#sleepVolUpBtn").off("vclick");
			//alert("vol up btn pressed");
			currentWrite = "checking if data is recording";
			var hexArray = ["AA","AA","03","95","10","00",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function setVolCmd(value){
			currentWrite = "Set Volume";
			
			//alert("change happened");
			var hexValue = value.toString(16);
			var hexArray = ["AA","AA","03","84","10",hexValue,""];
			//alert(JSON.stringify(hexArray));
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function setBalCmd(value){
			currentWrite = "Set Balance";
			//alert("change happened");
			var hexValue = value.toString(16);
			var hexArray = ["AA","AA","03","85","10",hexValue,""];
			//alert("Balance Hex Array: "+JSON.stringify(hexArray));
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function getSignalStrength(){
			currentWrite = "Get Signal Strength";
			var hexArray = ["AA","AA","03","44","20","00",""];
			//alert("Balance Hex Array: "+JSON.stringify(hexArray));
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		function setWakeTime(value){
			currentWrite = "Set Wake Time";
			var byteValue = intToBytes(value, 4);
			for (i = 0 ; i < byteValue.length; i++){
				byteValue[i] = byteValue[i].toString(16).toUpperCase();
			}
			var hexArray = ["AA","AA","06","34","10"];
			hexArray = hexArray.concat(byteValue,[""]);
			//alert(hexArray);
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function setWakeFlag(){
			var hexArray = ["AA","AA","03","35","10","01",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		/* function sendVolDownCmd(){
			//$("#sleepVolDownBtn").off("vclick");
			//alert("vol down btn pressed");
			var hexArray = ["AA","AA","03","84","40","D2",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		} */
		
		function getVolume(){
			//alert("in getVolume");
			currentWrite = "Get Volume";
			var hexArray = ["AA","AA","03","84","20","00",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			// alert("writing get volume command");
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function getBalance(){
			//alert("in getVolume");
			currentWrite = "Get Balance";
			var hexArray = ["AA","AA","03","85","20","00",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			// alert("writing get volume command");
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function getVersionNumber(){
			currentWrite = "Get Version #";
			var hexArray = ["AA","AA","03","99","20","00",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			// alert("writing get volume command");
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function processAccelData(accelX, accelY, accelZ){
			var angle = "", headTilt = "";  //angle: up, slight left, left, left down, straight down, right down, right, slight right; 
			if (accelZ < - 900){
				headTilt = "straight down"; //head stand
			}else if (accelZ < 800){
				headTilt = "lying down";
				// laying down
				if (accelY > 0){
					// to the left
					if (accelX < 0.9*-1129){
						// straight up
						angle = "straight up";
					}else if (accelX < -650){
						// slight left
						angle = "slight left";
					}else if (accelX < 300){
						// left
						angle = "left";
					}else if (accelX < 0.9*1070){
						// left down
						angle = "left down";
					}else{
						// straight down
						angle = "down";
					}
				}else{
					// to the right
					if (accelX < 0.9*-1129){
						// straight up
						angle = "straight up";
					}else if (accelX < -650){
						// slight right
						angle = "slight right";
					}else if (accelX < 300){
						// right
						angle = "right";
					}else if (accelX < 0.9*1070){
						// right down
						angle = "right down";
					}else{
						// straight down
						angle = "down";
					}
				}
			}else{
				headTilt = "straight up";
				// sitting up
			}
			return [angle, headTilt];
		}
		
		function updateOrientationPlots(orientationArray){
			var angle = orientationArray[0];
			var headTilt = orientationArray[1];
			//alert(JSON.stringify(orientationArray));
			switch (headTilt){
				case "lying down":
					$('#tiltImg').removeClass().addClass("side");
				break;
				case "straight down":
					$('#tiltImg').removeClass().addClass("down");
				break;
				default:
					$('#tiltImg').removeClass().addClass("up");
			}
			
			switch (angle){
				case "slight left":
					$('#angleImg').removeClass().addClass("slightLeft");
				break;
				case "left":
					$('#angleImg').removeClass().addClass("left");
				break;
				case "left down":
					$('#angleImg').removeClass().addClass("leftDown");
				break;
				case "down":
					$('#angleImg').removeClass().addClass("down");
				break;
				case "right down":
					$('#angleImg').removeClass().addClass("rightDown");
				break;
				case "right":
					$('#angleImg').removeClass().addClass("right");
				break;
				case "slight right":
					$('#angleImg').removeClass().addClass("slightRight");
				break;
				default:
					$('#angleImg').removeClass().addClass("up");

			}
		}
		
		function processRawData(data){ // should probably add tones and date as inputs
			//alert('start of processRawData');
			
			//alert(JSON.stringify(data));
			var Ax = data[0];
			var Ay = data[1];
			var Az = data[2];
			var tones = data[3];
			var date = data[4];
			var sig = data[5];
			var motionPS = data[6];
			var rate = data[7];
						
			var alternateData = processRawData4(data);
			var alternateScore = alternateData[0];
			/* var timeArr = alternateData[1];
			for (i = 0 ; i < timeArr.length; i++){
				timeArr[i] *= 3600*1000;
				timeArr[i] += date;
			} */
			
			var alternateData2 = processRawData6(data);
			var alternateScore2 = alternateData2[0];
			var timeArr = alternateData2[2];
			for (i = 0 ; i < timeArr.length; i++){
				timeArr[i] *= 3600*1000;
				timeArr[i] += date;
			}
			//alert('in processRawData, altScore2.length: '+alternateScore2.length+ ', Ax.length: '+Ax.length);
			
			var rem = alternateData2[1];
			var badSig = alternateData2[3];
			var overallScore = alternateData2[4];
			var timesAwoken = alternateData2[5];
			
			
			//alert("alternateScore: "+alternateScore);
			//alert(timeArr[0]+" "+timeArr[1]);
			//alert("sig strength in processRawData(): "+sig);
			
			// alert("accelX: "+Ax+" accelY: "+Ay+" accelZ: "+Az+" tones: "+tones);
			var d = new Date();
			var processStartTime = d.getTime();
			var minX, maxX, minY,maxY, minZ, maxZ, straightUpMax, slightLeftMax,leftUpMax, leftDownMax, AzMax, AzMin, framesToSkip;

			minX = -1129;
			maxX = 1070;
			minY = -1200;
			maxY = 1200;
			minZ = -890;
			maxZ = 1200;

			// Accelerometer orientation boundary values
			straightUpMax = 0.9*minX;
			slightLeftMax = 0.58*minX;
			leftUpMax = 0.27*maxX;
			leftDownMax = 0.9*maxX;
			AzMax = 800;
			AzMin = -900;
			framesToSkip = 20;
			var orientation = [];
			// Find orientation at every point (NOTE: every point is every 20 seconds)
			for (i = 0; i < Ax.length ; i++ ){
				if (Az[i]>AzMin && Az[i]<AzMax){ //Not sitting up, or standing on your head
					if (Ay[i]>=0){ // Somewhere on tilted to the left
						if (Ax[i]<straightUpMax){
							orientation[i] = 4; //Straight Up
						}else if (Ax[i]<slightLeftMax){
							orientation[i] = 3; //Slight left
						}else if (Ax[i]<leftUpMax){
							orientation[i] = 2; //Left Up
						}else if (Ax[i]<leftDownMax){
							orientation[i] = 1; //Left Down
						}else{
							orientation[i] = 8; //Straight Down
						}
					}else{ //Ay[i]<0 && Ay[i]>minY  //Somewhere tilted to right
						if (Ax[i]<straightUpMax){
							orientation[i] = 4; //Straight Up
						}else if (Ax[i]<slightLeftMax){
							orientation[i] = 5; //Slight Right
						}else if (Ax[i]<leftUpMax){
							orientation[i] = 6; // Right Up
						}else if (Ax[i]<leftDownMax){
							orientation[i] = 7; //Right Down
						}else{
							orientation[i] = 8; //Straight Down
						}
					}
				}else if (Az[i] > AzMax){
					orientation[i] = 9; //Sitting Up
				}else{ //Az[i]<AzMin
					orientation[i] = 10; //Head Stand
				}
			}
			//alert("Motion: "+JSON.stringify(orientation));
			// Find Motion Events
			var motion = [];	
			for (i = 0 ; i < orientation.length ; i++){
				if (orientation[i] !== orientation[i+1]){
					motion[i] = 1;
				}else{
					motion[i] = 0;
				}
			}
			
			var motionEvents = motion.reduce(function(pv, cv) { return pv + cv; }, 0);
			
			function windowSum(window, data){
				var newData = [];
				for (i = 0; i < data.length ; i++){
					var lindex = i - window;      //Left index
					var rindex = i + window;      //Right index
					if ( i - window < 1) lindex = 1;       //If left index <1, left index is set =1
					if ( i + window > data.length - 1 ) rindex = data.length - 1;      //If right index > # of data points, right index set = (# of data points)
					newData[i] = data.slice(lindex,rindex+1).reduce(function(pv, cv) { return pv + cv; }, 0);  
				}
				return newData;
			}
			
			

			var window1 = Math.round(720/framesToSkip);
			var window2 = Math.round(1000/framesToSkip);
			sleepState = windowSum(window2,windowSum(window1, motion));
			
			//alert("Sleep State after windowSum: "+ JSON.stringify(sleepState));
			
			var maxEvents = 400;
			var minEvents = 100; 
			// Determine how to scaled smoothed function
			var asleepConst = (motionEvents-minEvents)*20/maxEvents+60; 
			var asleepMax = Math.random()*10+asleepConst;                                          // Maximum value of the internal peaks. The more events, the higher the value of the maximum peak. A random component of +/- 10 added
			sleepState = sleepState.map(function(x){return x*asleepMax/getMaxOfArray(sleepState);});                           // Scale SleepState according to calculated maximum
			
			//alert("Sleep State after scaling: "+ JSON.stringify(sleepState));
			
			// Determine introduction interval length
			var introConst = (motionEvents-minEvents)*0.5/maxEvents+0.45;                         // Arduino equivalent map(# of events, minEvents, maxEvents,0.45,0.9). This returns fraction of one hour for the length of the introduction curve (curve at beginning of data).
			var introInterval = Math.round(introConst*Math.round(3600/framesToSkip));                  // Returns number of data points that the introduction curve will take.
			//alert("Intro interval: "+introInterval);
			//introInterval = 3;   													// needs to be scaled based on how many data points we have
			var introMin = sleepState[introInterval];                                  // Value at the end of the introduction curve, to keep plot continuous.
			var introMax = 100;
			// Calculate the introduction curve
			var time = [];
			for (i = 0; i < introInterval ; i++){
				time[i] = (i-1)/(introInterval-1)*Math.PI;                                    // For each index, create a time to allow for calculation of a cosine function. map(index,1,introduction interval length,0,pi)
				sleepState[i] = (introMax-introMin)/2*Math.cos(time[i])+(minEvents-introMin)/2+introMin; //Calculate new SleepState value for each data point in the introduction curve range
			}
			
			//alert('after intro');
			
			// Determine outroduction interval length
			var outroConst = -0.125*(motionEvents-minEvents)/maxEvents+0.25;         // map(# of events, minEvents,maxEvents, 0.125,0.25). Returns fraction of one hour for outroduction interval. Higher constant = shorter outroduction.
			var outroInterval = Math.round(outroConst*Math.round(3600/framesToSkip));     //Number of data points to be used in outroduction curve
			//outroInterval = 3;
			var outroStart = orientation.length-outroInterval;                 //Beginning index of outroduction 

			var outroMin = sleepState[outroStart];                              //Beginning value of outroduction
			var outroMax = Math.random()*20+50;                                       //Ending value of outroduction. Returns random value between 50 and 70

			
			
			//Flip sign if OutroMin > OutroMax (if value at end happens to be higher than random value for the end of outroduction
			amp = outroMax-outroMin;
			var sign;
			if (amp <0){
				sign = -1;
			}else{  
				sign = 1;
			}

			//Calculate the outro curve
			time = [];  
			for (i = 0; i < outroInterval ; i++){
				time[i] = (i-1)/(outroInterval-1)*Math.PI; // For each index, create a time to allow for calculation of a cosine function. map(1,outroduction interval length,0,pi)
				sleepState[i+outroStart] = -sign*(outroMax-outroMin)/2*Math.cos(time[i])+sign*(outroMax-outroMin)/2+outroMin; //Calculate new SleepState value for each data point in the outroduction curve range
			}
			
			//alert('after outro');
			
			for (var i = 0, l = sleepState.length; i < l; i++){
				sleepState[i] = parseFloat(sleepState[i].toFixed(2));
			}
			
			//alert('before pushing to global data');
			
			globalData.push(sleepState);
			
			var orientation2 = []; // 1 = ceiling, 2 = right, 3 = floor, 4 = left, 5 = sitting up, 6 = head stand
			
			for (i = 0 ;  i < Ax.length ; i++){
				if (Ax[i] > 600 && Math.abs(Ay[i]) < 600 && Math.abs(Az[i]) < 750){
					//$('#placeholder').html('Up');
					orientation2.push(1);
				}else if (Ay[i] > 600 && Math.abs(Ax[i]) < 600 && Math.abs(Az[i]) < 750){
					//$('#placeholder').html('Right');
					orientation2.push(2);
				}else if (Ay[i] < -600 && Math.abs(Ax[i]) < 600 && Math.abs(Az[i]) < 750){
					//$('#placeholder').html('Left');
					orientation2.push(4);
				}else if (Ax[i] < -600 && Math.abs(Ay[i]) < 600 && Math.abs(Az[i]) < 750){
					//$('#placeholder').html('Down');
					orientation2.push(3);
				}else if (Az[i] > 750){
					//$('#placeholder').html('Sitting Up');
					orientation2.push(5);
				}/* else if (Az[i] < -400){
					//$('#placeholder').html('Head Stand');
					orientation2.push(6);
				} */else{
					orientation2.push(null);
				}
			}
			
			//alert('after orientation2');
			
			orientation3 = [];
			for (i = 0 ; i < Ax.length ; i++){
				if( Math.abs(Az[i]) < 750){
					if (Math.abs(Ax[i]) < 750){
						if (Ay[i] > 0){
							orientation3.push(2);
						}else if(Ay[i] <= 0){
							orientation3.push(4);
						}else{
							orientation3.push(1);
						}
					}else if (Ax[i] > 750){
						orientation3.push(1);
					}else{
						orientation3.push(6);
					}
				}else{
					orientation3.push(6);
				}
			}
			
			// orientation4 = []; // Orientation tailored to headband
			// for (i = 0 ; i < Ax.length ; i++){
				 // if  (Math.abs(Ay[i])<750){ //Not sitting up, or standing on your head
					  // if (Ax[i]>=0){
						  // if (Math.abs(Az[i]) < 600){
							 // orientation4.push(2); //% Left
								 // } 
						  // else if (Az[i]>600){
								// orientation4.push(1);//% Up
							 // }
						  // else{
							// orientation4.push(6); //% Down
							// }
					  // }  
						// else{ //Ax[i] <=0 
							// if (Math.abs(Az[i]) < 600){
								// orientation4.push(4); //% Right
							  // }
							// else if (Az[i]>570){
								// orientation4.push(1); //% Up
							  // }
							// else{
								// orientation4.push(6); //% Down
							// }
						// }
					// }
			   // else if (Ay[i] > 750){
						// orientation4.push(6); //%Sitting Up
					// }
			   // else{
					// orientation4.push(6); //% Head Stand
				// }
			// }
			
			orientation4 = orientationCalc2(Ax,Ay,Az,Ax.length);
			
			
			//alert('after orientation3');
			
			emailData = $('#email-flip').val();
			localStorage.emailData = emailData;
			
			//emailData = "true";
			//alert(emailData);
			
			// var axCopy = [];
			// var ayCopy = [];
			// var azCopy = [];
			// var tonesCopy = [];
			// var sigCopy = [];
			// var motionEventCopy = [];
			// var scoreCopy = [];
			// for (i = 0 ; i < Ax.length ; i+=15){
				// axCopy.push(Ax[i]);
				// ayCopy.push(Ay[i]);
				// azCopy.push(Az[i]);
				// tonesCopy.push(tones[i]);
				// sigCopy.push(sig[i]);
				// motionEventCopy.push(motionPS[i]);
				// scoreCopy.push(sleepState[i]);
			// }
			emailData = false;
			/* if (emailData === "true"){
				//alert("email data is on");
				
				var accelX = JSON.stringify(Ax);
				var accelY = JSON.stringify(Ay);
				var accelZ = JSON.stringify(Az);
				var tonesagain = JSON.stringify(tones);
				var sleepStateCopy = JSON.stringify(sleepState);
				var sigStrengthCopy = JSON.stringify(sig);
				var motionCopy = JSON.stringify(motionPS);
				var ratingCopy = rate;
				var dateString = new Date(date).toString();
				$.ajax({
					url: "http://www.sleephat.com/admin/exportData.php",
					data: {
						accelX: accelX,
						accelY: accelY,
						accelZ: accelZ,
						tones: tonesagain,
						date: dateString,
						sigStrength: sigStrengthCopy,
						motionPerSample: motionCopy,
						address: address,
						sleepState: sleepStateCopy,
						rating: ratingCopy,
					},
					method: 'post',
					dataType: "json",
					success: function(data){
						//alert(data);
					},
					error: function(jqXHR, textStatus, errorThrown){
						//alert(errorThrown);
					}
					
					
				});
			
			} */
			
			
			
			// alert(orientation2);
			// alert("sleep state: "+sleepState);
			//alert('before creating last sleep object');
			// Now that we have our time history of sleep state, we can calculate: Overall Score, amount of deep, light, and awake states, 
			
			
			lastSleep = {};
			lastSleep.totalScore = parseInt(100 - arrayMean(alternateScore2))/* *(1+(arraySum(stateCount(sleepState))/3600 - 7)/10) */;
			
			lastSleep.totalScore = overallScore;
			
			lastSleep.rating = rate;
			lastSleep.states = stateCount(alternateScore2);
			
			lastSleep.percents = getPercentages(lastSleep.states);
			lastSleep.angles = orientation4;
			// alert("tone length:  "+tones.length + ", score length: "+sleepState.length);
			
			//lastSleep.tones = tones;
			var toneOnOff = tones.map(function(x){
				if (x > 0){
					return 1;
				}else{
					return 0;
				}
			});
			tones = tones.map(function(x){
				if ( x > 0 ){
					return 100;
				}else if(x == null){
					return null;
				}else{
					return 0;
				}
			});
			lastSleep.tones = tones;
			lastSleep.toneTime = arraySum(toneOnOff)*secondsPerReading;
			//alert("lastSleep.tonesOnOff "+JSON.stringify(lastSleep.tonesOnOff));
			lastSleep.scores = sleepState;
			lastSleep.time = date;
			var dummyDate = new Date(date);
			lastSleep.label = (dummyDate.getMonth()+1)+"/"+dummyDate.getDate();
			console.log(lastSleep.label);
			
			lastSleep.timeArr = timeArr;
			lastSleep.scoresAlt = alternateScore;
			lastSleep.scoresAlt2 = alternateScore2;

			lastSleep.rem = rem;
			lastSleep.badSig = badSig;
			lastSleep.msFromMidnight = msFromMidnight(date);
			lastSleep.timesAwoken = timesAwoken;
			//alert('before calling updateAvgs');
			//alert("last sleep in process fcn: "+JSON.stringify(lastSleep));
			updateAvgs(lastSleep);
			//alert("lastSleep.time: "+lastSleep.time);
			
			d = new Date();
			var processEndTime = d.getTime();
			//alert("Processing took: "+ (processEndTime - processStartTime)/1000);
		//-------- Set Up Line Graph ---------------------//
			//alert(JSON.stringify(sleepState));
			
			//alert('end of processRawData()');
		}
		
		function updateLastSleepPie(values){
			// values is array with three values adding to 100
			//alert('in updateLastSleepPie() - '+values);
			$('#main-pie').highcharts({
				chart: {
					backgroundColor:  null, //'#d6dadf',
					plotBackgroundColor: null,
					plotBorderWidth: 0,
					plotShadow: false,
					marginTop: 10,
					marginBottom: 0,
					spacing: [0,0,0,0],
				},
				credits: {
					   enabled: false
				},
				title: {
					text: '',
					align: 'center',
					verticalAlign: 'middle',
					y: 50
				},
				tooltip: {
					enabled: false,
					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						enableMouseTracking: false,
						dataLabels: {
							enabled: false,
							distance: -50,
							style: {
								fontWeight: 'bold',
								color: 'white',
								textShadow: '0px 1px 2px black'
							}
						},
						startAngle: -135,
						endAngle: 135,
						size: '100%',
						slicedOffset: 0,
						//center: ['50%', '75%']
					}
				},
				series: [{
					type: 'pie',
					name: '',
					innerSize: '80%',
					borderWidth: 0,
					data: 
						[{
						name:'BadSignal',   	
						y:values[3], 
						color: {
							radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
							stops: [
								[0.8, Highcharts.Color(Highcharts.getOptions().colors[6]).get('rgb')],
								[0.85, Highcharts.Color(Highcharts.getOptions().colors[6]).brighten(0.05).get('rgb')],
								[0.95, Highcharts.Color(Highcharts.getOptions().colors[6]).brighten(0.05).get('rgb')],
								[1, Highcharts.Color(Highcharts.getOptions().colors[6]).get('rgb')]
							]
							// Highcharts.getOptions().colors[1]
							} 
						},{
						name:'Deep',   	
						y:values[0], 
						color: {
							radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
							stops: [
								[0.8, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')],
								[0.85, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(0.05).get('rgb')],
								[0.95, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(0.05).get('rgb')],
								[1, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')]
							]
							// Highcharts.getOptions().colors[1]
							}
						},{
						name:'Light',   	
						y:values[1], 
						color: {
							radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
							stops: [
								[0.8, Highcharts.Color(Highcharts.getOptions().colors[1]).get('rgb')],
								[0.85, Highcharts.Color(Highcharts.getOptions().colors[1]).brighten(0.05).get('rgb')],
								[0.95, Highcharts.Color(Highcharts.getOptions().colors[1]).brighten(0.05).get('rgb')],
								[1, Highcharts.Color(Highcharts.getOptions().colors[1]).get('rgb')]
							]
							// Highcharts.getOptions().colors[1]
							}
						},{
						name:'Awake',   	
						y:values[2], 
						color: {
							radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
							stops: [
								[0.8, Highcharts.Color(Highcharts.getOptions().colors[2]).get('rgb')],
								[0.85, Highcharts.Color(Highcharts.getOptions().colors[2]).brighten(0.05).get('rgb')],
								[0.95, Highcharts.Color(Highcharts.getOptions().colors[2]).brighten(0.05).get('rgb')],
								[1, Highcharts.Color(Highcharts.getOptions().colors[2]).get('rgb')]
							]
							// Highcharts.getOptions().colors[1]
							} 
						}]
				}]
			});
			
		
		}
		
function updateTrends(dayValues, weekValues, monthValues){
	// values is an array of arrays = [ [deepSleepArray], [lightSleepArray], [awakeArray]]
	//values = [[5,7,8,1,6,8,4],[3,2,4,5,8,9,4],[1,3,2,1,2,3,2]];
	var dayLabels = dayValues[3];
	while (dayLabels.length < 7){
		dayLabels.push("");
	}
	var weekLabels = weekValues[3];
	while (weekLabels.length < 7){
		weekLabels.push("");
	}
	var monthLabels = monthValues[3];
	while (monthLabels.length < 7){
		monthLabels.push("");
	}	
}

function updateTrends2(values){
	// values is an array of arrays = [ [deepSleepArray], [lightSleepArray], [awakeArray]]
	//values = [[5,7,8,1,6,8,4],[3,2,4,5,8,9,4],[1,3,2,1,2,3,2]];
	//alert("in updateTrends2() "+JSON.stringify(values));
	var deep = values[0];
	while(deep.length < 7){
		// deep.push(0);
		deep.unshift(0);
	}
	
	var light = values[1];
	while(light.length < 7){
		// light.push(0);
		light.unshift(0);
	}
	  
	var awake = values[2];
	while(awake.length < 7){
		// awake.push(0);
		awake.unshift(0);
	}
	
	var labels = values[3];
	while (labels.length < 7){
		// labels.push("");
		labels.unshift("");
	}
	
	var badSig;
	if (values.length === 5){
		badSig = values[4];
		
	
	}else{
		badSig = [0,0,0];
	}
	
	while (badSig.length < 7){
		// badSig.push(0);
		badSig.unshift(0);
	}
	
	//alert('after grabbing badSig');
	var totals = [];
	for (var i = 0; i < deep.length ; i++){
		totals.push(deep[i]+light[i]+awake[i]+badSig[i]);
	}
	var totalMax = arrayMax(totals);
	
	var yLabel = labelHours;
	
	for ( i = 0 ; i < deep.length ; i++){
		deep[i] /= 3600;
		light[i] /= 3600;
		awake[i] /= 3600;
		badSig[i] /= 3600;
	}
		
		
	// if (totalMax > 1800){
		// for ( i = 0 ; i < deep.length ; i++){
			// deep[i] /= 3600;
			// light[i] /= 3600;
			// awake[i] /= 3600;
		// }
		
		// yLabel = 'Hours';
	// }else if (totalMax > 60){
		// for ( i = 0 ; i < deep.length ; i++){
			// deep[i] /= 60;
			// light[i] /= 60;
			// awake[i] /= 60;
		// }
		// yLabel = 'Minutes';
	// }else{
		// yLabel = 'Seconds';
	// }	
	
	$('#trends-day').highcharts({

		chart: {
			type: 'column',
			backgroundColor: null,
		},
		credits: {
			   enabled: false
		},
		title: {
			text: ''
		},

		xAxis: {
			categories: labels
		},

		yAxis: {
			allowDecimals: false,
			min: 0,
			//max: 10*3600,
			title: {
				text: yLabel,
				rotation: 0,
				x: -25,
				align: 'low',
				offset: 0,
				y: 20
			},
			
		},
		legend:{
			enabled: false,
		},
		tooltip: {
			enabled: false,
			formatter: function () {
				return '<b>' + this.x + '</b><br/>' +
					this.series.name + ': ' + this.y + '<br/>' +
					'Total: ' + this.point.stackTotal;
			}
		},

		plotOptions: {
			column: {
				stacking: 'normal',
				animation:{
					duration: 1000
				}
			},
			series: {
				pointPadding: 0,
				groupPadding: 0.05,
				borderRadius: 0,
				borderWidth: 0,
			}
		},

		series: [{
			name: 'Awake',
			data: awake,
			stack: 'male',
			color: {
						linearGradient: { x1: 0, y1: 0.5, x2:1, y2:  0.5},
						stops: [
							[0, Highcharts.Color(Highcharts.getOptions().colors[2]).get('rgb')],
							[0.5, Highcharts.Color(Highcharts.getOptions().colors[2]).brighten(0.05).get('rgb')],
							[1, Highcharts.Color(Highcharts.getOptions().colors[2]).get('rgb')]
						]
						// Highcharts.getOptions().colors[2]
						}
		},{
			name: 'Light',
			data: light,
			stack: 'male',
			color: {
						linearGradient: { x1: 0, y1: 0.5, x2:1, y2:  0.5},
						stops: [
							[0, Highcharts.Color(Highcharts.getOptions().colors[1]).get('rgb')],
							[0.5, Highcharts.Color(Highcharts.getOptions().colors[1]).brighten(0.05).get('rgb')],
							[1, Highcharts.Color(Highcharts.getOptions().colors[1]).get('rgb')]
						]
						// Highcharts.getOptions().colors[1]
						}
		}, {
			name: 'Deep',
			data: deep,
			stack: 'male',
			color: {
						linearGradient: { x1: 0, y1: 0.5, x2:1, y2:  0.5},
						stops: [
							[0, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')],
							[0.5, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(0.05).get('rgb')],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')]
						]
						// Highcharts.getOptions().colors[0]
						}
		},{
			name: 'Bad Signal',
			data: badSig,
			stack: 'male',
			color: {
						linearGradient: { x1: 0, y1: 0.5, x2:1, y2:  0.5},
						stops: [
							[0, Highcharts.Color(Highcharts.getOptions().colors[6]).get('rgb')],
							[0.5, Highcharts.Color(Highcharts.getOptions().colors[6]).brighten(0.05).get('rgb')],
							[1, Highcharts.Color(Highcharts.getOptions().colors[6]).get('rgb')]
						]
						// Highcharts.getOptions().colors[2]
						}
		}]
	});
}


function updateSleepLab(values,toneValues, time , alternateValues, timeArray, remArray, badSigArray){
	// 15 minutes of recording gives 457 data points => 1 datapoint for every 2 seconds ?
	var blah1 = mapToMaxPoints(values);
	//alert('after mapToMaxPoints');
	var plotValues = blah1[0];
	var plotPointInterval = blah1[1]; // in seconds;
	//alert("got here: "+plotValues);
	//alert('after mapping values');
	
	dummyTimeBlah = [];
	var newTime = new Date(time).getTime();
	if (timeArray.length === 0){
		//alert('here');
		for (i = 0 ; i < values.length ; i++){  
			dummyTimeBlah.push(newTime);
			newTime += 15*1000;
		}
		timeArray = dummyTimeBlah;
	}
	
	
	
	//alert(labelDeep+" "+labelLight+" "+labelAwake);
	
	var dummyValues = mapToMaxPoints(alternateValues);
	alternateValues = dummyValues[0];
	
	var blah = mapToMaxPoints(values);
	values = blah[0];
	
	var blahREM = mapToMaxPoints(remArray);
	remArray = blahREM[0];
	
	var dummyTime = mapToMaxPoints(timeArray);
	timeArray = dummyTime[0];
	
	
	var blahBadSig = mapToMaxPoints(badSigArray);
	badSigArray = blahBadSig[0];
	//alert('after mapping alternate data to max points');
	
	var alternateData = [];
	for (i = 0 ; i < alternateValues.length ; i++){
		alternateData.push([timeArray[i],alternateValues[i]]);
	}
	
	//alert("complete data: "+JSON.stringify(alternateData));
	var alternateData2 = [];
	for (i = 0 ; i < values.length ; i++){
		alternateData2.push([timeArray[i],values[i]]);
	}
	
	var remData = [];
	for (i = 0 ; i < remArray.length ; i++){
		remData.push([timeArray[i],remArray[i]]);
	}
	
	var sigData = [];
	for (i = 0 ; i < badSigArray.length ; i++){
		sigData.push([timeArray[i],badSigArray[i]]);
	}
	
	//alert(alternateData[0]+" "+alternateData2[0]);
	
	//alert('here in updateSleepLab'+JSON.stringify(alternateData));
	
	// Need to map to maximum (500) points 
	
	// alert("tones before manipulation: "+toneValues);
	
	for (i = 0 ; i < toneValues.length ; i++){
	
		if ( i === 0){
			if (toneValues[i] == null){
				if (toneValues[i+1] == 100){
					toneValues[i] = 100;
				}else{
					toneValues[i] = 0;
				}
			}
		}else {
			if (toneValues[i] == null){
				if (toneValues[i-1] == 100){
					toneValues[i] = 100;
				}else{
					toneValues[i] = 0;
				}
			}
		}
		
	
	}
	
	
	var currentToneVal, changeIndeces = [];
	for (i = 0 ; i < toneValues.length; i++){
		if (i === 0){
			currentToneVal = toneValues[i];
			if (currentToneVal === 100){
				changeIndeces.push(i);
			}
		}else{
			if (toneValues[i] !== currentToneVal){
				changeIndeces.push(i);
				currentToneVal = toneValues[i];
			}
		}
	}
	//alert(changeIndeces);
	//alert(toneValues);
	
	var changeTimes = [];
	for (i = 0 ; i < changeIndeces.length ; i++){
		changeTimes.push(changeIndeces[i]*sampleRate*1000 + time);
	}
	
	var plotBands = [];
	var bandObj = {};
	for (i = 0 ; i < changeTimes.length ; i += 2){
		bandObj.color = 'rgba(255,255,255,0.2)';
		bandObj.from = changeTimes[i];
		bandObj.to = changeTimes[i+1];
		plotBands.push(bandObj);
		bandObj = {};
		//alert(JSON.stringify(plotBands));
	}
	//alert(time);
	//alert(JSON.stringify(plotBands));
	
	// plotBands = [{
		// color: 'rgba(150,150,150,0.5)',
		// from: changeTimes[0],
		// to: changeTimes[1]
	// },{
		// color: 'rgba(150,150,150,0.5)',
		// from: changeTimes[2],
		// to: changeTimes[3]
	// }];
	
	//alert(JSON.stringify(plotBands));
	
	//alert(plotBands);
	
	var blah2 = mapToMaxPoints(toneValues);
	var plotToneValues = blah2[0];
	
	// alert("tones after manipulation: "+toneValues);
	var lineHeight = $('#line').height();
	
	scorePlotOptions = {
		title: {
			text: ''
		},
		chart:{
			//marginLeft: '85',
			renderTo: "line",
			backgroundColor: null,
			plotBackgroundColor: {
                linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
                stops: [
                    // [0, Highcharts.getOptions().colors[2]],
                    // [.33, Highcharts.getOptions().colors[1]],
                    // [.66, Highcharts.getOptions().colors[1]],
                    // [1, Highcharts.getOptions().colors[0]]
					
					[0, '#FCEB9C'],
                    [0.33, '#FCEB9C'],
                    [0.34, '#92BED6'],
                    [0.65, '#92BED6'],
                    [0.66, '#70808E'],
                    [1, '#70808E'],
                ]
            },
			plotBorderWidth: 1,
			plotBorderColor: '#33495d',
			marginRight: 20,
			marginLeft: 20
		},
		credits: {
			   enabled: false
		},
		xAxis: {
			
			type: 'datetime',
			// min: new Date(time).getTime(),
			// minRange: 1*3600,
			// categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums'],
			// crosshair: true,
			dateTimeLabelFormats: {
				// day: '%e%12 of %b',
				day: labelTime,
				hour: labelTime,
				minute: labelTime,
				second: labelTime,
				
			},
			tickInterval: 1*3600*1000,
			//plotBands: plotBands,
			lineColor: '#33495d',
			lineWidth: 1,
			//startOnTick: true,
		},
		plotOptions:{
			series:{
				connectNulls: true
			},
			column:{
				animation: false
			},
			spline:{
				animation:{
					duration: 2500
				}
			}
		},
		yAxis:{
			title:{
				//text: 'Sleep Score',
				text: '',
			},
			min: 0,
			max: 100,
			gridLineColor: 'none',
			//tickAmount: 4,
			//tickInterval: 33,
			labels:{
				enabled: false,
			},
			plotLines:[{
                    color: 'transparent',
                    label:{
                        text: 'Light',
                        align: 'center',
                        x: 0,
                        y: -10,
                        style:{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 20,
                            textShadow: '0px 0px #000'
                        }
                    },
                    width: 1,
                    //color: 'rgba(0,0,0,0.2)',
                    value: 33
                    //to: 5,
                },{
                    color: 'transparent',
                    width: 1,
                    label:{
                        text: 'Deep',
                        align: 'center',
                        x: 0,
                        y: -10,
                        style:{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 20,
                            textShadow: '0px 0px #000'
                        }
                    },
                    //color: 'rgba(0,0,0,0.2)',
                    value: 0
                    //to: 5,
                },{
                    color: 'transparent',
                    width: 1,
                    label:{
                        text: 'Awake',
                        align: 'center',
                        x: 0,
                        y: -10,
                        style:{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 20,
                            textShadow: '0px 0px #000'
                        }
                    },
                    //color: 'rgba(0,0,0,0.2)',
                    value: 66
                }],
		},
		/* labels:{
			items:[{
				html: 'Awake',
				style: {
					top: lineHeight*.125,
					left: 20,
				}
			},{
				html: 'Light',
				style: {
					top: lineHeight*.345,
					left: 20,
				}
			},{
				html: 'Deep',
				style: {
					top: lineHeight*.585,
					left: 20,
				}
			},],
			style:{
				color: 'rgba(0,0,0,0.5)',
				textShadow: '1px 1px #FFF',
			}
		}, */
		legend:{
			enabled: false
		},
		 tooltip: {
			enabled: false,
			// shared: true
		},
		series: [{
			/* //type: 'area',
			type: 'column',
			name: 'Tones',
			data: plotToneValues,
			// pointWidth: null,
			pointPadding: 0,
			groupPadding: 0,
			borderWidth: 0,
			//color: Highcharts.getOptions().colors[4], //'rgba(0,0,100,0.5)',
			// lineWidth: 0,
			// marker:{
				// radius: 0
			// },
			//fillColor: 'rgba(100,100,100,0.3)',
			color: 'rgba(200,200,200,1)',
			pointStart: new Date(time).getTime(), 
			pointInterval: plotPointInterval*1000 
		}, { */
			type: 'spline',
			name: 'Sleep Score',
			
			//data: groupDataByValue(plotValues),
			data: plotValues,
			marker:{
				enabled: false,
				
			},
			//threshold: 33,
			color: Highcharts.getOptions().colors[0],
			//negativeColor: Highcharts.getOptions().colors[0],
			pointStart: new Date(time).getTime(), 
			pointInterval: plotPointInterval*1000 
		/* }, {
			type: 'spline',
			name: 'Sleep Score',
			//data: groupDataByValue(plotValues),
			data: plotValues,
			marker:{
				enabled: false,
				
			},
			threshold: 66,
			color: Highcharts.getOptions().colors[2],
			negativeColor: 'transparent',
			pointStart: new Date(time).getTime(), 
			pointInterval: plotPointInterval*1000  */
		}]
	};
	
	var chart   = new Highcharts.Chart(scorePlotOptions);
	var plotHeight = chart.plotHeight;
	
	scorePlotOptions = {
		title: {
			text: ''
		},
		chart:{
			//marginLeft: '85',
			renderTo: "line",
			backgroundColor: null,
			plotBackgroundColor: {
                linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
                stops: [
                    // [0, Highcharts.getOptions().colors[2]],
                    // [.33, Highcharts.getOptions().colors[1]],
                    // [.66, Highcharts.getOptions().colors[1]],
                    // [1, Highcharts.getOptions().colors[0]]
					
					[0, '#FCEB9C'],
                    [0.33, '#FCEB9C'],
                    [0.34, '#92BED6'],
                    [0.65, '#92BED6'],
                    [0.66, '#70808E'],
                    [1, '#70808E'],
                ]
            },
			plotBorderWidth: 1,
			plotBorderColor: '#33495d',
			marginRight: 20,
			marginLeft: 20
		},
		credits: {
			   enabled: false
		},
		xAxis: {
			
			type: 'datetime',
			// min: new Date(time).getTime(),
			// minRange: 1*3600,
			// categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums'],
			// crosshair: true,
			dateTimeLabelFormats: { 
				// day: '%e%12 of %b',
				day: labelTime,   
				hour: labelTime,
				minute: labelTime,
				second: labelTime,
				
			},
			tickInterval: 1*3600*1000,
			//plotBands: plotBands,
			lineColor: '#33495d',
			lineWidth: 1,
			//startOnTick: true,
		},
		plotOptions:{
			series:{
				connectNulls: false
			},
			column:{
				animation: false
			},
			spline:{
				animation:{
					duration: 2500
				}
			}
		},
		yAxis:{
			title:{
				//text: 'Sleep Score',
				text: '',
			},
			min: 0,
			max: 105,
			endOnTick: false,
			gridLineColor: 'none',
			//tickAmount: 4,
			//tickInterval: 33,
			labels:{
				enabled: false,
			},
			plotLines:[{
                    color: 'transparent',
                    label:{
                        text: labelLight,
                        align: 'center',
                        x: 0,
                        y: -Math.round(plotHeight/12),
                        style:{
                            color: 'rgba(255,255,255,0.3)',
                            fontSize: Math.round(plotHeight/4)+"px",
                            //textShadow: '0px 0px #000'
                        }
                    },
                    width: 1,
                    //color: 'rgba(0,0,0,0.2)',
                    value: 33
                    //to: 5,
                },{
                    color: 'transparent',
                    width: 1,
                    label:{
                        text: labelDeep,
                        align: 'center',
                        x: 0,
                        y: -Math.round(plotHeight/12),
                        style:{
                            color: 'rgba(255,255,255,0.3)',
                            fontSize: Math.round(plotHeight/4)+"px",
                            //textShadow: '0px 0px #000'
                        }
                    },
                    //color: 'rgba(0,0,0,0.2)',
                    value: 0
                    //to: 5,
                },{
                    color: 'transparent',
                    width: 1,
                    label:{
                        text: labelAwake,
                        align: 'center',
                        x: 0,
                        y: -Math.round(plotHeight/12),
                        style:{
                            color: 'rgba(255,255,255,0.3)',
                            fontSize: Math.round(plotHeight/4)+"px",
                            //textShadow: '0px 0px #000'
                        }
                    },
                    //color: 'rgba(0,0,0,0.2)',
                    value: 66
                }],
		},
		/* labels:{
			items:[{
				html: 'REM',
				style:{
					top: plotHeight - 20,
					left: 10,
					color: 'white',
					fontSize: 12
				}
			}]
		}, */
		/* labels:{
			items:[{
				html: 'Awake',
				style: {
					top: lineHeight*.125,
					left: 20,
				}
			},{
				html: 'Light',
				style: {
					top: lineHeight*.345,
					left: 20,
				}
			},{
				html: 'Deep',
				style: {
					top: lineHeight*.585,
					left: 20,
				}
			},],
			style:{
				color: 'rgba(0,0,0,0.5)',
				textShadow: '1px 1px #FFF',
			}
		}, */
		
		
		legend:{
			enabled: true,
			align: 'left',
            verticalAlign: 'top',
            layout: 'vertical',
            x: 5,
            y: plotHeight-40,
            floating: true,
			itemStyle:{
				textShadow: false,
				color: 'white'
			}
		},
		 tooltip: {
			enabled: false,
			// shared: true
		},
		series: [{
			/* //type: 'area',
			type: 'column',
			name: 'Tones',
			data: plotToneValues,
			// pointWidth: null,
			pointPadding: 0,
			groupPadding: 0,
			borderWidth: 0,
			//color: Highcharts.getOptions().colors[4], //'rgba(0,0,100,0.5)',
			// lineWidth: 0,
			// marker:{
				// radius: 0
			// },
			//fillColor: 'rgba(100,100,100,0.3)',
			color: 'rgba(200,200,200,1)',
			pointStart: new Date(time).getTime(), 
			pointInterval: plotPointInterval*1000 
		}, { */
			type: 'spline',
			name: 'Sleep Score',
			
			//data: groupDataByValue(plotValues),
			data: plotValues,
			marker:{
				enabled: false,
				radius: 0
				
			},
			enableMouseTracking: false,
			//threshold: 33,
			color: Highcharts.getOptions().colors[0],
			lineWidth: 0,
			//negativeColor: Highcharts.getOptions().colors[0],
			pointStart: new Date(time).getTime(), 
			pointInterval: plotPointInterval*1000 ,
			showInLegend: false
		/* }, {
			type: 'spline',
			name: 'Sleep Score',
			//data: groupDataByValue(plotValues),
			data: plotValues,
			marker:{
				enabled: false,
				
			},
			threshold: 66,
			color: Highcharts.getOptions().colors[2],
			negativeColor: 'transparent',
			pointStart: new Date(time).getTime(), 
			pointInterval: plotPointInterval*1000  */
			
			
		},/* {
			data: alternateData,
			enableMouseTracking: false,
			color: Highcharts.getOptions().colors[1],
			color: 'white',
			
			
			//color: '#656565'
		
		
		}, */{
			data: alternateData2,
			enableMouseTracking: false,
			//color: Highcharts.getOptions().colors[1],
			color: 'black',
			showInLegend: false
			
			
			
			//color: '#656565'
		
		
		},{
			data: remData,
			enableMouseTracking: false,
			color: Highcharts.getOptions().colors[1],
			//color: 'white',
			name: labelRem,
			marker:{
				enabled: false,
				radius: 0
			}
			
			
			
			//color: '#656565'
		
		
		},{
			data: sigData,
			enableMouseTracking: false,
			color: Highcharts.getOptions().colors[6],
			name: labelNoEEG,
			dashStyle: 'dash',
			marker:{
				enabled: false,
				radius: 0
			}
			
			
			
			//color: '#656565'
		
		
		}]
	};
	chart = new Highcharts.Chart(scorePlotOptions);
	
	var blahDate = new Date(time);
	//$('#labDate').html(blahDate.getMonth()+1+"/"+blahDate.getDate()+"/"+blahDate.getFullYear()); 
		
		//$.mobile.loading('hide');
}

function groupDataByValue(data) {
	var lightThreshold = 66;
	var deepThreshold = 33;
	//colors: [DEEP/Dark Blue, LIGHT/Light blue, AWAKE/Yellow, DARKBLUE , TAN, LIGHTBLUE, LIGHTGRAY]
			
	var lightColor = Highcharts.getOptions().colors[1];
	var deepColor = Highcharts.getOptions().colors[0];
	var awakeColor = Highcharts.getOptions().colors[2];
	var dummyData = [];
	for ( i = 0 ; i < data.length ; i++){
		var dummyArray = [];
		dummyArray.push(data[i]);
		dummyData.push(dummyArray);
	}
	var newData = [];
	$.each(dummyData, function() {
		var dataPoint = {
			//x: this[0],
			y: this[0],
			marker: {
				//enabled: true,
				radius: 3,
			}
		};
		var color;
		if (dataPoint.y < deepThreshold) {
			color = deepColor;
		}else if (dataPoint.y < lightThreshold) {
			color = lightColor;
		}else {
			color = awakeColor;
		}
		dataPoint.color = color;
		dataPoint.marker.fillColor = color;
		newData.push(dataPoint);
	});
	
	//alert(JSON.stringify(newData));
	return newData;
}


function updateOrientation(values, time, scores){ // values = angles !!
		/* var blah1 = mapToMaxPoints(values);
		var plotValues = blah1[0];
		var plotPointInterval = blah1[1]; // in seconds;
		
		//var categories = ['Down Left','Left','Up Left','Up','Up Right','Right','Down Right','Down','Sitting Up','Head Stand'];
		// var categories = ['Up Right','Right','Down Right','Down','Down Left','Left','Up Left','Up','Head Stand','Sitting Up'];
		var categories = ['', 'Up', 'Right', 'Down', 'Left', 'Standing Up'];
		orientationPlotOptions = {
			title: {
				text: ''
			},
			xAxis: {
				type: 'datetime',
				//minRange: 1*3600,
				//categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
				dateTimeLabelFormats: {
					day: '%I %p',
					hour: '%I %p',
					minute: '%I %p',
					second: '%I %p',

				},
				tickInterval: 1*3600*1000,
				//startOnTick: true,
			},
			plotOptions:{
				series:{
					connectNulls: true
				}
			},
			yAxis:{
				title: '',
				categories: categories,
				labels: {
					formatter: function () {
						return this.value;
					}
				},
				min: 1,
				max: 5,
				//tickInterval: 3,
				//startOnTick: true,
				//max: 100,
			},
			tooltip: {
				enabled: false,
				formatter: function(){
					var date = new Date(this.x);
					var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
					var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
					return days[date.getDay()]+", "+months[date.getMonth()]+" "+date.getDate()+", "+date.toLocaleTimeString()+"<br>"+categories[this.y];
				}
			},
			legend:{
				enabled: false
			},
			series: [{
				type: 'spline',
				name: 'Head Orientation',
				data: plotValues,
				marker:{
					enabled: false
				},
				color: Highcharts.getOptions().colors[3],
				pointStart:  new Date(time).getTime(), 
				pointInterval: plotPointInterval*1000 // 1 second
			}]
		}; */
		
		// Get values for polar head orientation plot
		//alert("dayData in updateOrientation BEFORE swapping nulls for 101's"+dayData[dayData.length-1].scoresAlt2);
		var scores2 =[];
		for (var i = 0 ; i < scores.length ; i++){
			// set all null values to something that won't be confused with with something else
			if (scores[i] === null){
				scores2.push(101);
			}else{
				scores2.push(scores[i]);
			}
		}
		
		//alert('scores2.length in updateOrientation: '+scores2.length);
		//alert("dayData in updateOrientation "+dayData[dayData.length-1].scoresAlt2);
		//alert("scores in updateOrientation "+scores);
		var deep = [0,0,0], light = [0,0,0], awake = [0,0,0], other = [0,0,0,0], badSig = [0,0,0];  // for deep, light and awake (and badSig): [left, up, right] ; for other: [deep, light, awake, badSig]
		//alert(scores+"---"+values);
		for (i = 0 ; i < values.length ; i++){
			switch (values[i]){
				case posStates.UP: // Up
					if (scores2[i] > 100){
						badSig[1]++;
					}else if (scores2[i] > 66){
						awake[1]++;
					}else if (scores2[i] > 33){
						light[1]++;
					}else{
						deep[1]++;
					}
				break;
				case posStates.RIGHT: // Right
					if (scores2[i] > 100){
						badSig[2]++;
					}else if (scores2[i] > 66){
						awake[2]++;
					}else if (scores2[i] > 33){
						light[2]++;
					}else{
						deep[2]++;
					}
				break;
				case posStates.LEFT: // Left
					if (scores2[i] > 100){
						badSig[0]++;
					}else if (scores2[i] > 66){
						awake[0]++;
					}else if (scores2[i] > 33){
						light[0]++;
					}else{
						deep[0]++;
					}
				break;
				default: // Anything else
					if (scores2[i] > 100){
						other[3]++;
					}else if (scores2[i] > 66){
						other[0]++;
					}else if (scores2[i] > 33){
						other[1]++;
					}else{
						other[2]++;
					}
			}
		}
		//alert(deep);
		var total = []; // total amount in each category so we can find the max, and set blankVal to it.
		for (i = 0 ; i < awake.length ; i++){
			awake[i] *= sampleRate;
			light[i] *= sampleRate;
			deep[i] *= sampleRate;
			badSig[i] *= sampleRate;
			total[i] = awake[i] + light[i] + deep[i] + badSig[i];
			other[i] *= sampleRate;
		}
		other[3] *= sampleRate;
		var blankVal = arrayMax(total)/2;
		var lineHeight = $('#line').height();
		var lineWidth = $('#line').width();
		var polarWidth = lineHeight*0.60*2;
		
		//alert(total+" "+other);
		// Change head size
		//alert('here');
		
		//headTopMargin = 0;
		//alert($('#head').height());
		$('#head').css('width', polarWidth*0.2).css('margin-left', -polarWidth*0.1);
		//alert($('#head').height());
		var headTopMargin = $('#sleeplab .content .center').height() + $('#line').height() - polarWidth*0.2*22/15*1.15;
		//alert(headTopMargin);
		
		$('#head').css('top', headTopMargin+"px" );
		
		//alert(arraySum(total)+" "+scores.length*sampleRate);
		//alert((scores.length*sampleRate/3600).toFixed(1) +" "+ (arraySum(total)/3600).toFixed(1));
		
		//alert(awake+" "+light+" "+deep+" "+blankVal);
		orientationPlotOptions = {

			chart: {
				polar: true,
				margin: [0,0,0,0],
				spacing: [0,0,0,0],
				backgroundColor: 'none',
                plotBackgroundColor: 'none',
				
			},

			title: {
				text: ''
			},
			credits: {
			   enabled: false
			},
			pane: {
				startAngle: 260, //225,
				endAngle: 460, //495
				//center: ['50%', '85%'],
				center: ['50%', '80%'],
				size: polarWidth
			},
			labels:{
				items:[{
					html: '<b>'+labelUp+'</b><br>'+ (total[1]/3600).toFixed(1) + " "+labelHours,
					style:{
						left: lineWidth/2 - 15,
						top: 0
					}
				},{
					html: '<b>'+labelLeft+'</b><br>'+ (total[0]/3600).toFixed(1) + " "+labelHours,
					style:{
						left: 15,
						top: polarWidth/4
					}
				},{
					html: '<b>'+labelRight+'</b><br>'+ (total[2]/3600).toFixed(1) + " "+labelHours,
					style:{
						left: lineWidth - 50,
						top: polarWidth/4
					}
				},{
					// html: '<b>'+labelOtherOrientations+'</b> '+ ((other[0]+other[1]+other[2])/3600).toFixed(1) + " "+labelHours,
					html: '<b>'+labelOtherOrientations+'</b> '+ ( parseFloat((scores.length*sampleRate/3600).toFixed(1)) - parseFloat((total[0]/3600).toFixed(1)) - parseFloat((total[1]/3600).toFixed(1)) - parseFloat((total[2]/3600).toFixed(1)) ).toFixed(1) + " "+labelHours,
					style:{
						left: 15,
						top: polarWidth*0.75
					}
				}]
			},
			xAxis: {
				tickInterval: 1,
				gridLineColor: 'white',
				gridLineWidth: 0,
				lineColor: 'none',
				lineWidth: 0,
				min: 0,
				max: 3,
				labels: {
					enabled: false,
					distance: -0
				},
				categories: ['Left', 'Up','Right']
			},

			yAxis: {
				min: 0,
				max: arrayMax(total) + blankVal,
				//ceiling: 26,
				gridLineColor: 'none',
				lineColor: 'black',
				labels: {
					enabled: false
					   
				},
				endOnTick: false
			},
			tooltip:{
				enabled: false,
			},
			plotOptions: {
				series: {
					pointStart: 0,
					pointInterval: 1
				},
				column: {
					pointPadding: 0,
					groupPadding: 0.005,
					borderColor: '#f9f9f9',
					borderWidth: 0,
					stacking: 'normal',
				}
			},
			legend:{
				enabled: false  
			},
			series: [{
			   
				type: 'column',
				name: 'awake',
				color: '#FBE372',
				stack: 1,
				//data: [3, 2, 1] // awake
				data: awake, // awake
			},{
				type: 'column',
				name: 'light',
				stack: 1,
				color: '#63a2c5',
				//data: [2, 3, 3] // light
				data: light,
				//pointPlacement: 'between'
			}, {           
				 type: 'column',
				name: 'deep',
				//data: [8, 7, 6], // deep
				data:  deep,
				color: '#33495d',
				stack: 1,
			}, {           
				 type: 'column',
				name: 'badSig',
				//data: [8, 7, 6], // deep
				data:  badSig,
				color: '#A0A0A0',
				stack: 1,
			},{
				 type: 'column',
				name: 'blank', 
				color: 'none',
				stack: 1,
				//data: [13, 13, 13]
				data: [blankVal, blankVal, blankVal]
			}]
		};
		// $('#line2').highcharts();
		// $('#line').highcharts(orientationPlotOptions);
		
}

function updateStats(leftVal, rightVals, avgStates){
	// leftVal is avg Score, rightVal is avg rating (not implemented yet)
	//alert("rating in updateStats: "+rightVals);	
	var trendsWidth = $('#trends-day').width(); 
	var trendsHeight = $('#trends-day').height();
	$('#trends-day').highcharts({
		chart: {
			backgroundColor: null,
			plotBackgroundColor: null,
			plotBorderWidth: 0,
			plotShadow: false,
			spacing: [0,0,0,0],
			//margin: [(trendsHeight - trendsWidth/2.5*0.9)/2,0,(trendsHeight - trendsWidth/2.5*0.9)/2,0],
			margin: [0,trendsWidth*0.1/2,0,trendsWidth*0.1/2],
		},
		credits: {
			   enabled: false
		},
		title: {
			text: '',
			align: 'center',
			verticalAlign: 'middle',
			y: 50
		},
		tooltip: {
			enabled: false,
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				dataLabels: {
					enabled: false,
					distance: -50,
					style: {
						fontWeight: 'bold',
						color: 'white',
						textShadow: '0px 1px 2px black'
					}
				},
				// startAngle: -135,
				// endAngle: 135,
				//center: ['50%', '70%']
				enableMouseTracking: false,
				allowPointSelect: false
			},
			bar:{
				stacking: 'percent',
				pointWidth: trendsHeight/10,
				borderWidth: 0
			}
			
		},
		legend:{
			enabled: false
		},
		yAxis:{
			lineWidth: 0,
			gridLineWidth: 0,
			labels:{
				enabled: false
			}
		},
		xAxis:{
			lineWidth: 0,
			gridLineWidth: 0,
			tickWidth: 0,
			labels:{
				enabled: false
			}
		},
		series: [{
			type: 'pie',
			name: '',
			innerSize: '80%',
			data: [{
				name:'Avg. Score',   	
				y: Math.round(leftVal), 
				color: {
					radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
					stops: [
						[0.8, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')],
						//[.7, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(0.05).get('rgb')],
						[0.9, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(0.05).get('rgb')],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')]  
					]
					// Highcharts.getOptions().colors[1]
					}
				},{
				name:'Improvement Potential',   	
				y:100 - leftVal, 
				color: Highcharts.getOptions().colors[6] 
				}],
			//center: ['40%','50%'],
			center: ['20%','38%'],
			// size: '70%',
			// size: trendsWidth/2.5*0.9,
			size: trendsWidth/2.5*0.9
		},{
			type: 'pie',
			name: '',
			innerSize: '80%',
			data: [{
				name:'Avg. Score',   	
				y:rightVals, 
				color: {
					radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
					stops: [
						[0.8, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')],
						//[.7, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(0.05).get('rgb')],
						[0.9, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(0.05).get('rgb')],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')]  
					]
					// Highcharts.getOptions().colors[1]
					}
				},{
				name:'Improvement Potential',   	
				y:5 - rightVals, 
				color: Highcharts.getOptions().colors[6] 
				}],
			//center: ['85%','50%'], // side by side squished right
			center: ['80%','38%'], // side by side full width
			// size: '70%',
			// size: trendsWidth/2.5*0.9,
			size: trendsWidth/2.5*0.9
		},{
			type: 'bar',
			name: 'allTime1',
			data: [0,0,0,avgStates[2]], //,0,0,0,0
			//color: Highcharts.getOptions().colors[2]
			color: {
						linearGradient: { x1: 0, y1: 0.5, x2:1, y2:  0.5},
						stops: [
							[0, Highcharts.Color(Highcharts.getOptions().colors[2]).get('rgb')],
							[0.5, Highcharts.Color(Highcharts.getOptions().colors[2]).brighten(0.05).get('rgb')],
							[1, Highcharts.Color(Highcharts.getOptions().colors[2]).get('rgb')]
						]
						// Highcharts.getOptions().colors[2]
						}
		},{
			type: 'bar',
			name: 'allTime2',
			data: [0,0,0,avgStates[1]], //,0,0,0,0
			// color: Highcharts.getOptions().colors[1]
			color: {
						linearGradient: { x1: 0, y1: 0.5, x2:1, y2:  0.5},
						stops: [
							[0, Highcharts.Color(Highcharts.getOptions().colors[1]).get('rgb')],
							[0.5, Highcharts.Color(Highcharts.getOptions().colors[1]).brighten(0.05).get('rgb')],
							[1, Highcharts.Color(Highcharts.getOptions().colors[1]).get('rgb')]
						]
						// Highcharts.getOptions().colors[2]
						}
		},{
			type: 'bar',
			name: 'allTime3',
			data: [0,0,0,avgStates[0]], //,0,0,0,0
			// color: Highcharts.getOptions().colors[0]
			color: {
						linearGradient: { x1: 0, y1: 0.5, x2:1, y2:  0.5},
						stops: [
							[0, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')],
							[0.5, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(0.05).get('rgb')],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).get('rgb')]
						]
						// Highcharts.getOptions().colors[2]
						}
		},{
			type: 'bar',
			name: 'allTime0',
			data: [0,0,0,avgStates[3]], //,0,0,0,0
			//color: Highcharts.getOptions().colors[6]
			color: {
						linearGradient: { x1: 0, y1: 0.5, x2:1, y2:  0.5},
						stops: [
							[0, Highcharts.Color(Highcharts.getOptions().colors[6]).get('rgb')],
							[0.5, Highcharts.Color(Highcharts.getOptions().colors[6]).brighten(0.05).get('rgb')],
							[1, Highcharts.Color(Highcharts.getOptions().colors[6]).get('rgb')]
						]
						// Highcharts.getOptions().colors[2]
						}
		}]
	});			
			
	$('#stat1data').html(leftVal);
	$('#stat2data').html(rightVals);
	
}		

function updateLocalStorage(){
	//alert("newest scoresAlt2 BEFORE updating localStorage: "+dayData[dayData.length - 1].scoresAlt2);
	// Set local storage variables to global variables
	//alert("Updated Local Storage");
	// localStorage.lastSleepSummary = JSON.stringify(lastSleepSummary);
	// alert("In update, sleepState: "+JSON.stringify(sleepState));
	// localStorage.sleepState = JSON.stringify(sleepState);
	// localStorage.tones = JSON.stringify(tones);
	// localStorage.trends = JSON.stringify(trends);
	
	
	// New local storage
	//localStorage.clear();
	localStorage.dayData = JSON.stringify(dayData);
	localStorage.weekData = JSON.stringify(weekData);
	localStorage.monthData = JSON.stringify(monthData);
	localStorage.currentWeekAvgs = JSON.stringify(currentWeekAvgs);
	localStorage.currentMonthAvgs = JSON.stringify(currentMonthAvgs);
	localStorage.allTimeAvgs = JSON.stringify(allTimeAvgs);
	
	var dummyDayData15 = JSON.parse(localStorage.dayData);
	
	//alert("newest scoresAlt2 AFTER updating localStorage: "+dummyDayData15[dummyDayData15.length - 1].scoresAlt2);
}

function readLocalStorage(){
	// Set global variables to local storage variables

	// new reading local storage
	dayData = JSON.parse(localStorage.dayData);
	weekData = JSON.parse(localStorage.weekData);
	monthData = JSON.parse(localStorage.monthData);
	currentWeekAvgs = JSON.parse(localStorage.currentWeekAvgs);
	currentMonthAvgs = JSON.parse(localStorage.currentMonthAvgs);
	allTimeAvgs = JSON.parse(localStorage.allTimeAvgs);
	
	if (localStorage.dataStored === "true"){
		dataStored = localStorage.dataStored;
	}else{
		dataStored = "false";
		localStorage.dataStored = "false";
	}
	//alert(localStorage.dataStored +" "+dataStored);
	toggleNSbtn(dataStored);
	
	//alert("after read: "+JSON.stringify(dayData));
}

function arraySum(arr){
	var sum = 0;
	for(var i = 0, l = arr.length; i < l; i++){
		sum += arr[i];
	}
	return sum;
}

function arrayMean(arr){
	var sum = 0;
	for(var i = 0, l = arr.length; i < l; i++){
		sum += arr[i];
	}
	
	return sum/l;
}
	
function stateCount(array){
	var deep = 0, light = 0, awake = 0, badSignal = 0;
	for (var i = 0, l=array.length; i < l ; i++){
		var value = array[i];
		var value2;
		if (value === null){
			value2 = 101;
		}else{
			value2 = value;
		}
		
		
		
		if (value2 < 33){
			deep++;
		}else if (value2 < 67){
			light++;
		}else if (value2 < 101){
			awake++;
		}else{
			badSignal++;
		}
	}
	
	//alert("in stateCount "+dayData[dayData.length-1].scoresAlt2);
	//alert(deep+" "+light+" "+awake+" "+badSignal);
	return [secondsPerReading*deep, secondsPerReading*light, secondsPerReading*awake, secondsPerReading*badSignal];
}		


function arrayMin(arr){
	var len = arr.length, min = Infinity;
	while(len--){
		if (arr[len] < min){
			min = arr[len];
		}
	}
	return min;
}

function arrayMax(arr){
	var len = arr.length, max = 0;
	while(len--){
		if (arr[len] > max){
			max = arr[len];
		}
	}
	return max;
}

function secsToTime(seconds){
	//alert('here'+seconds);
	var hrs, mins;
	hrs = parseFloat((seconds/3600).toFixed(1));
	if (hrs < 1){
		mins = parseFloat((seconds/60).toFixed(0));

		if (mins === 1){
			return mins+" "+labelMin;
		}else{
			return mins+" "+labelMins;
		}
	}else{
		return hrs+" "+labelHours;
	}
}

function secsToClock(seconds){
	//alert('seconds '+seconds);
	var date = new Date(seconds*1000);
	var hour = date.getHours();
	//alert("hour: "+hour);
	var amPm = "AM";
	if (hour === 0){
		hour = 12;
	}else if (hour > 12){
		hour = hour % 12;
		amPm = "PM";
	}else if (hour == 12){
		amPm = "PM";
	}
	var minute = date.getMinutes();
	if (minute < 10){
		minute = "0"+minute;
	}
	
	var replacementObj = {
		"%H%":date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
		"%M%":minute,
		"%h%":hour,
		"%P%":amPm
	};
	
	var str = labelTimeAlt;
	
	str = str.replace(/%\w+%/g, function(all) {
		//return replacementObj[all] || all;
		return replacementObj[all];
	});	
		
	//return hour+":"+minute+" "+amPm;  // Old version (English specific)
	
	return str;
	

}

function secsToClockUTC(msSinceMidnight){
	//alert('ms since midnight '+msSinceMidnight);
	var date = new Date(msSinceMidnight);
	var hour = date.getUTCHours();
	//alert("hour: "+hour);
	var amPm = "AM";
	if (hour === 0){
		hour = 12;
	}else if (hour > 12){
		hour = hour % 12;
		amPm = "PM";
	}else if (hour == 12){
		amPm = "PM";
	}
	var minute = date.getUTCMinutes();
	if (minute < 10){
		minute = "0"+minute;
	}
	
	var replacementObj = {
		"%H%":date.getUTCHours(),
		"%M%":minute,
		"%h%":hour,
		"%P%":amPm
	};
	
	var str = labelTimeAlt;
	
	str = str.replace(/%\w+%/g, function(all) {
		return replacementObj[all] || all;
	});
		
	//return hour+":"+minute+" "+amPm;  // Old version (English specific)
	
	return str;
	

}

function getPercentages(arr){
	var sum = 0;
	for (var i = 0, l = arr.length; i < l ; i++){
		sum += arr[i];
	}
	return [parseFloat((100*arr[0]/sum).toFixed(2)),parseFloat((100*arr[1]/sum).toFixed(2)),parseFloat((100*arr[2]/sum).toFixed(2)),parseFloat((100*arr[3]/sum).toFixed(2))]; 
}


function updateAvgs(newDay){ // remove all of the parameters, just have function modify the globals?
		//alert("scoresAlt2 in updateAvgs: "+newDay.scoresAlt2);
	//alert("in update, newDay: "+JSON.stringify(newDay.tonesOnOff));
	//alert("rating in updateAvgs: "+newDay.rating);
	// add last sleep to 7 day array
	// alert('start of updateAvgs');
	var newDayDate, newEndDate;
	if (!localStorage.dayData){
		//alert('no data stored locally');
		dayData = [];
		weekData = [];
		monthData = [];
		allTimeAvgs.totalScore = 0; allTimeAvgs.rating = 0; allTimeAvgs.msFromMidnight = 0;
	}
	
	// alert('after checking for localStorage');
	
	dayData.push(newDay);
	if (dayData.length > 7){
		dayData.shift();
	}
	
	//alert("newest day's scoreAlt2 after being pushed to dayData: " + dayData[dayData.length - 1].scoresAlt2);
	console.log("dayData length: "+dayData.length);
	//alert("here: "+JSON.stringify(dayData));
	// update all time avgs with new day data
	//alert("all time avg states: "+JSON.stringify(allTimeAvgs));
	if (newDay.totalScore !== null){
		if (allTimeAvgs.totalScore === 0){
			allTimeAvgs.totalScore = newDay.totalScore;
		}else{
			allTimeAvgs.totalScore = parseFloat(((allTimeAvgs.totalScore*allTimeAvgs.daysOfData + newDay.totalScore)/(allTimeAvgs.daysOfData+1)).toFixed(1));
		}
			
	}
	
	if (!allTimeAvgs.timesAwoken){
		allTimeAvgs.timesAwoken = newDay.timesAwoken;
	}else{
		allTimeAvgs.timesAwoken = parseFloat(((allTimeAvgs.timesAwoken*allTimeAvgs.daysOfData + newDay.timesAwoken)/(allTimeAvgs.daysOfData + 1)).toFixed(1));

	}
	allTimeAvgs.states = [parseFloat(((allTimeAvgs.states[0]*allTimeAvgs.daysOfData + newDay.states[0])/(allTimeAvgs.daysOfData+1)).toFixed(0)),parseFloat(((allTimeAvgs.states[1]*allTimeAvgs.daysOfData + newDay.states[1])/(allTimeAvgs.daysOfData+1)).toFixed(0)),parseFloat(((allTimeAvgs.states[2]*allTimeAvgs.daysOfData + newDay.states[2])/(allTimeAvgs.daysOfData+1)).toFixed(0)),parseFloat(((allTimeAvgs.states[3]*allTimeAvgs.daysOfData + newDay.states[3])/(allTimeAvgs.daysOfData+1)).toFixed(0))];
	allTimeAvgs.percents = [parseFloat(((allTimeAvgs.percents[0]*allTimeAvgs.daysOfData + newDay.percents[0])/(allTimeAvgs.daysOfData+1)).toFixed(1)),parseFloat(((allTimeAvgs.percents[1]*allTimeAvgs.daysOfData + newDay.percents[1])/(allTimeAvgs.daysOfData+1)).toFixed(1)),parseFloat(((allTimeAvgs.percents[2]*allTimeAvgs.daysOfData + newDay.percents[2])/(allTimeAvgs.daysOfData+1)).toFixed(1)),parseFloat(((allTimeAvgs.percents[3]*allTimeAvgs.daysOfData + newDay.percents[3])/(allTimeAvgs.daysOfData+1)).toFixed(1))];
	allTimeAvgs.toneTime = parseFloat(((allTimeAvgs.toneTime*allTimeAvgs.daysOfData + newDay.toneTime)/(allTimeAvgs.daysOfData+1)).toFixed(0));
	allTimeAvgs.rating  = parseFloat(((allTimeAvgs.rating*allTimeAvgs.daysOfData + newDay.rating)/(allTimeAvgs.daysOfData + 1)).toFixed(1));
	allTimeAvgs.msFromMidnight  = parseFloat(((allTimeAvgs.msFromMidnight*allTimeAvgs.daysOfData + newDay.msFromMidnight)/(allTimeAvgs.daysOfData + 1)).toFixed(1));
	allTimeAvgs.daysOfData++;
	
	//alert('new allTimeAvgs.percents: '+allTimeAvgs.percents)
	
	//alert("new all time rating: "+allTimeAvgs.rating);
	// alert("all time avg: " +JSON.stringify(allTimeAvgs) ); // Looks like allTimeAvgs updates correctly
	
	// alert("Time in update fcn: "+newDay.time); // this looks good now that pack and packUnsigned are fixed
	// alert('after updating allTimeAvgs');
	// update current week avg and seven week avg obj.s
	console.log("end of this month: "+ currentMonthAvgs.endDate);
	console.log("end of this week: "+currentWeekAvgs.endDate);
	console.log("newDay.time: "+newDay.time);
	if (newDay.time < currentWeekAvgs.endDate){
		//alert("in current week");
		console.log("in current week");
		// add new day's data to current week avgs
		if (newDay.totalScore !== null){
			currentWeekAvgs.totalScore = parseFloat(((currentWeekAvgs.totalScore*currentWeekAvgs.daysOfData + newDay.totalScore)/(currentWeekAvgs.daysOfData+1)).toFixed(1));
		}
		if (!currentWeekAvgs.timesAwoken){
			currentWeekAvgs.timesAwoken = newDay.timesAwoken;
		}else{
			currentWeekAvgs.timesAwoken = parseFloat(((currentWeekAvgs.timesAwoken*currentWeekAvgs.daysOfData + newDay.timesAwoken)/(currentWeekAvgs.daysOfData + 1)).toFixed(1));

		}
		
		currentWeekAvgs.states = [parseFloat(((currentWeekAvgs.states[0]*currentWeekAvgs.daysOfData + newDay.states[0])/(currentWeekAvgs.daysOfData+1)).toFixed(0)),parseFloat(((currentWeekAvgs.states[1]*currentWeekAvgs.daysOfData + newDay.states[1])/(currentWeekAvgs.daysOfData+1)).toFixed(0)),parseFloat(((currentWeekAvgs.states[2]*currentWeekAvgs.daysOfData + newDay.states[2])/(currentWeekAvgs.daysOfData+1)).toFixed(0)),parseFloat(((currentWeekAvgs.states[3]*currentWeekAvgs.daysOfData + newDay.states[3])/(currentWeekAvgs.daysOfData+1)).toFixed(0))];
		currentWeekAvgs.percents = [parseFloat(((currentWeekAvgs.percents[0]*currentWeekAvgs.daysOfData + newDay.percents[0])/(currentWeekAvgs.daysOfData+1)).toFixed(1)),parseFloat(((currentWeekAvgs.percents[1]*currentWeekAvgs.daysOfData + newDay.percents[1])/(currentWeekAvgs.daysOfData+1)).toFixed(1)),parseFloat(((currentWeekAvgs.percents[2]*currentWeekAvgs.daysOfData + newDay.percents[2])/(currentWeekAvgs.daysOfData+1)).toFixed(1)),parseFloat(((currentWeekAvgs.percents[3]*currentWeekAvgs.daysOfData + newDay.percents[3])/(currentWeekAvgs.daysOfData+1)).toFixed(1))];
		currentWeekAvgs.toneTime = parseFloat(((currentWeekAvgs.toneTime*currentWeekAvgs.daysOfData + newDay.toneTime)/(currentWeekAvgs.daysOfData+1)).toFixed(0));
		currentWeekAvgs.rating  = parseFloat(((currentWeekAvgs.rating*currentWeekAvgs.daysOfData + newDay.rating)/(currentWeekAvgs.daysOfData + 1)).toFixed(1));
		currentWeekAvgs.msFromMidnight  = parseFloat(((currentWeekAvgs.msFromMidnight*currentWeekAvgs.daysOfData + newDay.msFromMidnight)/(currentWeekAvgs.daysOfData + 1)).toFixed(1));
		currentWeekAvgs.daysOfData++;
		
		
		
		// update current week in weekData (i.e. modify last entry)
		weekData[weekData.length-1] = currentWeekAvgs;
		
	}else{
		//alert("start new week");
		// start a new week
		console.log("start a new week");
		currentWeekAvgs = {};
		if (newDay.totalScore !== null){
			currentWeekAvgs.totalScore = newDay.totalScore;
		}
		
		currentWeekAvgs.states = newDay.states;
		currentWeekAvgs.percents = newDay.percents;
		currentWeekAvgs.toneTime = newDay.toneTime;
		currentWeekAvgs.rating = newDay.rating;
		currentWeekAvgs.msFromMidnight = newDay.msFromMidnight;
		currentWeekAvgs.daysOfData = 1;
		currentWeekAvgs.timesAwoken = newDay.timesAwoken;
		
		// set endDate to last day of the new week
		
		newDayDate = new Date(newDay.time);
		
		//alert("new day time not date: "+newDay.time);
		newEndDate = new Date(newDayDate.getTime() + (7-newDayDate.getDay())*24*3600*1000);
		newEndDate.setHours(11,59,59,999);
		currentWeekAvgs.endDate = newEndDate.getTime();
		var newStartDate = new Date(newEndDate.getTime() - 6*24*3600*1000);
		newStartDate.setHours(0,0,0,0);
		console.log("New Week Start Date: "+newStartDate);
		console.log("New Week End Date: "+newEndDate);
		
		// add label to new week
		currentWeekAvgs.label = (newStartDate.getMonth()+1)+"/"+newStartDate.getDate()+"-"+(newEndDate.getMonth()+1)+"/"+newEndDate.getDate();
		console.log(currentWeekAvgs.label);
		
		// append to weekData (i.e. start a new week in week data)
		weekData.push(currentWeekAvgs);
		if (weekData.length > 7){
			weekData.shift();
		}
	}
	
	// alert('after updating weekly avgs');
	//console.log("currentWeek after data: "+JSON.stringify(currentWeekAvgs));
	
	if (newDay.time < currentMonthAvgs.endDate){
		// add new day's data to current month avgs
		console.log("in current month");
		
		if (newDay.totalScore !== null){
			currentMonthAvgs.totalScore = parseFloat(((currentMonthAvgs.totalScore*currentMonthAvgs.daysOfData + newDay.totalScore)/(currentMonthAvgs.daysOfData+1)).toFixed(1));
		}
		if (!currentMonthAvgs.timesAwoken){
			currentMonthAvgs.timesAwoken = newDay.timesAwoken;
		}else{
			currentMonthAvgs.timesAwoken = parseFloat(((currentMonthAvgs.timesAwoken*currentMonthAvgs.daysOfData + newDay.timesAwoken)/(currentMonthAvgs.daysOfData + 1)).toFixed(1));

		}
		currentMonthAvgs.states = [parseFloat(((currentMonthAvgs.states[0]*currentMonthAvgs.daysOfData + newDay.states[0])/(currentMonthAvgs.daysOfData+1)).toFixed(0)),parseFloat(((currentMonthAvgs.states[1]*currentMonthAvgs.daysOfData + newDay.states[1])/(currentMonthAvgs.daysOfData+1)).toFixed(0)),parseFloat(((currentMonthAvgs.states[2]*currentMonthAvgs.daysOfData + newDay.states[2])/(currentMonthAvgs.daysOfData+1)).toFixed(0)),parseFloat(((currentMonthAvgs.states[3]*currentMonthAvgs.daysOfData + newDay.states[3])/(currentMonthAvgs.daysOfData+1)).toFixed(0))];
		currentMonthAvgs.percents = [parseFloat(((currentMonthAvgs.percents[0]*currentMonthAvgs.daysOfData + newDay.percents[0])/(currentMonthAvgs.daysOfData+1)).toFixed(1)),parseFloat(((currentMonthAvgs.percents[1]*currentMonthAvgs.daysOfData + newDay.percents[1])/(currentMonthAvgs.daysOfData+1)).toFixed(1)),parseFloat(((currentMonthAvgs.percents[2]*currentMonthAvgs.daysOfData + newDay.percents[2])/(currentMonthAvgs.daysOfData+1)).toFixed(1)),parseFloat(((currentMonthAvgs.percents[3]*currentMonthAvgs.daysOfData + newDay.percents[3])/(currentMonthAvgs.daysOfData+1)).toFixed(1))];
		currentMonthAvgs.toneTime = parseFloat(((currentMonthAvgs.toneTime*currentMonthAvgs.daysOfData + newDay.toneTime)/(currentMonthAvgs.daysOfData+1)).toFixed(0));
		currentMonthAvgs.rating  = parseFloat(((currentMonthAvgs.rating*currentMonthAvgs.daysOfData + newDay.rating)/(currentMonthAvgs.daysOfData + 1)).toFixed(1));
		currentMonthAvgs.msFromMidnight  = parseFloat(((currentMonthAvgs.msFromMidnight*currentMonthAvgs.daysOfData + newDay.msFromMidnight)/(currentMonthAvgs.daysOfData + 1)).toFixed(1));
		currentMonthAvgs.daysOfData++;
		
		// update current month in monthData (i.e. modify last entry)
		monthData[monthData.length-1] = currentMonthAvgs;
		console.log("in same month" + JSON.stringify(monthData));
	}else{
		// start a new month
		console.log("start new month");
		currentMonthAvgs = {};
		if (newDay.totalScore !== null){
			currentMonthAvgs.totalScore = newDay.totalScore;
		}
		currentMonthAvgs.states = newDay.states;
		currentMonthAvgs.percents = newDay.percents;
		currentMonthAvgs.toneTime = newDay.toneTime;
		currentMonthAvgs.rating = newDay.rating;
		currentMonthAvgs.msFromMidnight = newDay.msFromMidnight;
		currentMonthAvgs.daysOfData = 1;
		currentMonthAvgs.daysOfData = newDay.timesAwoken;
		
		
		// set endDate to last day of new month
		newDayDate = new Date(newDay.time);
		newEndDate = new Date(newDayDate.getFullYear(), newDayDate.getMonth()+1, 0);
		newEndDate.setHours(23,59,59,999);
		console.log("New End of Month Date: "+newEndDate);
		currentMonthAvgs.endDate = newEndDate.getTime();
		
		var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		console.log("in new month, before changing current month label: "+JSON.stringify(monthData));
		currentMonthAvgs.label = monthNames[newDayDate.getMonth()];
		console.log("in new month, before push: "+JSON.stringify(monthData));
		
		// append to monthData (i.e. start a new month in monthData)
		//alert("new month added: "+ currentMonthAvgs.label);
		monthData.push(currentMonthAvgs);
		if (monthData.length > 7){
			monthData.shift();
		}
		console.log("in new month, after push: "+JSON.stringify(monthData));
	}
	
	// alert('after updating monthly avgs');
	
	
	console.log("day data length: "+dayData.length);
	console.log("week data length: "+weekData.length);
	console.log("month data length: "+monthData.length);
	
	//console.log("currentMonth after data: "+JSON.stringify(currentMonthAvgs));
	
	//alert(JSON.stringify(dayData)); // come back to this
	$('#head').addClass('noDisplay');
	$('#orientationBtn').removeClass('current');
	$('#scoreBtn').addClass('current');
	//alert('before updateSleepLab');
	//alert("newDay.scoresAlt2 after updateAvgs: "+newDay.scoresAlt2);
	//alert("newest day in dayData after updateAvgs before updateSleepLab: "+dayData[dayData.length - 1].scoresAlt2);
	updateSleepLab(newDay.scoresAlt2,newDay.tones, newDay.time, newDay.scoresAlt, newDay.timeArr, newDay.rem , newDay.badSig);
	//alert("newest day in dayData after updateAvgs after updateSleepLab: "+dayData[dayData.length - 1].scoresAlt2);
	updateLastSleepPie(newDay.percents);
	//alert("newest day in dayData after updateAvgs after updateLastSleepPie: "+dayData[dayData.length - 1].scoresAlt2);
	updateOrientation(newDay.angles, newDay.time, newDay.scoresAlt2);
	//alert("newest day in dayData after updateAvgs after updateOrientation: "+dayData[dayData.length - 1].scoresAlt2);

	// Check if the day trends or stats is current page on Trends page
	
	//updateStats(allTimeAvgs.totalScore,allTimeAvgs.rating);
	//updateTrends(getTrendsData(dayData), getTrendsData(weekData), getTrendsData(monthData));
	//alert(currentTrend);
	
	// alert('before switch');
	var otherButtons, trendTitle;
	switch (currentTrend){
		
		case "daily":
			otherButtons = $('#weekly, #monthly, #alltime');
			otherButtons.removeClass("current");
			var dailyBtn = $('#daily');
			dailyBtn.addClass("current");
			trendTitle = $('.trendTitle');
			trendTitle.html(labelAvgL7sleeps);
			$('.statlabel').addClass('noDisplay');
			updateTrends2(getTrendsData(dayData));
			updateTrendsTable(getPast7Avgs(dayData));
			break;
		case "weekly":
			otherButtons = $('#daily, #monthly, #alltime');
			otherButtons.removeClass("current");
			var weeklyBtn = $('#weekly');
			weeklyBtn.addClass("current");
			trendTitle = $('.trendTitleTable');
			trendTitle.html(labelAvgL7weeks);
			$('.statlabel').addClass('noDisplay');
			updateTrends2(getTrendsData(weekData));
			updateTrendsTable(getPast7Avgs(weekData));
			break;
		case "monthly":
			//alert('here - monthly');
			otherButtons = $('#weekly, #daily, #alltime');
			otherButtons.removeClass("current");
			// alert('here 2 - monthly');
			var monthlyBtn = $('#monthly');
			monthlyBtn.addClass("current");
			trendTitle = $('.trendTitleTable');
			trendTitle.html(labelAvgL7months);
			$('.statlabel').addClass('noDisplay');
			updateTrends2(getTrendsData(monthData));
			updateTrendsTable(getPast7Avgs(monthData));
			
			
			break;
		case "allTime":
			otherButtons = $('#daily, #weekly, #monthly');
			otherButtons.removeClass("current");
			var allTimeBtn = $('#alltime');
			allTimeBtn.addClass("current");
			trendTitle = $('.trendTitleTable');
			trendTitle.html(labelAvgAllTime);
			$('.statlabel').removeClass('noDisplay');
			updateStats(allTimeAvgs.totalScore, allTimeAvgs.rating, allTimeAvgs.states);
			updateStatsTable(allTimeAvgs);
		break;
	}
	//alert("after switch");
	// updateTrends2(getTrendsData(dayData));
	// updateTrendsTable(getPast7Avgs(dayData));
	//updateTrendsTable(getPast7Avgs(dayData));
	updateLastSleepTable(newDay);
	updateSleepLabTable(newDay);
	updateStatsTable(allTimeAvgs);
	updateLocalStorage();
	
	
	var differenceFromAvg = (newDay.totalScore - allTimeAvgs.totalScore).toFixed(1);
	//alert(differenceFromAvg);
	
	if (differenceFromAvg < 0){
		$('#difference').addClass('negative').html(differenceFromAvg);
	}else{
		$('#difference').removeClass('negative').html("+"+differenceFromAvg);
	}
	
	$('.rating ul li').removeClass('active');
	for (i = 1 ; i <= newDay.rating ; i++){
		$('#ls-cloud-'+i).addClass('active');
	}
	
	var date = new Date(newDay.time);
	var replacementObj = {
		"%d%": date.getDate(),
		"%m%": (date.getMonth()+1),
		"%y%": date.getFullYear()
	};
	
	var str = labelYear;
	str = str.replace(/%\w+%/g, function(all) {
		return replacementObj[all] || all;
	});
	var newLabel = str;
	//alert(newLabel);
	$('#lsDate').html(newDay.label);
	$('#lsDate, #labDate').html(newLabel);
	
	// set dataStored to false since new data was just uploaded from hat (then erased)
	dataStored = "false";
	localStorage.dataStored = dataStored;
	toggleNSbtn(dataStored);
	
	setTimeout(function(){
		//$.mobile.loading('hide');
		//alert('popup 15');
		$('.ui-popup').popup('close');
		//alert(monthData[monthData.length - 1].msFromMidnight+" "+monthData[monthData.length-1].daysOfData);
		//$.mobile.loading('hide');
		//$.mobile.loading('show',{text:'Disconnecting...',textVisible: true, theme:'b'});
		afterForcedDisconnect = true;
		//bluetoothle.disconnect(disconnectSuccess, disconnectFail,{"address":address}); // Swap this for opening #endPopup
		//alert('after sync');
		myScroll.goToPage(1,0);
		setTimeout(function(){
			$('#endPopup').popup('open');
		},100);
	}, 1000);

	//alert('end of updateAvgs()');
}

function getTrendsData(array){
	// input array is either dayData, weekData, or monthData so we have to iterate over objects, grabbing the deep, light and awake states
	var deep = [], light = [], awake = [], labels = [], badSig =[], newLabel, endDate;
	for (var i = 0, arrayLength = array.length; i < arrayLength ; i ++){
		var obj = array[i];
		
		//-- Make labels change format based on language --//
		var labelOld = obj.label;
		if (labelOld.indexOf("/") > -1 ){ // The label is either for daily or weekly trends
			if (labelOld.indexOf('-') > -1){ // weekly trends
				endDate = obj.endDate;
				var startDate = new Date(endDate - 6*24*3600*1000);
				var d1 = startDate.getDate();
				var m1 = startDate.getMonth() + 1;
				var endDateDummy = new Date(endDate);
				var d2 = endDateDummy.getDate();
				var m2 = endDateDummy.getMonth() + 1;
				//alert('weekly'+d1+" "+m1+" "+d2+" "+m2);
				var replacementObj = {
					"%d1%": d1,
					"%m1%": m1,
					"%d2%": d2,
					"%m2%": m2
				};
				
				var str = labelWeekly;
	
				str = str.replace(/%\w+%/g, function(all) {
					return replacementObj[all] || all;
				});
				
				// alert(JSON.stringify(replacementObj));
				newLabel = str;
			}else{ // daily trends
				var date = obj.time;
				var dummy = new Date(date);
				var m = dummy.getMonth() + 1;
				var d = dummy.getDate();
				
				var replacementObj2 = {
					"%d%": d,
					"%m%": m
				};
				var str2 = labelDaily;
	
				str2 = str2.replace(/%\w+%/g, function(all) {
					return replacementObj2[all] || all;
				});
				
				newLabel = str2;
			}	
		}else{ // monthly trends
			endDate = obj.endDate;
			var month = new Date(endDate).getMonth()+1;
			newLabel = labelMonth[month-1];
		}
		//-- End of format additions --//
		
		deep.push(obj.states[0]); light.push(obj.states[1]); awake.push(obj.states[2]); labels.push(newLabel); badSig.push(obj.states[3]);
	}
	
	// alert(JSON.stringify([deep, light, awake]));
	return [deep, light, awake, labels, badSig]; // add in labels here?
}



function getPast7Avgs(array){
	// need avg toneTime, states, percents, score
	var toneArr = [], stateArr = [[],[],[], []], percentArr = [[],[],[],[]], scoreArr = [], bedtimeArr = [], timesAwokenArr = [];
	for (var i = 0, arrLen = array.length ; i < arrLen ; i++ ){
		var obj = array[i];
		toneArr.push(obj.toneTime);
		scoreArr.push(obj.totalScore);
		bedtimeArr.push(obj.msFromMidnight);
		timesAwokenArr.push(obj.timeAwoken);
		for (var j = 0 ; j < 4 ; j++){
			var stateDummy = obj.states;
			var percentDummy = obj.percents;
			stateArr[j].push(stateDummy[j]);
			percentArr[j].push(percentDummy[j]);
		}
	}
	// [avg tone time, avg score, [avg deep, avg light, avg awake] , [avg deep percent, avg light percent, avg awake percent] , avg ms from midnight]
	return [arrayMean(toneArr), arrayMean(scoreArr), [arrayMean(stateArr[0]), arrayMean(stateArr[1]), arrayMean(stateArr[2]), arrayMean(stateArr[3])], [arrayMean(percentArr[0]), arrayMean(percentArr[1]), arrayMean(percentArr[2]), arrayMean(percentArr[3])] , arrayMean(bedtimeArr), arrayMean(timesAwokenArr)];
}


function changeState(newState){
	var hexArray = ["AA","AA","03","24","10",newState.toString(),""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
}


function updateTrendsTable(array){ // takes in result of getPast7Avgs()
	//alert('In updateTrendsTabel '+JSON.stringify(array));
	var states = array[2];
	
	//alert(states);
	// $('#trendAvgScore').html(parseFloat(array[1].toFixed(1)));
	// $('#trendAvgTones').html(secsToTime(array[0]));
	// $('#trendDeep').html(secsToTime(states[0]));
	// $('#trendQuality').html(secsToTime(states[0]+states[1]));
	
	var ms = array[4];
	var timesAwoken;
	if (isNaN(array[5])){
		timesAwoken = 0;
	}else{
		timesAwoken = array[5];
	}
	
	//alert(JSON.stringify(ms));
	//$('#trendsAwakeTime').html(secsToTime(states[2]));
	$('#trendsAwakeTime').html(timesAwoken+" X");
	$('#trendsLightTime').html(secsToTime(states[1]));
	$('#trendsDeepTime').html(secsToTime(states[0]));
	//$('#trendsDeepLevel').html(arrayMin(day.scores));
	$('#trendsStartTime').html(secsToClockUTC(ms));
	$('#trendsTotalTime').html(secsToTime(arraySum(states)));
	$('#trendsEndTime').html(secsToClockUTC(ms + (arraySum(states))*1000));
	
}

function updateLastSleepTable(day){
	var states = day.states;
	// $('#lsQualitySleep').html(secsToTime(states[0] + states[1]));
	// $('#lsToneTime').html(secsToTime(day.toneTime));
	var pieVal;
	if (day.totalScore === null){
		pieVal = '?';
		$('#lsTrend').html(pieVal).addClass('eeg');
		$('#lsLabel').html(labelPoorEEG).addClass('eeg');
	}else{
		pieVal = day.totalScore;
		$('#lsTrend').html(pieVal).removeClass('eeg');
		$('#lsLabel').html(labelQualitySleepScore).removeClass('eeg');
	}
	
	
	$('#lsQualitySleep').html(secsToTime(states[0] + states[1]));
	//alert(day.time);
	var totalTime = arraySum(states);
	$('#lsWaketime').html(secsToClock(totalTime + day.time/1000));
	$('#lsBedtime').html(secsToClock(day.time/1000));
	$('#lsRating').html(day.rating);
	
	var bedtimedifference = msFromMidnight(day.time) - allTimeAvgs.msFromMidnight; // in ms
	//alert('here');
	var bedtimeVal = secsToTime(Math.abs(bedtimedifference)/1000);
	//alert(bedtimeVal);
	if (Math.abs(bedtimedifference) > 30*60*1000){
		$('#bedtimeDiff').css('color','red');
		if (bedtimedifference > 0){
			// later than average
			// $('#bedtimeDiff').html('Later than usual');
			$('#bedtimeDiff').html(labelLater);
		}else{
			// earlier than average
			// $('#bedtimeDiff').html('Earlier than usual');
			$('#bedtimeDiff').html(labelEarlier);
		}
	}else{
		$('#bedtimeDiff').css('color','green');
		// $('#bedtimeDiff').html('Within norm');
		$('#bedtimeDiff').html(labelWithinNorm);
		// within norm
	}
	
	/* if (bedtimedifference >= 0){
		$('#bedtimeDiff').html('&uarr; '+bedtimeVal);
	}else if(bedtimedifference < 0){
		$('#bedtimeDiff').html('&darr; '+bedtimeVal);
	} */
	
	var waketimedifference = msFromMidnight(day.time + totalTime*1000) - allTimeAvgs.msFromMidnight - arraySum(allTimeAvgs.states)*1000;
	var waketimeVal = secsToTime(Math.abs(waketimedifference)/1000);
	if (Math.abs(waketimedifference) > 30*60*1000){
		$('#waketimeDiff').css('color','red');
		if (waketimedifference > 0){
			// later than average
			// $('#waketimeDiff').html('Later than usual');
			$('#waketimeDiff').html(labelLater);
		}else{
			// earlier than average
			// $('#waketimeDiff').html('Earlier than usual');
			$('#waketimeDiff').html(labelEarlier);
		}
	}else{
		$('#waketimeDiff').css('color','green');
		// $('#waketimeDiff').html('Within norm');
		$('#waketimeDiff').html(labelWithinNorm);
	}
	
	/* if (waketimedifference >= 0){
		$('#waketimeDiff').html('&uarr; '+waketimeVal);
	}else if(waketimedifference < 0){
		$('#waketimeDiff').html('&darr; '+waketimeVal);
	} */
	
	
	var ratingdifference = (day.rating - allTimeAvgs.rating).toFixed(1);
	
	if (ratingdifference >= 0){
		$('#ratingDiff').css('color','green').html("&uarr; "+ratingdifference);
	}else{
		$('#ratingDiff').css('color','red').html("&darr;"+ Math.abs(ratingdifference));
	}
	
	var allTimeStates = allTimeAvgs.states;
	var qualitydifference = states[0]+states[1] - allTimeStates[0] - allTimeStates[1];
	
	if (qualitydifference >= 0){
		$('#qualityDiff').css('color','green').html("&uarr; "+secsToTime(Math.abs(qualitydifference)));
	}else{
		$('#qualityDiff').css('color','red').html("&darr;"+secsToTime(Math.abs(qualitydifference)));
	}
	
	//alert(bedtimedifference+" "+waketimedifference+" "+ratingdifference+" "+qualitydifference);
}

function updateSleepLabTable(day){ // takes in last day's data
	var states = day.states;
	var timesAwoken = day.timesAwoken || 0;
	//$('#labToneTime').html(secsToTime(day.toneTime));
	//$('#labAwakeTime').html(secsToTime(states[2]));
	$('#labAwakeTime').html(timesAwoken+" X");
	$('#labLightTime').html(secsToTime(states[1]));
	$('#labDeepTime').html(secsToTime(states[0]));
	//$('#labDeepLevel').html(arrayMin(day.scores));
	$('#labStartTime').html(secsToClock(day.time/1000));
	$('#labTotalTime').html(secsToTime(arraySum(states)));
	$('#labEndTime').html(secsToClock(day.time/1000 + arraySum(states)));
}

function updateStatsTable(averages){  // takes in allTimeAvgs
	var states = averages.states;
	
	//alert(averages.states);
	
	// $('#statScore').html(averages.totalScore);
	// $('#statQuality').html(secsToTime(states[0] + states[1]));
	// $('#statToneTime').html(secsToTime(averages.toneTime));
	// $('#statRating').html(secsToTime(states[0]));
	// alert('do i get here to update trends table?');
	
	// $('#trendAvgScore').html(Math.round(averages.totalScore));
	// $('#trendQuality').html(secsToTime(states[0] + states[1]));
	// $('#trendAvgTone').html(secsToTime(averages.toneTime));
	// $('#trendDeep').html(secsToTime(states[0]));
	
	var ms = averages.msFromMidnight;
	var timesAwoken = averages.timesAwoken || 0;
	//alert(JSON.stringify(ms));
	//$('#trendsAwakeTime').html(secsToTime(states[2]));
	$('#trendsAwakeTime').html(timesAwoken+ " X");
	$('#trendsLightTime').html(secsToTime(states[1]));
	$('#trendsDeepTime').html(secsToTime(states[0]));
	//$('#trendsDeepLevel').html(arrayMin(day.scores));
	$('#trendsStartTime').html(secsToClockUTC(ms));
	$('#trendsTotalTime').html(secsToTime(arraySum(states)));
	$('#trendsEndTime').html(secsToClockUTC(ms + (arraySum(states))*1000));
	
}

function checkConnection(){
	if (!connected){
		//alert('in check connection()');
		//$.mobile.loading('hide');
		//alert('popup 10');
		$('.ui-popup').popup('close');
		
		//$("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
		//$('#settingsMessage').html(labelConnectMessage);
		//$('#connectCircle').css('background','radial-gradient(#333,black)');
		
		endBtnPressed = false;
		startBtnPressed = false;
		settingsConnect = false;
		forgettingDevice = false;
		disconnecting = false;
		notEnoughData = false;
		alarmBtnClicked = false;
		alarmOnOffClicked = false;
		volumeBtnClicked = false;
		retrieveDataClicked = false;
		startRecordingClicked = false;
		$("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
		$('#settingsMessage').html(labelConnectMessage);
		$('#connectCircle').css('background','radial-gradient(#333,black)');
		bluetoothle.disconnect(disconnectSuccess,disconnectFail,{"address":address});
		setTimeout(function(){
			$('#timeoutPopup').popup('open');
		},100);
	}
}


function toggleNSbtn(data){
	// alert("dataStored: "+data+" "+typeof(data));
	if (data === "true"){
		// alert("data = true");
		$('#sleepIcon').removeClass('fa-plus').addClass('fa-arrow-up');
		$('#sleepName').html(labelEndSleep);
		$('#sleepBtn').addClass('alternative');
	}else{
		// alert("data = false");
		$('#sleepIcon').removeClass('fa-arrow-up').addClass('fa-plus');
		$('#sleepName').html(labelStartSleep);
		$('#sleepBtn').removeClass('alternative');
	}
}

function sendStartCommand(){
	//alert("start button pressed");
	//$.mobile.loading('show',{text: labelStarting, textVisible: true, theme:'b'});
	//alert('popup 11');
	
	//-- Swap this with an .html() call --//
	/* $('.ui-popup').popup('close');
	setTimeout(function(){
		$('#startingPopup').popup('open');
	},100); */
	if (!startRecordingClicked){  // if startRecordingClicked == true, we're already connected! (Make sure to test with no data recorded!)
		$('.ui-popup').popup('close');
		$('#connectingPopup #description').html(labelStarting);
		setTimeout(function(){
			$('#connectingPopup').popup('open');
		},100);
	
	}
	
	currentWrite = "Start Recording";
	
	accelX = [];
	accelY = [];
	accelZ = [];
	tones = [];
	sigStrength = [];
	motionPerSample = [];
	var d = new Date();
	var time = d.getTime();
	//time = 0;
	// alert("time at setting: "+time);
	// alert("time in bytes: "+JSON.stringify(intToBytes(time,6)));
	var hexArray = ["AA","AA","0C","82","10"];
	hexArray = hexArray.concat(intToBytes(time,6), intToBytes(sampleRate*1000,4), [""]);
	// alert("Header sent: "+JSON.stringify(hexArray));
	var writeArray = hexToUint8(hexArray);
	//alert(JSON.stringify(writeArray)):
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("sending start command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
}

function sendEndCommand(){
	//$.mobile.loading('show',{text: labelRetrieving, textVisible: true, theme:'b'});
	//alert('popup 12');
	
	// $('.ui-popup').popup('close');
	// setTimeout(function(){
		// $('#retrievingPopup').popup('open');
	// },100);
	$('.ui-popup').popup('close');
	$('#connectingPopup #description').html(labelRetrieving);
	setTimeout(function(){
		$('#connectingPopup').popup('open');
	},100);
	
	currentWrite = "End Recording";
	var d = new Date();
	syncStartTime = d.getTime();
	var time = d.getTime();
	var hexArray = ["AA","AA","08","83","10"];
	hexArray = hexArray.concat(intToBytes(time,6), [""]);
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("writing end command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
}

function disableSwipe(){
	$(document).off('swipeleft');
	$(document).off('swiperight');
}

function enableSwipe(){
	$(document).on('swipeleft', '.ui-page.swipe', function(event){    
		if(event.handled !== true) // This will prevent event triggering more then once
		{    
			var nextpage = $.mobile.activePage.next('[data-role="page"].swipe');
			// swipe using id of next page if exists
			if (nextpage.length > 0) {
				$.mobile.changePage(nextpage, {transition: "slide", reverse: false}, true, true);
			}else{
				$.mobile.changePage("#lastsleep", {transition: "slide", reverse: false}, true, true);
			}
			event.handled = true;
		}
		return false;         
	});

	$(document).on('swiperight', '.ui-page.swipe', function(event){     
		if(event.handled !== true) // This will prevent event triggering more then once
		{      
			var prevpage = $(this).prev('[data-role="page"].swipe');
			if (prevpage.length > 0) {
				$.mobile.changePage(prevpage, {transition: "slide", reverse: true}, true, true);
			}else{
				$.mobile.changePage("#settings", {transition: "slide", reverse: true}, true, true);
			}
			event.handled = true;
		}
		return false;            
	});
}

function sortArrays(addresses, rssis){
	var list = [];
	for (var j=0; j<addresses.length; j++) {
		list.push({'addresses': addresses[j], 'rssis': rssis[j]});
	}
	//console.log(list);
	list.sort(function(a, b) {
		return ((a.rssis > b.rssis) ? -1 : ((a.rssis == b.rssis) ? 0 : 1));
		//Sort could be modified to, for example, sort on the age 
		// if the name is the same.
	});
	//console.log(list);
	for (var k=0; k<list.length; k++) {
		addresses[k] = list[k].addresses;
		rssis[k] = list[k].rssis;
	}
	//alert("Addresses: "+JSON.stringify(addresses) + "RSSI: "+JSON.stringify(rssis));
	return [addresses, rssis];
}

function scanOver(){
	//alert("here");
	// alert("Before - Addresses: "+JSON.stringify(foundDevices) + "RSSI: "+JSON.stringify(foundRssi));
	var blah = sortArrays(foundDevices, foundRssi);
	foundDevices = blah[0];
	foundRssi = blah[1];
	// alert("After - Addresses: "+JSON.stringify(foundDevices) + "RSSI: "+JSON.stringify(foundRssi));
	bluetoothle.stopScan(stopSuccess,stopFail);
}

function mapToMaxPoints(array){
    var maxLength = 500;
	var rawInterval = secondsPerReading;
    var skipInterval;
    var arrLen = array.length;
    var newArray = [];
    var newInterval;
    if (arrLen > maxLength){
        skipInterval = Math.ceil(arrLen / maxLength);
        // alert(skipInterval);
        newInterval = skipInterval * rawInterval;
        for (i = 0 ; i < arrLen ; i = i + skipInterval){
             newArray.push(array[i]);   
        }
        // alert(newInterval);
    }else{
		newArray = array;
		newInterval = rawInterval;
	}
    return [newArray, newInterval];
}


function checkForNewData(){
	// if (continueSync == false){
		// alert("Error in data sync: We're stuck!");
	// }else{
		// continueSync = false;
	// }
	//alert('Error in data sync');
	//$.mobile.loading('hide');
	//alert('popup 13');
	$('.ui-popup').popup('close');
	endBtnPressed = false;
	$('#connectingPopup #description').html(labelConnecting);
	setTimeout(function(){
		$('#syncFailPopup').popup('open');
	},100);
}



function onResume() {
    // Handle the resume event
	//alert('resumed');
	var now = new Date().getTime();
	if ( now - localStorage.lastUsed > 10*60*1000){
		navigator.splashscreen.show();
		//myScroll.goToPage(0,0);
		setTimeout(function(){navigator.splashscreen.hide();},1000);
	}
}

function onPause(){
	localStorage.lastUsed = new Date().getTime();
	// setTimeout(function(){
		// bluetoothle.connect(connectSuccess,connectFail,{"address":address});
	// },3000);
	
}

function processRawData6(data) { // Makes peaks occur where most motion occured 

  var range = 50;
  var T2 = [0];

  for (i = 1; i < data[0].length; i++) {
    T2[i] = T2[i - 1] + 15 / 3600;
  }

  // Remove NaN rows
  var Ax2 = data[0];
  var Ay2 = data[1];
  var Az2 = data[2];
  var tones2 = data[3];
  var date2 = data[4];
  var sig2 = data[5];
  var motionPS2 = data[6];
  var rate2 = data[7];
  var Ax = [];
  var Ay = [];
  var Az = [];
  var tones3 = [];
  var date = [];
  var sig = [];
  var motionPS = [];
  var rate = [];
  var T = [];
  for (i = 0; i < Ax2.length; i++) {
    if (Ax2[i] == null) {
      Ax.push(Ax[i-1]);
      Ay.push(Ay[i-1]);
      Az.push(Az[i-1]);
      tones3.push(tones2[i-1]);
      sig.push(sig[i-1]);
      motionPS.push(0);
      T.push([T2[i]]);
    } else {
      Ax.push(Ax2[i]);
      Ay.push(Ay2[i]);
      Az.push(Az2[i]);
      tones3.push(tones2[i]);
      sig.push(sig2[i]);
      motionPS.push(motionPS2[i]);
      T.push(T2[i]);
    }
  }
  if (!rate2) {
    rate2 = 3;
  }

  var badSS = [];
  for (i = 0; i < sig.length; i++){
    if (sig[i] > 100) {
      badSS[i] = 1;
    }
    else {
      badSS[i] = 0;
    }
  }
  
 //console.log("badSS : " + badSS.length);
 //console.log("data length : " + sig.length);
 
 var hatOffLine = badSS;

  var hatOffDiff = [];
  for (i = 0; i < hatOffLine.length - 1; i++) {
    hatOffDiff[i] = hatOffLine[i + 1] - hatOffLine[i];
  }
  //console.log("hatOffDiff Length: " + hatOffDiff.length);
  var hatOffStart = [];

  hatOffStart = findEquals(hatOffDiff, 1);
  for (i = 0; i < hatOffStart.length; i++) {
    hatOffStart[i] = hatOffStart[i] + 1;
  }
  if(badSS[0] == 1){
    hatOffStart.unshift(0);
  }
  
  //console.log("Hat Off Start : " + hatOffStart);


  var hatOffEnd = [];
  hatOffEnd = findEquals(hatOffDiff, -1);
  
  for (i = 0; i < hatOffEnd.length; i++) {
    hatOffEnd[i] = hatOffEnd[i]+1;
  }
  
  if(badSS[badSS.length-1] == 1){
    hatOffEnd.push(badSS.length-1);
  }
  

  var hatOffLengths = [];
  for (i = 0; i < hatOffStart.length; i++){
    hatOffLengths[i] = hatOffEnd[i] - hatOffStart[i];
  }
  
  var hatOffDiff2 = [];
  for (i = 0; i < hatOffStart.length; i++){
    hatOffDiff2[i] = hatOffEnd[i] -hatOffStart[i];
  }
  //console.log("Hat Off Start : " + hatOffStart);
  //console.log("Hat Off End : " + hatOffEnd);
  //console.log("Hat Off Diff : " + hatOffDiff2);
for (i = 0; i < hatOffStart.length; i++){
    if (hatOffDiff2[i] < 40){
      hatOffStart[i] = null;
      hatOffEnd [i] = null;
    }
  }
  //console.log("Hat off diff : " + hatOffDiff2);
  //console.log("Hat Off End Length : " + hatOffEnd);
  //console.log("Hat Off Start Length : " + hatOffStart);
    var hatOffStartFinal = [];
    var hatOffEndFinal = [];
    
  for (i = 0 ; i < hatOffStart.length; i++){
    if (hatOffStart[i] != null){
      hatOffStartFinal.push(hatOffStart[i]);
    }
  }
   for (i = 0 ; i < hatOffEnd.length; i++){
    if (hatOffEnd[i] != null){
      hatOffEndFinal.push(hatOffEnd[i]);
    }
  }    
    
    //console.log("Signal Strength : " + sig);
  
   //console.log("hatOffStartFinal : " + hatOffStartFinal);
   //console.log("hatOffEndFinal : " + hatOffEndFinal);
 
  var orientation = orientationCalc2(Ax, Ay, Az, Ax.length);
  //console.log("Orientation : " + orientation);
  var indices = [];
  var array = orientation;
  var element = 5;
  var idx = array.indexOf(element);
  while (idx != -1) {
    indices.push(idx);
    idx = array.indexOf(element, idx + 1);
  }

  var standingUpIndex = indices;
  //console.log("standingUpIndex : " + standingUpIndex.length);
  var peakIndex = [];
  var uprightOccurances = 0;
  if (standingUpIndex.length > 0) {
    var upIndexDiff = [];
    for (i = 0; i < standingUpIndex.length - 1; i++) {
      upIndexDiff[i] = standingUpIndex[i + 1] - standingUpIndex[i];
    }
    upIndexDiff.unshift(1);


    var uprightSum = 0;

    for (i = 0; i < standingUpIndex.length; i++) {
      uprightSum += standingUpIndex[i];
    }

    var uprightChange = findGreaterThan(upIndexDiff, 20);
    uprightOccurances = uprightChange.length + 1;
    //console.log("typeof standingUpIndex :" + typeof standingUpIndex);
    var uprightStarts = [standingUpIndex[0]];


    for (i = 1; i < uprightOccurances; i++) {
      uprightStarts.push(standingUpIndex[uprightChange[i - 1]]);
    }

    //console.log("uprightChange : " + uprightChange);
    //console.log("standingUpIndex : " + standingUpIndex);
    peakIndex = uprightStarts;
    //console.log("Peak Test");
    
  }
  //console.log("Upright Occurances : " + uprightOccurances);
  

  //console.log("Peak Index 1 : " + peakIndex.length);
  while (peakIndex[0] < 10){
    peakIndex.shift();
  }
  peakIndex.unshift(0);
 //console.log("T Length : " + T.length);
  //console.log("Peak Index 2 : " + peakIndex);
  while (Math.abs(peakIndex[peakIndex.length-1] - T.length) < 10  ){
    peakIndex.pop();
  }
  peakIndex.push(T.length-1);
  //console.log("peakIndex : " + peakIndex);
  //console.log("Peak Index 3 : " + peakIndex);

  //console.log("peakIndex : " + peakIndex);
  var peakMag = [];
  for (i = 0; i < peakIndex.length; i++) {
    peakMag[i] = 100;
  }
//console.log("peakIndex : " + peakIndex);
//console.log("peak Mag : " + peakMag);

  var timesAwoken = peakMag.length - 2;
  //console.log("Times Awoken : " + timesAwoken);
  var maxT = getMaxOfArray(T2);
  var minPeakDistance = 240;
  //console.log(" MotionPs : " + motionPS);
  alert('before calling findPeaks in processRawData6');
  var peakFinder = findPeaks(motionPS, minPeakDistance);
  var maxIndex = peakFinder[0];
  var maxMag = peakFinder[1];

	alert("maxIndex : " +maxIndex+", maxMag : " + maxMag);

  //console.log("maxIndex : " +maxIndex);
  //console.log("maxMag : " + maxMag);
  var maxMin = getMinOfArray(maxMag);
  var maxMax = getMaxOfArray(maxMag);
  if (maxMag.length > 1) {
    for (i = 0; i < maxMag.length; i++) {
      maxMag[i] = map(maxMag[i], maxMin, maxMax, 60, 70);
    }
  } else {
    maxMag[0] = 65;
  }
  //console.log("minMag : " +maxMin);
  // console.log("maxMag : " + maxMag);
  var peakIndexFinal = peakIndex;
  var peakMagFinal = peakMag;
  for (i = 0; i < maxIndex.length; i++) {
    //console.log("peakIndexFinal in loop : " +peakIndexFinal);
    //console.log("max Index in loop: " +maxIndex[i]);
    var count2 = findWithinRange(peakIndexFinal, maxIndex[i], 240);
    //console.log("count2 : " + count2);
    if (count2 === 0) {
      peakIndexFinal.push(maxIndex[i]);
      peakMagFinal.push(maxMag[i]);
    }
  }
  //console.log("peakMagFinal :" + peakMagFinal);
  //console.log("peakIndexFinal :" + peakIndexFinal);

  var sortedPeaks = sortArrays(peakMagFinal, peakIndexFinal);
  peakMagFinal = sortedPeaks[0];
  peakIndexFinal = sortedPeaks[1];

  peakMagFinal = peakMagFinal.reverse();
  peakIndexFinal = peakIndexFinal.reverse();
 // console.log("Peak Index Final : " + peakIndexFinal);
  var maxima = peakMagFinal;
  maxIndex = peakIndexFinal;
  //console.log("Maxima : " + maxima);
  //console.log("Max Index : " + maxIndex);
  var peakDiff = diff2(peakIndexFinal);

  var minimaDrop = [];
  for (i = 0; i < peakDiff.length; i++) {
    if (peakDiff[i] < 120) {
      minimaDrop[i] = Math.random() * 5 + 15;
    } else if (peakDiff[i] > 120 && peakDiff[i] < 240) {
      minimaDrop[i] = Math.random() * 5 + 20;
    } else if (peakDiff[i] > 240 && peakDiff[i] < 400) {
      minimaDrop[i] = Math.random() * 5 + 35;
    } else {
      minimaDrop[i] = Math.random() * 5 + 40;
    }


  }
  //console.log("Maxima:" + maxima);

  var minima = [];
  var peakArrayMin = [];
  for (i = 0; i < peakDiff.length; i++) {
    var peakArrayComp = peakMagFinal.slice(i, i + 2);
    peakArrayMin[i] = getMinOfArray(peakArrayComp);
    if (peakArrayMin[i] != 100) {
      minima[i] = peakArrayMin[i] - minimaDrop[i];
    } else {
      minima[i] = peakArrayMin[i] - 2 * minimaDrop[i];
    }
  }
  //console.log("Minima:" + minima);
  var minIndex = [];
  //console.log("Peak Index Final : " + peakIndexFinal);
  //console.log("peakDiff : " + peakDiff);
  for (i = 0; i < minima.length; i++) {
    minIndex[i] = Math.round(peakIndexFinal[i] + peakDiff[i] * (Math.random() * 0.2 + 0.6));
  }
  //console.log("Min Index 1 : " +minIndex);
  for (i = 0; i < minima.length; i++) {
    if (maxima[i] ==100){
    minIndex[i] = Math.round(peakIndexFinal[i] + peakDiff[i] * (Math.random() * 0.2 + 0.6));
    }
  }
  for (i = 0; i < minima.length; i++) {
    if (maxima[i+1] ==100){
    minIndex[i] = Math.round(peakIndexFinal[i] + peakDiff[i] * (Math.random() * 0.1 + 0.85));
    }
  }
  
  var peaks = maxima.length - 1;
  var valleys = minima.length;
 
  
  //console.log("Min Index :" + minIndex);
  //console.log("Max Index :" + maxIndex);
  //console.log("Minima : " + minima);
  //console.log("Maxima : " + maxima);
  //console.log("max T : " + T.length);
  
  //console.log("Maxima Values : " + maxima);
  //console.log("Max Index :" + maxIndex);
  
  var baselineShape = [];
  for (i = 0; i < T.length; i++) {
    baselineShape[i] = 0;
  }
  //console.log("Baseline Shape Length : " +baselineShape.length);
  //console.log("T2 Length" + T.length);
  var pi = 3.14159265359;
  for (var i = 0; i < valleys; i++) {
    var t = [0];
//console.log("maxIndex : " + maxIndex);

    for (var j = maxIndex[i]; j < minIndex[i]; j++) {
      t[j] = map(j, maxIndex[i], minIndex[i], 0, pi);
      var amp = (maxima[i] - minima[i]) / 2;
      //console.log("amp : " + amp);
      baselineShape[j] = amp * Math.cos(t[j]) + minima[i] + amp;
    }

  }


  for (var i = 0; i < valleys; i++) {
    var t2 = [0];
    for (var j = minIndex[i]; j < maxIndex[i + 1]+1; j++) {
      t2[j] = map(j, minIndex[i], maxIndex[i + 1], pi, 2 * pi);
      var amp2 = (maxima[i + 1] - minima[i]) / 2;
      baselineShape[j] = amp2 * Math.cos(t2[j]) + minima[i] + amp2;
    }
  }
  //console.log("Baseline Shape Length : " +baselineShape.length);
  //baselineShape.shift();
  
  //console.log("Time : " + T.length);
  var sleepScore = baselineShape;
  //console.log("sleepScore2 : " + sleepScore2.length);
  /*var tFinal =[]; 
  var sleepScore =[];
  for (var i = 0; i < sleepScore2.length; i++){
    var timeDiff = parseFloat((T[i+1]-T[i]).toFixed(6));
    //console.log('timeDiff at i='+i+': '+timeDiff+', indicesSkipped: '+ Math.round(timeDiff/(15/3600) - 1));
    var indicesSkipped = Math.round(timeDiff/(15/3600) - 1);
    if (indicesSkipped == 0){
      //console.log("consecutive points at i="+i);
      sleepScore.push(sleepScore2[i]);
      tFinal.push(T[i]);
    } else {
     // console.log("skip at i="+i);
      sleepScore.push(sleepScore2[i]);
      tFinal.push(T[i]);
      for (var j = 1; j < indicesSkipped +1 ; j++){
        var sleepScoreBump =(sleepScore2[i+1]-sleepScore2[i])/(indicesSkipped+1); 
        var timeBump = (T[i+1]-T[i])/(indicesSkipped+1);
        sleepScore.push(sleepScore[sleepScore.length-1]+sleepScoreBump);
        tFinal.push(tFinal[tFinal.length-1]+timeBump);
      }
    }
    
  }*/

//console.log("Sleep Score Length : "+sleepScore.length);
//console.log("Sleep Score : "+sleepScore);
//console.log("Final T Length : " +tFinal.length);

/*console.log("Original Sleep Score: " + sleepScore2.length);
console.log("Original Time : " + T.length);

*/




var hatOffLineFinal = [];
  for (i = 0; i < sleepScore.length; i++) {
    hatOffLineFinal[i] = null;
  }

//console.log("Hat Off Start Final : " + hatOffStartFinal);
//console.log("Hat Off End Final : " + hatOffEndFinal);

	var slope = [];
  for (i = 0; i < hatOffStartFinal.length; i++) {
    //console.log("Sleep Score Length : " + sleepScore.length);
    //console.log("hatOffEndFinal[i]" + hatOffEndFinal[i]);
    //console.log("Sleep Score [hatoffendfinal[i]] : " +sleepScore[hatOffEndFinal[i]]);
    //console.log("Sleep Score [hatoffstartfinal[i]] : " +sleepScore[hatOffStartFinal[i]]);
    slope = (sleepScore[hatOffEndFinal[i]] - sleepScore[hatOffStartFinal[i]]) / (hatOffEndFinal[i] - hatOffStartFinal[i]);
    //console.log("Slope : " + slope);
    hatOffLineFinal[hatOffStartFinal[i]] = sleepScore[hatOffStartFinal[i]];
    for (j = hatOffStartFinal[i]; j < hatOffEndFinal[i]; j++) {
      hatOffLineFinal[j + 1] = hatOffLineFinal[j] + slope;
    }
  }


 //console.log("Hat Off Line : " + hatOffLineFinal); 
  for (i = 0; i < hatOffStartFinal.length; i++) {
    for (j = hatOffStartFinal[i]; j < hatOffEndFinal[i]; j++) {
      sleepScore[j] = null;
    }
  }
  

  //console.log("Sleep Score : "+ sleepScore)
  var REMloc = [];
  var REMval = [];
  for (i = 0; i < peakIndexFinal.length; i++) {
    if (peakIndexFinal[i] > 240 && peakIndexFinal[i] < T.length - 240 * 0.75) {
      REMloc.push(peakIndexFinal[i]);
      REMval.push(maxima[i]);
    }
  }
  //console.log("REM Loc : " + REMloc);
  //console.log("REM val : " + REMval);
  var REMoffset1 = 20;
  var REMoffset2 = 50;
  var REMstart = [];
  var REMend = [];
  for (i = 0; i < REMloc.length; i++) {
    if (REMval[i] != 100) {
      REMstart.push(REMloc[i] - REMoffset1);
      REMend.push(REMloc[i] + REMoffset1);
    } /*else {
      var searchStart = REMloc[i] - 200;
      for (i = searchStart; i < searchStart + 200; i++) {
        if (Math.abs(sleepScore[i] - 66) < 5) {
          var REMmid = i;

          // console.log("REM MID : " + REMmid);
          break;
        }
      }
      //  console.log("REM MID : " + REMmid);
      REMstart.push(REMmid-4);
      REMend.push((REMmid + REMoffset1));
    }*/
  }
  //console.log("REM Start : " + REMstart);
  //console.log("REM End : " + REMend);
  var REMon = [];
  for (i = 0; i < sleepScore.length; i++) {
    REMon[i] = null;
  }
  for (i = 0; i < REMstart.length; i++) {
    var j = REMstart[i];
    while (j < REMend[i]) {
      REMon[j] = sleepScore[j];
      j++;
    }
  }
 /*for (i = 0 ; i < REMon.length; i++){
    if (REMon[i] > 70){
      REMon[i] = null;
    }
  }*/
  //console.log("Max T : " +getMaxOfArray(T));
 // console.log("Rating : " + rate2);
  //console.log("MotionPS : " + motionPS);
  
  function sleepScoreGen(rate, maxTime, motionCount,orientation){
  
  var ratingRange = [-2, -1, 0, 1, 2];
  for (i = 0; i<ratingRange.length; i++){
    ratingRange[i] = 5*ratingRange[i];
  }

  var finalRating = ratingRange[rate-1];
  var sleepLengthRange = [1, 2, 3, 4, 5];
  for (i = 0; i<sleepLengthRange.length;i++){
    sleepLengthRange[i] = sleepLengthRange[i]*60/5;
  }
  var motionRange = [5,4,3,2,1];
    for (i = 0; i<motionRange.length;i++){
    motionRange[i] = motionRange[i]*15/5;
  }

  var motionPerHour = sum(motionCount)/maxTime;
  var sleepLengthRating = [];
  var motionRating = [];
  
  if(maxTime <2){
    sleepLengthRating = sleepLengthRange[0];
  }
  else if (maxTime > 2 && maxTime < 4){
    sleepLengthRating = sleepLengthRange[1];
  }
  else if (maxTime > 4 && maxTime < 6){
    sleepLengthRating = sleepLengthRange[2];
  }
  else if (maxTime > 6 && maxTime < 8){
    sleepLengthRating = sleepLengthRange[3];
  }
  else {
    sleepLengthRating = sleepLengthRange[4];
  }
  

  if(motionPerHour < 30){
    motionRating = motionRange[0];
  }
  else if (motionPerHour > 30 && motionPerHour < 45){
    motionRating = motionRange[1];
  }
  else if (motionPerHour > 45 && motionPerHour < 75){
    motionRating = motionRange[2];
  }
  else if (motionPerHour > 75 && motionPerHour < 100){
    motionRating = motionRange[3];
  }
  else {
    motionRating = motionRange[4];
  }
  
  //console.log("uprightOccurances : " + uprightOccurances);
  //console.log("motion rating : " + motionRating);
  //console.log("Sleep length rating : " + sleepLengthRating);
  //console.log("User rating : " + finalRating);
  
  var minScore = 15;
  var maxScore = 95;
  var score = finalRating + sleepLengthRating + motionRating;
  var finalScore = map(score, 5, 85, 15, 95);
  
  return finalScore;
}
  var qualityScore = sleepScoreGen(rate2, getMaxOfArray(T), motionPS,orientation);
  qualityScore = qualityScore - 2*uprightOccurances;
  
  //console.log(sum(hatOffLine) / T.length);
  if (sum(hatOffLine) / T.length >0.4){
    qualityScore = null;
  }
  //  console.log("Sleep Score Rating : " + qualityScore);
  

  //console.log("Baseline :" + baselineShape);  
  //console.log("Sleep Score :" + sleepScore.length);
  //console.log("Time :" + T.length);
  //console.log("Motion PS : " + motionPS);
  //console.log("REMon: " + REMon);
  
  //T = tFinal;
  console.log("Sleep Score :" + sleepScore.length);
  console.log("Final Time Length :" + T.length);
  console.log("Hat Off Line Length : " + hatOffLineFinal.length);
  return [sleepScore, REMon, T, hatOffLineFinal,qualityScore,timesAwoken]; // sleepScore[0] = plot; sleepScore[1] = REMplot ; sleepScore[2] = Time array


}

function sum(toSum){
	var summation = 0;
	for (i = 0; i<toSum.length; i++){
		summation += parseInt(toSum[i]);
	}
	return summation;
}

function smooth(array, window){
    var arrayLen = array.length;
    var halfWindow = Math.round(window/2);
    var returnArray = [];
    for (var i = 0; i < arrayLen ; i++){
        var windowStart = i - halfWindow;
        if ( windowStart < 0){
            windowStart = 0;
        }
        var windowEnd = i + halfWindow;
        if (windowEnd > arrayLen - 1){
            windowEnd = arrayLen - 1;
        }
        var subArray = array.slice(windowStart, windowEnd+1);
        var subArrayLength = subArray.length;
        
        returnArray.push(sum(subArray)/subArrayLength);
        
    }

    return returnArray;
}

// Hat Orientation
function orientationCalc(Ax, Ay, Az, dataLength) { 
    var minX = -1129;
    var maxX = 1070;
    var minY = -1200;
    var maxY = 1200;
    var minZ = -890;
    var maxZ = 1200;


    var straightUpMax = 0.9 * minX;
    var slightLeftMax = 0.58 * minX;
    var leftUpMax = 0.27 * maxX;
    var leftDownMax = 0.9 * maxX;
    var AzMax = 750;
    var AzMin = -750;
    var Orientation = [0];

    for (i = 0; i < dataLength; i++) {
        if (Az[i] > AzMin && Az[i] < AzMax) { //Not sitting up, or standing on your head
            if (Ay[i] >= 0) {
                if (Ax[i] < 760 && Ax[i] > -760) {
                    Orientation[i] = posStates.RIGHT; //% Right
                } else if (Ax[i] > 760) {
                    Orientation[i] = posStates.UP; //% Up
                } else {
                    Orientation[i] = posStates.DOWN; //% Down
                }
            } else { //Ay[i] <=0 
                if (Ax[i] < 570 && Ax[i] > -760) {
                    Orientation[i] = posStates.LEFT; //% Left
                } else if (Ax[i] > 570) {
                    Orientation[i] = posStates.UP; //% Up
                } else {
                    Orientation[i] = posStates.DOWN; //% Down
                }
            }
        } else if (Az[i] > AzMax) {
            Orientation[i] = posStates.STANDING; //%Sitting Up
        } else {
            Orientation[i] = posStates.HEADSTAND; //% Head Stand
        }
    }
    return Orientation;
}


// Headband Orientation
function orientationCalc2(Ax,Ay,Az,dataLength){

	var Orientation = [0];
    
for (i = 0; i<dataLength; i++){
    if  (Math.abs(Ay[i])<900){ //Not sitting up, or standing on your head
          if (Ax[i]>=0){
              if (Math.abs(Az[i]) < 600){
                  Orientation[i] = posStates.LEFT; //% Left
                     } 
              else if (Az[i]>600){
                    Orientation[i] = posStates.UP;//% Up
                 }
              else{
                Orientation[i] = posStates.DOWN; //% Down
                }
          }  
            else{ //Ax[i] <=0 
                if (Math.abs(Az[i]) < 600){
                    Orientation[i] = posStates.RIGHT; //% Right
                  }
                else if (Az[i]>570){
                    Orientation[i] = posStates.UP; //% Up
                  }
                else{
                    Orientation[i] = posStates.DOWN; //% Down
                }
            }
        }
   else if (Ay[i] < -900){
            Orientation[i]= posStates.STANDING; //% Sitting Up
        }
   else{
        Orientation[i] = posStates.HEADSTAND; //% Headstand
    }
}
    return Orientation;
} 

/* function orientationCalc2(Ax,Ay,Az,dataLength){

	var Orientation = [0];
    
for (i = 0; i<dataLength; i++){
    if  (Math.abs(Ay[i])<750){ //Not sitting up, or standing on your head
          if (Ax[i]>=0){
              if (Math.abs(Az[i]) < 600){
                  Orientation[i] = posStates.LEFT; //% Left
                     } 
              else if (Az[i]>600){
                    Orientation[i] = posStates.UP;//% Up
                 }
              else{
                Orientation[i] = posStates.DOWN; //% Down
                }
          }  
            else{ //Ax[i] <=0 
                if (Math.abs(Az[i]) < 600){
                    Orientation[i] = posStates.RIGHT; //% Right
                  }
                else if (Az[i]>570){
                    Orientation[i] = posStates.UP; //% Up
                  }
                else{
                    Orientation[i] = posStates.DOWN; //% Down
                }
            }
        }
   else if (Ay[i] < -750){
            Orientation[i]= posStates.STANDING; //% Sitting Up
        }
   else{
        Orientation[i] = posStates.HEADSTAND; //% Headstand
    }
}
    return Orientation;
}  */


function map(value, fromLow , fromHigh, toLow, toHigh){
	return (toHigh-toLow)*(value-fromLow)/(fromHigh-fromLow)+toLow;
}
    
function getMaxOfArray(numArray) {
	return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
	return Math.min.apply(null, numArray);
}

function emailDataNow(data){
	//alert(JSON.stringify(data));
	var accelX = JSON.stringify(data[0]);
	var accelY = JSON.stringify(data[1]);
	var accelZ = JSON.stringify(data[2]);
	var tonesagain = JSON.stringify(data[3]);
	var sleepStateCopy = JSON.stringify(data[8]);
	var sigStrengthCopy = JSON.stringify(data[5]);
	var motionCopy = JSON.stringify(data[6]);
	var ratingCopy = data[7];
	var algorithm = data[9];
	var dateString = new Date(data[4]).toString();
	$.ajax({
		url: "http://www.sleephat.com/admin/exportData.php",
		data: {
			accelX: accelX,
			accelY: accelY,
			accelZ: accelZ,
			tones: tonesagain,
			date: dateString,
			sigStrength: sigStrengthCopy,
			motionPerSample: motionCopy,
			address: address,
			sleepState: sleepStateCopy,
			rating: ratingCopy,
			algorithm: algorithm
		},
		method: 'post',
		dataType: "json",
		success: function(data){
			//alert(data);
			
			if (data == "Success"){
				//alert('boom successful email')
			}else{
				//alert('not successful email');
				// maybe try sending email again on fail?
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			//alert(errorThrown);
		}
		
		
	});
}

function loadPlots(){
	// setTimeout(function(){
		// navigator.splashscreen.hide();
	// },2000);
	var lastDay, otherButtons, trendTitle, dailyBtn;
	if (localStorage.dayData){
			// alert(JSON.stringify(localStorage));
			readLocalStorage();
			lastDay = dayData[dayData.length - 1];
			
			//alert('lastDay.scoresAlt2.length: '+lastDay.scoresAlt2.length);
			
			// if we don't have any msFromMidnight data, calculate the avg as the avg of whatever dayData we have
			if (!lastDay.msFromMidnight){
				var msFMarr = [];
				for (i = 0 ; i < dayData.length ; i++){
					msFMarr.push(msFromMidnight(dayData[i].time));
				}
				var avgMSfromMidnight = arrayMean(msFMarr);
				
				// set msFromMidnight to avgMSfromMidnight for : dayData objs, allTimeAvgs, currentWeekAvgs, weekData objs, currentMonthAvgs, monthData objs
				
				for ( i = 0 ; i < dayData.length ; i++){
					dayData[i].msFromMidnight = avgMSfromMidnight;
				}
				
				for ( i = 0 ; i < weekData.length ; i++){
					weekData[i].msFromMidnight = avgMSfromMidnight;
				}
				
				for ( i = 0 ; i < monthData.length ; i++){
					monthData[i].msFromMidnight = avgMSfromMidnight;
				}
				
				allTimeAvgs.msFromMidnight = avgMSfromMidnight;
				currentWeekAvgs.msFromMidnight = avgMSfromMidnight;
				currentMonthAvgs.msFromMidnight = avgMSfromMidnight;
				
				updateLocalStorage();
				
				//alert(arrayMean(msFMarr));
			}else{
				//alert('now we have msFromMidnight in localStorage');
			}
			
			updateLastSleepPie(lastDay.percents);
			// updateTrends(getTrendsData(dayData), getTrendsData(weekData), getTrendsData(monthData));
			updateTrends2(getTrendsData(dayData));
			if (lastDay.scoresAlt){
				if (lastDay.scoresAlt2){
					//alert(lastDay.scoresAlt2);
					if (lastDay.badSig){
						updateSleepLab(lastDay.scoresAlt2, lastDay.tones, lastDay.time, lastDay.scoresAlt, lastDay.timeArr,lastDay.rem,lastDay.badSig);
					}else{
						updateSleepLab(lastDay.scoresAlt2, lastDay.tones, lastDay.time, lastDay.scoresAlt, lastDay.timeArr,lastDay.rem,[]);
					}
				}else{
					updateSleepLab(lastDay.scores, lastDay.tones, lastDay.time, lastDay.scoresAlt, lastDay.timeArr);
				}			
			}else{
				updateSleepLab(lastDay.scores, lastDay.tones, lastDay.time, [], []);
			}
			updateOrientation(lastDay.angles, lastDay.time, lastDay.scoresAlt2);
			// updateStats(allTimeAvgs.totalScore, lastDay.states);
			updateTrendsTable(getPast7Avgs(dayData));
			updateLastSleepTable(lastDay);
			updateSleepLabTable(lastDay);
			// alert(lastDay.rating);
			$('.rating ul li').removeClass('active');
			for (i = 1 ; i <= lastDay.rating ; i++){
				$('#ls-cloud-'+i).addClass('active');
			}
			
			var differenceFromAvg = (lastDay.totalScore - allTimeAvgs.totalScore).toFixed(1);
			//alert(differenceFromAvg);
			
			if (differenceFromAvg < 0){
				$('#difference').addClass('negative').html(differenceFromAvg);
			}else{
				$('#difference').removeClass('negative').html("+"+differenceFromAvg);
			}
			
			
			var date = new Date(lastDay.time);
			var replacementObj = {
				"%d%": date.getDate(),
				"%m%": (date.getMonth()+1),
				"%y%": date.getFullYear()
			};
			
			var str = labelYear;
			str = str.replace(/%\w+%/g, function(all) {
				return replacementObj[all] || all;
			});
			var newLabel = str;
			$('#lsDate').html(lastDay.label);
			$('#lsDate, #labDate').html(newLabel);
			
			// updateStatsTable(allTimeAvgs);
			
			switch (currentTrend){
		
				case "daily":
					otherButtons = $('#weekly, #monthly, #alltime');
					otherButtons.removeClass("current");
					dailyBtn = $('#daily');
					dailyBtn.addClass("current");
					trendTitle = $('.trendTitleTable');
					trendTitle.html(labelAvgL7sleeps);
					$('.statlabel').addClass('noDisplay');
					updateTrends2(getTrendsData(dayData));
					updateTrendsTable(getPast7Avgs(dayData));
					break;
				case "weekly":
					otherButtons = $('#daily, #monthly, #alltime');
					otherButtons.removeClass("current");
					var weeklyBtn = $('#weekly');
					weeklyBtn.addClass("current");
					trendTitle = $('.trendTitleTable');
					trendTitle.html(labelAvgL7weeks);
					$('.statlabel').addClass('noDisplay');
					updateTrends2(getTrendsData(weekData));
					updateTrendsTable(getPast7Avgs(weekData));
					break;
				case "monthly":
					//alert('here - monthly');
					otherButtons = $('#weekly, #daily, #alltime');
					otherButtons.removeClass("current");
					// alert('here 2 - monthly');
					var monthlyBtn = $('#monthly');
					monthlyBtn.addClass("current");
					trendTitle = $('.trendTitleTable');
					trendTitle.html(labelAvgL7months);
					$('.statlabel').addClass('noDisplay');
					updateTrends2(getTrendsData(monthData));
					updateTrendsTable(getPast7Avgs(monthData));
					
					
					break;
				case "allTime":
					otherButtons = $('#daily, #weekly, #monthly');
					otherButtons.removeClass("current");
					var allTimeBtn = $('#alltime');
					allTimeBtn.addClass("current");
					trendTitle = $('.trendTitleTable');
					trendTitle.html(labelAvgAllTime);
					$('.statlabel').removeClass('noDisplay');
					updateStats(allTimeAvgs.totalScore, allTimeAvgs.rating, allTimeAvgs.states);
					updateStatsTable(allTimeAvgs);
				break;
			}
			
			
			//setTimeout(function(){alert('end of localStorage available in loadPlots()');},500);
		}else{ 
			//alert('no local storage');
			// Default Values
			localStorage.dataStored = "false";
			localStorage.lastUsed = 0;
			lastSleepSummary = [50, 40, 10, 0];
			// sleepState = [99.97,100,99.97,99.87,99.71,99.49,99.21,98.86,98.46,97.99,97.46,96.88,96.23,95.53,94.78,93.98,93.12,92.22,91.26,90.26,89.22,88.14,87.02,85.86,84.66,83.44,82.19,80.9,79.6,78.27,76.93,75.57,74.2,72.81,71.42,70.03,68.63,67.24,65.85,64.46,63.09,61.73,60.38,59.06,57.75,56.47,55.22,53.99,52.8,51.64,50.52,49.44,48.39,47.4,46.44,45.54,44.68,43.88,43.12,42.43,41.78,41.2,40.67,40.2,39.8,39.45,39.17,38.94,38.79,38.69,38.66,37.8,36.93,36.07,35.21,34.35,33.49,32.63,31.76,30.9,30.04,29.18,28.32,27.45,26.59,25.73,24.87,24.01,23.15,22.41,21.67,21.05,20.44,19.82,19.21,18.59,17.97,17.36,16.74,16.13,15.51,14.9,14.28,13.79,13.42,13.05,12.68,12.31,11.94,11.57,11.2,10.83,10.46,10.1,9.73,9.36,8.99,8.62,8.25,7.88,7.51,7.14,6.77,6.4,6.03,5.66,5.29,5.05,4.92,4.92,5.05,5.29,5.54,5.91,6.4,6.89,7.39,7.88,8.37,8.99,9.6,10.22,10.96,11.82,12.68,13.54,14.4,15.27,16.13,16.99,17.85,18.71,19.58,20.44,21.3,22.16,23.02,23.88,24.75,25.61,26.47,27.33,28.19,29.06,29.92,30.78,31.64,32.5,33.36,34.23,35.09,35.95,36.81,37.67,38.54,39.4,40.26,41.12,41.98,42.84,43.71,44.57,45.43,46.29,47.15,48.02,48.88,49.74,50.6,51.46,52.32,53.19,54.05,54.91,55.77,56.63,57.5,58.36,59.22,60.08,60.82,61.44,61.93,62.3,62.54,62.79,62.91,62.91,62.91,62.91,62.91,62.91,62.91,63.04,63.16,63.28,63.4,63.53,63.65,63.77,63.9,64.02,64.14,64.27,64.39,64.51,64.64,64.76,64.76,64.64,64.39,64.02,63.53,63.04,62.42,61.68,60.94,60.2,59.47,58.73,57.99,57.25,56.51,55.77,55.03,54.29,53.56,52.82,52.08,51.34,50.6,49.86,49.12,48.38,47.65,46.91,46.17,45.43,44.69,43.95,43.21,42.48,41.74,41,40.26,39.52,38.78,38.04,37.3,36.57,35.83,35.09,34.35,33.61,32.87,32.13,31.39,30.66,29.92,29.18,28.44,27.7,26.96,26.22,25.49,24.75,23.88,23.02,22.16,21.3,20.44,19.58,18.71,17.85,17.11,16.37,15.64,14.9,14.16,13.42,12.68,12.07,11.57,11.2,10.96,10.83,10.71,10.71,10.83,10.96,11.08,11.2,11.33,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.33,11.2,11.08,10.96,10.83,10.71,10.59,10.46,10.34,10.22,10.1,9.97,9.85,9.73,9.6,9.48,9.36,9.23,9.11,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.86,8.74,8.62,8.5,8.37,8.25,8.13,8,7.88,7.76,7.63,7.51,7.39,7.26,7.14,7.02,6.89,6.77,6.65,6.53,6.4,6.28,6.16,6.03,5.91,5.79,5.66,5.54,5.42,5.29,5.17,5.05,4.92,4.8,4.68,4.56,4.43,4.31,4.19,4.06,3.94,3.82,3.69,3.57,3.45,3.32,3.2,3.08,2.95,2.83,2.71,2.59,2.46,2.34,2.22,2.09,1.97,1.85,1.72,1.6,1.48,1.35,1.23,1.11,0.98,0.86,0.74,0.62,0.49,0.37,0.25,0.25,0.37,0.62,0.86,1.11,1.35,1.6,1.85,2.09,2.34,2.59,2.83,3.08,3.32,3.57,3.82,4.06,4.31,4.56,4.8,5.05,5.29,5.54,5.79,6.03,6.4,6.89,7.39,7.88,8.37,8.86,9.36,9.85,10.34,10.83,11.33,11.82,12.31,12.8,13.3,13.79,14.28,14.77,15.27,15.76,16.25,16.74,17.24,17.73,18.22,18.71,19.21,19.7,20.19,20.68,21.18,21.67,22.16,22.65,23.15,23.64,24.13,24.62,25.12,25.61,26.1,26.59,27.09,27.58,28.19,28.81,29.42,30.04,30.53,30.9,31.27,31.64,32.01,32.38,32.75,33.12,33.49,33.86,34.23,34.6,34.97,35.46,36.07,36.69,37.3,37.92,38.54,39.15,39.77,40.38,41,41.61,42.23,42.72,43.09,43.46,43.71,43.83,43.95,44.08,44.2,44.32,44.44,44.57,44.69,44.81,44.94,45.06,45.18,45.31,45.43,45.55,45.68,45.8,45.92,46.05,46.17,46.29,46.41,46.54,46.66,46.66,46.54,46.41,46.29,46.17,46.05,45.92,45.8,45.68,45.55,45.43,45.31,45.18,45.06,44.94,44.81,44.57,44.32,44.08,43.83,43.58,43.34,43.09,42.84,42.6,42.35,42.11,41.86,41.61,41.37,41.12,40.87,40.63,40.26,39.77,39.27,38.78,38.29,37.8,37.3,36.81,36.32,35.83,35.33,34.72,34.1,33.49,32.87,32.38,32.01,31.64,31.27,30.9,30.53,30.16,29.79,29.42,29.06,28.69,28.32,27.95,27.45,26.84,26.22,25.61,24.99,24.38,23.76,23.15,22.53,21.91,21.3,20.68,20.19,19.82,19.58,19.45,19.33,19.21,19.08,18.96,18.84,18.71,18.59,18.47,18.34,18.22,18.1,17.97,17.85,17.73,17.61,17.48,17.36,17.24,17.11,16.99,16.87,16.74,16.62,16.5,16.37,16.25,16.13,16.01,15.88,15.76,15.64,15.51,15.39,15.27,15.14,15.02,14.9,14.77,14.65,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.65,14.9,15.14,15.39,15.64,15.88,16.13,16.37,16.62,16.87,17.24,17.73,18.22,18.71,19.08,19.33,19.58,19.82,20.07,20.31,20.56,20.81,21.05,21.3,21.55,21.79,22.04,22.28,22.53,22.78,23.02,23.27,23.52,23.76,24.01,24.25,24.5,24.75,24.99,25.24,25.49,25.73,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.98,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,25.98,25.73,25.49,25.24,25.12,25.12,25.12,25.12,25.12,25.12,25.12,25.12,25.24,25.36,25.49,25.61,25.73,25.85,25.98,26.1,26.22,26.35,26.47,26.59,26.72,26.84,26.96,27.09,27.21,27.33,27.45,27.58,27.7,27.82,27.95,28.07,28.19,28.32,28.44,28.56,28.69,28.81,28.93,29.06,29.06,28.93,28.81,28.69,28.56,28.44,28.32,28.19,28.07,27.95,27.82,27.7,27.58,27.45,27.33,27.21,27.09,26.96,26.84,26.72,26.59,26.47,26.35,26.22,26.1,25.98,25.85,25.73,25.49,25.24,25.12,24.99,24.87,24.75,24.62,24.62,24.62,24.62,24.62,24.62,24.62,24.5,24.38,24.25,24.13,24.01,23.88,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.64,23.52,23.39,23.27,23.15,23.02,22.9,22.78,22.65,22.53,22.41,22.28,22.16,22.04,21.91,21.79,21.67,21.55,21.42,21.3,21.18,21.05,20.93,20.81,20.81,20.93,21.05,21.18,21.3,21.42,21.55,21.67,21.91,22.28,22.65,23.02,23.39,23.76,24.13,24.38,24.62,24.87,25.12,25.36,25.61,25.85,26.1,26.35,26.59,26.84,27.09,27.33,27.45,27.58,27.7,27.82,27.95,28.07,28.19,28.32,28.44,28.56,28.69,28.81,28.93,29.06,29.18,29.3,29.42,29.55,29.67,29.79,29.92,30.16,30.41,30.66,30.9,31.15,31.39,31.64,31.76,31.89,32.01,32.13,32.26,32.38,32.5,32.63,32.75,32.87,33.12,33.36,33.61,33.86,34.1,34.35,34.6,34.72,34.72,34.72,34.72,34.72,34.72,34.84,34.97,35.09,35.21,35.33,35.46,35.58,35.7,35.83,35.95,36.07,36.2,36.32,36.44,36.57,36.69,36.81,36.93,37.06,37.18,37.3,37.43,37.43,37.3,37.18,37.06,36.93,36.81,36.69,36.57,36.44,36.32,36.2,36.07,35.95,35.95,35.95,35.95,35.95,36.07,36.2,36.32,36.44,36.57,36.69,36.81,36.93,37.06,37.18,37.3,37.55,37.8,38.04,38.29,38.54,38.78,39.03,39.27,39.52,39.77,39.89,40.01,40.14,40.26,40.38,40.38,40.38,40.38,40.38,40.38,40.38,40.38,40.38,40.26,40.14,40.01,39.89,39.77,39.64,39.52,39.4,39.27,39.15,39.03,38.9,38.78,38.66,38.54,38.29,38.04,37.8,37.55,37.3,37.06,36.81,36.69,36.69,36.69,36.69,36.69,36.69,36.57,36.44,36.32,36.2,36.07,35.95,35.83,35.58,35.46,35.33,35.21,34.97,34.72,34.47,34.23,33.98,33.73,33.49,33.24,33,32.75,32.5,32.26,32.01,31.76,31.52,31.27,31.03,30.78,30.53,30.29,30.04,29.79,29.55,29.3,28.93,28.56,28.32,28.07,27.7,27.33,26.96,26.59,26.22,25.85,25.49,25.12,24.75,24.38,24.01,23.64,23.27,22.9,22.53,22.16,21.79,21.42,21.05,20.68,20.31,20.07,19.82,19.58,19.33,19.08,18.84,18.59,18.34,18.1,17.85,17.61,17.36,17.11,16.99,16.87,16.74,16.62,16.5,16.37,16.25,16.13,15.88,15.64,15.39,15.14,14.9,14.65,14.4,14.16,13.91,13.67,13.42,13.17,12.93,12.68,12.43,12.31,12.19,12.07,11.94,11.82,11.7,11.57,11.45,11.33,11.2,11.08,10.96,10.96,10.83,10.71,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.71,10.83,10.96,11.08,11.2,11.33,11.45,11.57,11.7,11.82,11.94,12.07,12.31,12.56,12.93,13.3,13.67,14.04,14.4,14.77,15.14,15.51,15.88,16.25,16.62,16.99,17.36,17.73,18.1,18.47,18.84,19.21,19.58,19.94,20.31,20.68,21.05,21.42,21.79,22.16,22.53,22.78,23.02,23.27,23.52,23.76,24.01,24.25,24.5,24.75,24.99,25.24,25.49,25.73,26.1,26.47,26.84,27.21,27.7,28.19,28.69,29.18,29.67,30.16,30.66,31.15,31.64,32.13,32.63,33,33.36,33.73,34.1,34.35,34.6,34.84,35.09,35.46,35.83,36.2,36.57,36.93,37.3,37.67,38.04,38.29,38.54,38.66,38.78,38.9,39.03,39.15,39.27,39.4,39.52,39.64,39.77,39.89,40.01,40.14,40.26,40.26,40.26,40.38,40.51,40.63,40.75,41,41.24,41.61,41.98,42.35,42.72,42.97,43.21,43.34,43.46,43.58,43.71,43.83,43.95,44.08,44.2,44.32,44.44,44.57,44.69,44.81,44.94,45.06,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.31,45.43,45.55,45.68,45.31,44.94,44.58,44.57,44.58,44.61,44.67,44.74,44.84,44.95,45.09,45.25,45.42,45.61,45.82,46.05,46.29,46.54,46.81,47.09,47.38,47.68,47.98,48.3,48.62,48.94,49.26,49.59,49.91,50.23,50.55,50.86,51.17,51.47,51.76,52.04,52.3,52.56,52.8,53.02,53.23,53.43,53.6,53.76,53.89,54.01,54.11,54.18,54.24,54.27];
			
			sleepState = [100,99.97672722063878,99.90693661716608,99.79071136036293,99.62818995806433,99.41956609009665,99.1650883774659,98.86506008607134,98.51983876529766,98.12983582191683,97.69551602980667,97.21739697607114,96.69604844422203,96.1320917351571,95.52619892674412,94.87909207289294,94.19154234307027,93.4643691032823,92.69843893962094,91.89466462553666,91.05400403406917,90.17745899633198,89.26607410761143,88.3209354825026,87.34316946056614,86.3339412640481,85.29445360926248,84.22594527329159,83.12968961771193,82.00699307110516,80.85919357216241,79.68765897523753,78.49378542024917,77.27899566887447,76.04473740901706,74.79248152957007,73.52372036752996,72.23996592955041,70.9427480900554,69.63361276805888,68.31412008486393,66.98584250483668,65.65036296147088,64.30927297097604,62.96417073563757,61.616659239208886,60.26834433660537,58.9208328401767,57.57573060483825,56.23464061434345,54.89916107097768,53.57088349095049,52.251390807755584,50.94225548575912,49.64503764626419,48.36128320828473,47.092522046244724,45.84026616679783,44.60600790694052,43.39121815556594,42.19734460057773,41.02581000365298,39.878010504710375,38.755313958103756,37.659058302524265,36.59054996655355,35.551062311768106,34.54183411525023,33.56406809331396,32.618929468205344,31.707544579484995,30.830999541748035,29.990338950280755,29.1865646361967,28.42063447253556,27.693461232747843,27.0059115029254,26.358804649074457,25.75291184066173,25.188955131597048,24.667606599748204,24.18948754601294,23.75516775390303,23.365164810522465,23.019943489749075,22.719915198354776,22.465437485724316,22.256813617756904,22.094292215458566,21.97806695865571,21.908276355183283,21.88500357582234,21.886442302166667,21.89075826952283,21.897950842891834,21.90801896404581,21.92096115168372,21.93677550164931,21.955459687211256,21.97701095940548,22.001426147439606,22.028701659159484,22.058833481577683,22.091817181463913,22.12764790599728,22.166320383480276,22.207828924114384,22.252167420837214,22.29932935022101,22.34930777343244,22.402095337253485,22.457684275163306,22.51606640848091,22.577233147568474,22.641175493095105,22.707884037360895,22.777348965681064,22.84956005782997,22.924506689544785,23.002177834088624,23.082562063872885,23.165647552138555,23.251422074696283,23.33987301172486,23.43098734962798,23.52475168294889,23.621152216342693,23.720174766606053,23.821804764763918,23.926027258213033,24.032826912921877,24.142188015686738,24.254094476443555,24.368529830635207,24.485477241633923,24.604919503218404,24.726839042105354,24.85121792053498,24.97803783891017,25.107280138488807,25.238925804129074,25.372955467087056,25.509349407866424,25.64808755911975,25.789149508600943,25.93251450216848,26.078161446838898,26.226068913890195,26.376215142014544,26.528578040520028,26.683135192580767,26.839863858535082,26.998740979231115,27.15974317941948,27.3228467711924,27.488027757468892,27.655261835525366,27.824524400571256,27.99579054936907,28.169035083898322,28.344232515062906,28.521357066441226,28.70038267807862,28.88128301032154,29.064031447692777,29.24860110280744,29.434964820328737,29.62309518096336,29.8129645054956,30.00454485885969,30.19780805424991,30.39272565726757,30.58926899010458,30.78740913576267,30.987116942307964,31.188363027160023,31.391117781414763,31.595351374200884,31.801033757068694,32.00813466841118,32.21662363791622,32.42646999104976,32.63764285356871,32.8501111560636,33.06384363852958,33.27880885496578,33.49497517800181,33.71231080355103,33.9307837554898,34.15036189036222,34.371012902109065,34.592704326821085,34.81540354751533,35.03907779893399,35.263694172365035,35.4892196204841,35.71562096221657,35.942864887619535,36.1709179627825,36.39974663474655,36.62931723644088,36.85959599163614,37.09054901991385,37.32214234165123,37.5543418830205,37.78711348100203,38.02042288841079,38.254235778935,38.48851775218644,38.723234338761785,38.958351005314015,39.193833159633186,39.42964615573588,39.66575529896271,39.90212585108273,40.138723035404524,40.37551204189272,40.612458032289595,40.84952614524073,41.086681501424025,41.323889208681535,41.56111436715294,41.79832207441044,42.03547743059373,42.27254554354485,42.509491533941734,42.746280540429936,42.98287772475171,43.21924827687172,43.45535742009854,43.69117041620121,43.92665257052036,44.16176923707256,44.39648582364791,44.63076779689932,44.864580687423484,45.09789009483222,45.330661692813734,45.56286123418297,45.79445455592032,46.025407584198014,46.255686339393215,46.4852569410875,46.71408561305152,46.94213868821446,47.16938261361737,47.3957839553498,47.621309403468814,47.84592577689981,48.069600028318405,48.292299249012615,48.513990673724585,48.73464168547138,48.954219820343724,49.172692772282474,49.390028397831614,49.60619472086757,49.82115993730372,50.034892419769655,50.24736072226447,50.45853358478335,50.66837993791682,50.87686890742179,51.08396981876419,51.28965220163194,51.493885794417984,51.69664054867265,51.897886633524614,52.09759444006984,52.29573458572787,52.49227791856478,52.68719552158235,52.88045871697249,53.072039070336494,53.261908394868634,53.45003875550318,53.6364024730244,53.82097212813896,54.0037205655101,54.18462089775292,54.363646509390236,54.54077106076845,54.71596849193293,54.88921302646209,55.06047917525978,55.22974174030557,55.39697581836195,55.562156804638335,55.725260396411144,55.8862625965994,56.04513971729533,56.20186838324953,56.35642553531015,56.50878843381553,56.658934661939774,56.80684212899094,56.952489073661255,57.09585406722868,57.23691601670974,57.37565416796294,57.5120481087422,57.646077771700064,57.7777234373402,57.90696573691872,58.033785655293784,58.158164533723294,58.28008407261011,58.39952633419446,58.51647374519305,58.63090909938457,58.74281556014125,58.85217666290599,58.95897631761471,59.06319881106369,59.16482880922142,59.26385135948465,59.36025189287831,59.45401622619908,59.54513056410207,59.63358150113051,59.71935602368809,59.80244151195363,59.88282574173776,59.960496886281454,60.03544351799613,60.1076546101449,60.17711953846493,60.24382808273057,60.30777042825706,60.368937167344484,60.42731930066195,60.482908238571625,60.535695802392524,60.58567422560381,60.632836154987466,60.677174651710146,60.718683192344116,60.757355669826964,60.79318639436019,60.82617009424627,60.85630191666432,60.88357742838406,60.907992616418035,60.92954388861211,60.94822807417391,60.96404242413935,60.97698461177712,60.98705273293095,60.9942453062998,60.998561273655824,61,60.969879814919985,60.87961402892559,60.72948665157468,60.51997003913819,60.25172340839251,59.92559076247967,59.54259823536117,59.10395086322091,58.611028792975546,58.06538293982166,57.46873010748281,56.82294758650983,56.130067247630194,55.392269148731074,54.611874675590606,53.79133923793944,52.933244543833304,52.040290476644316,51.11528660022903,50.16114331900113,49.18086272072237,48.17752913082383,47.15429940797701,46.11439301144851,45.061081871490146,43.99768009463578,42.92753353629621,41.85400927346002,40.780485010623835,39.710338452284276,38.64693667542995,37.59362553547162,36.55371913894319,35.53048941609643,34.52715582619797,33.54687522791931,32.5927319466915,31.667728070276333,30.774774003087465,29.916679308981458,29.096143871330437,28.31574939819012,27.57795129929116,26.8850709604117,26.23928843943888,25.64263560710022,25.096989753946534,24.604067683701363,24.16542031156131,23.78242778444302,23.45629513853039,23.188048507784927,22.978531895348652,22.828404517997964,22.73813873200379,22.708018546923995,22.710006595952905,22.715970330176166,22.72590851108947,22.739819074804753,22.75769913247879,22.779544970913168,22.805352053325375,22.835115020290996,22.868827690856694,22.90648306382385,22.948073319202496,22.993589819835332,23.043023113191417,23.096362933329196,23.153598203028473,23.214717036090832,23.27970673980807,23.34855381759814,23.42124397180802,23.49776210668293,23.578092331501317,23.66221796387493,23.75012153321327,23.841784784351788,23.937188681342953,24.03631341140952,24.139138389059077,24.245642260359116,24.35580290737163,24.46959745274643,24.58700226447213,24.707992960783876,24.83254441522676,24.960630761873905,25.092225400698112,25.22730100309595,25.365829517563164,25.507782175520195,25.653129497286656,25.80184129820341,25.95388669490113,26.109234111713914,26.26785128723669,26.429705281025047,26.59476248043601,26.762988607608527,26.934348726582016,27.10880725055158,27.286327949258464,27.466873956514057,27.650407777855982,27.8368912983347,28.026285790428915,28.21855192208823,28.413649764901344,28.611538802388054,28.812177938413477,29.015525505722557,29.22153927459319,29.430176461606237,29.641393738530446,29.855147241320502,30.07139257922642,30.290084844012323,30.511178619282607,30.734627989913655,30.960386551589245,31.18840742043735,31.418643242766727,31.65104620490093,31.885568043107874,32.122160053623,32.36077310276356,32.60135763713249,32.843863693909164,33.08824091122543,33.33443853862424,33.5824054475993,33.832090142212934,34.0834407697904,34.33640513168834,34.59093069413491,34.84696459913972,35.104453675470886,35.363344449697266,35.62358315729351,35.88511575380534,36.14788792607321,36.41184510351165,36.67693246944203,36.9430949724765,37.21027733795072,37.478424079402835,37.74747951009645,38.01738775458536,38.28809276031724,38.559538309274295,38.83166802964819,39.10442540754687,39.377753798731064,39.65159644037759,39.92589646286761,40.20059690159678,40.47564070880523,40.75097076542491,41.02652989294157,41.30226086526923,41.57810642063441,41.854009273467945,42.12991212630146,42.40575768166664,42.68148865399429,42.957047781510944,43.23237783813062,43.50742164533905,43.78212208406819,44.0564221065582,44.33026474820473,44.60359313938888,44.876350517287534,45.14848023766139,45.41992578661843,45.69063079235029,45.96053903683915,46.22959446753273,46.49774120898479,46.764923574458976,47.03108607749341,47.29617344342373,47.56013062086211,47.82290279312995,48.08443538964171,48.3446740972379,48.60356487146423,48.861053947795334,49.11708785280007,49.371613415246586,49.62457777714445,49.87592840472185,50.125613099335396,50.37358000831039,50.61977763570914,50.86415485302531,51.10666090980191,51.34724544417075,51.58585849331124,51.82245050382626,52.05697234203312,52.289375304167216,52.51961112649651,52.747631995344534,52.97339055702001,53.19683992765096,53.41793370292114,53.636625967706934,53.852871305612766,54.0666248084027,54.27784208532678,54.486479272339736,54.692493041210255,54.895840608519215,55.09647974454452,55.29436878203111,55.4894666248441,55.6817327565033,55.87112724859739,56.05761076907598,56.24114459041778,56.42169059767323,56.59921129638,56.773669820349426,56.945029939322765,57.11325606649515,57.278313265905986,57.440167259694206,57.59878443521684,57.754131852029474,57.90617724872706,58.05488904964368,58.200236371409986,58.34218902936687,58.48071754383393,58.615793146231624,58.747387785055686,58.875474131702674,59.0000255861454,59.121016282457,59.23842109418255,59.35221563955719,59.462376286569544,59.568880157869415,59.67170513551882,59.77082986558523,59.866233762576236,59.957897013714586,60.04580058305277,60.12992621542622,60.21025644024444,60.28677457511918,60.3594647293289,60.42831180711881,60.49330151083588,60.55442034389807,60.61165561359718,60.66499543373479,60.714428727090706,60.75994522772337,60.80153548310185,60.83919085606884,60.87290352663436,60.90266649359982,60.928473576011854,60.95031941444606,60.96819947211993,60.982110035835035,60.992048216748174,60.99801195097126,61,60.98308519493533,60.93236893276503,60.84793562570235,60.72992580465422,60.578535885321514,60.394017841284395,60.17667878461724,59.92688045473085,59.64503861629295,59.331622367228874,58.987153357954405,58.61220492314011,58.207401127452414,57.77341572685946,57.31097104723089,56.82083678209768,56.30382871157318,55.7608073445677,55.192676486556294,54.60038173528375,53.98490890691049,53.34728239521885,52.6885634666107,52.0098484937343,51.31226713068018,50.596980432783425,49.86517892416164,49.118080616205035,48.356928980316695,47.58299087827716,46.79755445367793,46.001926987933714,45.197432724441434,44.38541066450779,43.567212338713766,42.74419955742535,41.91774214419453,41.089215655823246,40.25999909288481,39.43147260451354,38.60501519128273,37.78200240999433,36.96380408420033,36.15178202426672,35.34728776077448,34.55166029503032,33.76622387043115,32.99228576839167,32.2311341325034,31.48403582454687,30.752234315925158,30.036947618028492,29.33936625497446,28.660651282098158,28.00193235349012,27.364305841798586,26.74883301342545,26.15653826215302,25.588407404141734,25.04538603713639,24.52837796661202,24.038243701478947,23.57579902185053,23.141813621257718,22.737009825570162,22.36206139075603,22.017592381481712,21.704176132417793,21.422334293980054,21.172535964093836,20.955196907426842,20.770678863389893,20.619288944057352,20.5012791230094,20.416845815946886,20.36612955377676,20.349214748712257,20.35033894827028,20.353711419448725,20.3593317797754,20.36719939184486,20.377313363390694,20.389672547386706,20.404275542177,20.42112069163496,20.44020608535104,20.461529558849453,20.48508869383363,20.510880818460485,20.53890300764342,20.56915208338407,20.60162461513271,20.636316920177325,20.67322506406126,20.712344861029422,20.753671874503,20.7972014175826,20.842928553579807,20.890848096577038,20.940954612015695,20.99324241731247,21.04770558250384,21.104337930918565,21.16313303987818,21.22408424142542,21.2871846230804,21.352427028624575,21.419804058912323,21.4893080727101,21.560931187563007,21.63466528068875,21.710501989898855,21.788432714547007,21.86844861650447,21.95054062116239,22.034699418460985,22.120915463945376,22.209178979848016,22.29947995619761,22.39180815195434,22.486153096171286,22.58250408918197,22.680850203813748,22.781180286627137,22.883482959180665,22.98774661932134,23.09395944250042,23.20210938311446,23.312184175871398,23.424171337181548,23.538058166573396,23.65383174813393,23.77147895197345,23.890986435714627,24.012340646005658,24.13552782005737,24.260533987204028,24.387344970487796,24.515946388266475,24.64632365584461,24.77846198712748,24.91234639629801,25.04796169951633,25.185292516641738,25.32432327297699,25.465038201034634,25.607421342325175,25.75145654916696,25.897127486517434,26.044417633825773,26.19331028690643,26.34378855983357,26.495835386856093,26.649433524333094,26.804565552689418,26.961213878391273,27.119360735941456,27.278988189894186,27.440078136889127,27.602612307704515,27.766572269329068,27.931939427052477,28.098695026574212,28.266820156130485,28.43629574863899,28.607102583861355,28.779221290582875,28.952632348809352,29.127316091981037,29.303252709202777,29.48042224749095,29.658804614036256,29.838379578482467,30.01912677522074,30.2010257056993,30.384055740748174,30.568196122918682,30.753425968837714,30.939724271575884,31.127069903030158,31.315441616319784,31.504818048196057,31.69517772146505,31.886499047423378,32.07876032830654,32.27193975974969,32.466015433260495,32.66096533870366,32.85676736679733,33.05339931162022,33.250838873130206,33.44906365969331,33.64805119062308,33.84777889873022,34.04822413288187,34.2493641605705,34.451176170491955,34.653637275132624,34.856724513364895,35.06041485305145,35.26468519365705,35.46951236886861,35.67487314922234,35.8807442447383,36.08710230756165,36.29392393461053,36.501185670230306,36.708864008853475,36.91693539766571,37.1253762392767,37.334162894396584,37.54327168451666,37.75267889459495,37.962360775745616,38.17229354793237,38.382453402665334,38.592816505701215,38.803358999746294,39.01405700716208,39.224886632673375,39.43582396607806,39.64684508495899,39.85792605739677,40.06904294468408,40.28017180404048,40.49128869132779,40.702369663765566,40.91339078264647,41.12432811605119,41.33515774156244,41.54585574897825,41.756398243023305,41.96676134605917,42.17692120079212,42.38685397297887,42.59653585412951,42.80594306420779,43.01505185432785,43.223838509447695,43.432279351058696,43.640350739870875,43.84802907849405,44.05529081411378,44.26211244116264,44.46847050398596,44.67434159950189,44.8797023798556,45.08452955506712,45.288799895672696,45.49249023535919,45.69557747359147,45.89803857823208,46.099850588153515,46.30099061584209,46.5014358499937,46.70116355810079,46.90015108903052,47.098375875593575,47.29581543710352,47.49244738192636,47.688249410019964,47.883199315463116,48.07727498897385,48.27045442041695,48.462715701300056,48.654037027258326,48.84439670052726,49.03377313240348,49.22214484569306,49.409490477147244,49.59578877988538,49.78101862580432,49.96515900797479,50.14818904302357,50.330087973502074,50.510835170240284,50.69041013468643,50.86879250123167,51.045962039519765,51.221898656741445,51.39658239991303,51.569993458139464,51.74211216486088,51.91291900008318,52.0823945925916,52.2505197221478,52.41727532166946,52.58264247939278,52.74660244101725,52.90913661183256,53.07022655882742,53.22985401278005,53.38800087033016,53.54464919603191,53.69978122438816,53.85337936186505,54.0054261888875,54.15590446181454,54.30479711489511,54.45208726220336,54.59775819955374,54.74179340639543,54.88417654768586,55.024891475743416,55.16392223207856,55.30125304920388,55.43686835242208,55.57075276159253,55.7028910928753,55.833268360453324,55.961869778231915,56.08868076151556,56.21368692866213,56.33687410271372,56.45822831300465,56.577735796745706,56.695383000585124,56.81115658214554,56.92504341153729,57.03703057284733,57.147105365604155,57.25525530621809,57.361468129397046,57.465731789537614,57.56803446209102,57.6683645449043,57.76671065953596,57.86306165254652,57.957406596763356,58.04973479251996,58.14003576886944,58.228299284771964,58.31451533025624,58.398674127554706,58.480766132212516,58.56078203416985,58.63871275881788,58.71454946802787,58.788283561153484,58.85990667600626,58.929410689803916,58.99678772009155,59.062030125635594,59.12513050729045,59.18608170883756,59.24487681779706,59.30150916621165,59.355972331402896,59.408260136699546,59.458366652138075,59.506286195135175,59.55201333113226,59.59554287421173,59.63686988768518,59.67598968465322,59.71289782853701,59.747590133581504,59.78006266533001,59.810311741070535,59.83833393025334,59.86412605488006,59.887685189864115,59.9090086633624,59.92809405707834,59.94493920653617,59.959542201326336,59.97190138532221,59.98201535686792,59.98988296893725,59.9955033292638,59.99887580044211,60,59.995941964063874,59.983769567127496,59.96348794108549,59.93510563669153,59.89863461995333,59.85409026708775,59.80149135803819,59.74086006855692,59.672221960855794,59.59560597282914,59.511044405853596,59.418572911169754,59.31823047485157,59.21005940136982,59.09410529575648,58.97041704437759,58.83904679432274,58.700049931419784,58.553485056884114,58.39941396261234,58.23790160513078,58.0690160782097,57.89282858415492,57.70941340378886,57.51884786513365,57.32121231080959,57.11659006416261,56.905067394135024,56.68673347889454,56.461680368236586,56.23000294477604,55.99179888394466,55.74716861281098,55.49621526774018,55.2390446509117,54.975765185712916,54.70648787102774,54.43132623443939,54.150396284367034,53.86381646115654,53.57170758714589,53.27419281572638,52.97139757942102,52.66344953700205,52.35047851966989,52.03261647631619,51.70999741789398,51.3827573609186,51.05103427012298,50.71496800029152,50.37470023729723,50.030374438366835,49.682135771598986,49.33013105476135,48.974508693392025,48.61541861823162,48.253012222012345,47.887442295630635,47.518862963730406,47.14742961972392,46.77329886027778,46.39662841929159,46.017577101397265,45.63630471500673,45.25297200493664,44.86774058463814,44.480772868060484,44.092232001177166,43.70228179320343,43.3110866475341,42.91881149243096,42.52562171148888,42.131683073909855,41.73716166461462,41.342223814221,40.947036028918816,40.55176492027073,40.156577134968565,39.76163928457494,39.3671178752797,38.97317923770069,38.57998945675862,38.1877143016555,37.796519155986175,37.40656894801245,37.018028081129145,36.6310603645515,36.24582894425302,35.862496234182956,35.48122384779244,35.10217252989814,34.72550208891199,34.35137132946586,33.9799379854594,33.61135865355921,33.245788727177526,32.883382330958284,32.52429225579791,32.16866989442862,31.81666517759102,31.468426510823214,31.12410071189285,30.783832948898613,30.447766679067193,30.11604358827161,29.78880353129628,29.46618447287412,29.148322429520462,28.835351412188366,28.527403369769445,28.22460813346413,27.92709336204468,27.634984488034082,27.348404664823647,27.067474714751352,26.79231307816306,26.52303576347794,26.259756298279214,26.002585681450796,25.751632336380062,25.507002065246446,25.26879800441513,25.037120580954653,24.812067470296764,24.593733555056346,24.382210885028837,24.17758863838192,23.979953084057932,23.789387545402796,23.605972365036806,23.429784870982104,23.260899344061094,23.099386986579606,22.945315892307914,22.798751017772314,22.65975415486943,22.528383904814664,22.404695653435855,22.28874154782259,22.18057047434092,22.08022803802281,21.987756543339046,21.903194976363583,21.82657898833702,21.757940880635964,21.697309591154777,21.6447106821053,21.6001663292398,21.563695312501682,21.535313008107803,21.515031382065875,21.502858985129574,21.498800949193537,21.50273104237818,21.5145205349053,21.53416706585279,21.561666700875776,21.597013932994514,21.640201683697214,21.691221304357512,21.75006257796646,21.81671372117851,21.891161386671243,21.973390665818222,22.063385091674576,22.16112664227456,22.266595744240632,22.379771276703096,22.50063057552974,22.629149437864434,22.765302126973914,22.909061377401777,23.06039840042849,23.21928288983657,23.385683027979596,23.559565492153865,23.74089546127152,23.929636622833684,24.12575118020225,24.329199860168934,24.539941920819956,24.75793515969493,24.983135922238105,25.21549911054052,25.454978192371144,25.70152521049524,25.955090792278142,26.215624159572414,26.483073138886517,26.757384171832875,27.038502325853315,27.326371305219638,27.620933462307228,27.922129809139335,28.229900029199825,28.544182489511925,28.86491425298066,29.192031090996377,29.525467496296955,29.86515669608608,30.21103066540489,30.56302014075441,30.921054633966104,31.285062446317426,31.654970682890134,32.03070526716784,32.412190955870315,32.799351354021574,33.192108930248274,33.59038503230602,33.994099902829916,34.40317269530652,34.81752149026387,35.237063311676394,35.66171414358138,36.09138894690372,36.52600167648558,36.965465298317426,37.40969180696719,37.85859224320393,38.312076711812466,38.77005439959551,39.23243359355956,39.69912169928106,40.17002525944899,40.645049972580324,41.124100711904525,41.60708154441325,42.093895750071596,42.584445841186884,43.07863358193124,43.57636000801391,44.07752544649951,44.5820295357682,45.08977124561375,45.600648897475416,46.11456018479984,46.63140219352854,47.151071422707076,47.67346380521188,48.198474728590305,48.72599905600997,49.25593114731304,49.78816488017146,50.32259367133851,50.85911049799289,51.39760791917066,51.937978097281075,52.480112819701574,53.02390352044836,53.56924130191716,54.1160169566908,54.664120989408694,55.213443638694,55.76387489913392,56.31530454330926,56.86762214386793,57.4207170956389,57.974478637781374,58.52879587596577,59.08355780458053,59.63865332896219,60.193971287642356,60.74940047460896,61.304829661575496,61.86014762025572,62.4152431446373,62.97000507325211,63.52432231143642,64.07808385357893,64.63117880534983,65.18349640590847,65.73492605008374,66.28535731052368,66.83467995980891,67.38278399252674,67.92955964730032,68.47489742876905,69.01868812951574,69.56082285193622,70.10119303004653,70.63969045122423,71.1762072778785,71.71063606904546,72.24286980190378,72.77280189320675,73.3003262206263,73.82533714400462,74.34772952650931,74.86739875568773,75.38424076441629,75.8981520517406,76.40902970360213,76.91677141344752,77.42127550271607,77.92244094120153,78.42016736728405,78.91435510802825,79.40490519914337,79.89171940480155,80.3747002373101,80.85375097663413,81.32877568976528,81.79967924993304,82.26636735565434,82.72874654961821,83.18672423740105,83.64020870600939,84.08910914224593,84.53333565089548,84.97279927272712,85.40741200230876,85.83708680563089,86.26173763753565,86.68127945894794,87.09562825390506,87.50470104638147,87.9084159169051,88.30669201896262,88.69944959518907,89.08660999334008,89.4680956820423,89.84383026631974,90.21373850289218,90.57774631524326,90.93578080845468,91.28777028380397,91.63364425312247,91.97333345291135,92.30676985821162,92.63388669622708,92.95461845969552,93.26890092000735,93.57667114006753,93.87786748689938,94.17242964398665,94.46029862335271,94.74141677737283,95.01572781031891,95.28317678963269,95.54371015692666,95.79727573870926,96.04382275683307,96.28330183866336,96.51566502696548,96.74086578950832,96.95885902838299,97.16960108903368,97.37304976900006,97.56916432636828,97.75790548793013,97.93923545704746,98.1131179212214,98.27951805936411,98.43840254877185,98.58973957179823,98.73349882222576,98.8696515113349,98.99817037366927,99.11902967249557,99.2322052049577,99.33767430692343,99.43541585752308,99.52541028337909,99.60763956252572,99.68208722801812,99.74873837122983,99.80757964483843,99.85859926549838,99.90178701620074,99.93713424831914,99.96463388334178,99.98428041428892,99.9960699068157,100,99.98762893923268,99.95052467578088,99.88871395976514,99.802241353291,99.69116919832216,99.55557757173545,99.39556422758973,99.21124452665073,99.00275135322224,98.77023501934391,98.51386315642463,98.23382059438947,97.9303092284276,97.60354787343705,97.25377210627119,96.88123409590094,96.48620242161485,96.06896187938837,95.62981327656158,95.16907321497386,94.68707386271146,94.18416271463266,93.66070234184322,93.11707013030271,92.55365800875006,91.97087216614472,91.36913275882677,90.74887360760758,90.11054188500896,89.45459779287646,88.78151423059941,88.09177645417658,87.38588172637347,86.66433895822334,85.92766834213059,85.17640097684077,84.41107848454777,83.63225262041425,82.84048487478663,82.03634606839168,81.22041594080636,80.39328273249762,79.55554276073367,78.70779998967211,77.85066559493526,76.98475752298647,76.11070004562467,75.22912330991915,74.34066288390837,73.44595929839048,72.54565758513615,71.6404068118564,70.73085961426051,69.81767172554206,68.90150150363132,67.98300945655586,67.06285776625062,66.14170981116148,65.2202296879861,64.29908173289698,63.37893004259175,62.4604379955163,61.5442677736056,60.63107988488716,59.72153268729131,58.81628191401157,57.915980200757296,57.021276615239444,56.13281618922871,55.251239453523254,54.37718197616151,53.51127390421277,52.65413950947602,51.80639673841452,50.968656766650646,50.141523558341994,49.325593430756754,48.521454624361915,47.72968687873439,46.950861014600974,46.18553852230808,45.434271157018365,44.69760054092573,43.97605777277572,43.27016304497273,42.580425268550044,41.90734170627312,41.25139761414075,40.61306589154225,39.9928067403232,39.391067333005424,38.808281490400205,38.244869368847716,37.701237157307354,37.17777678451807,36.67486563643942,36.192866284177185,35.73212622258964,35.29297761976302,34.8757370775367,34.480705403250795,34.10816739288073,33.758391625715035,33.431630270724646,33.128118904762964,32.848076342727985,32.591704479808875,32.359188145930744,32.15069497250244,31.966375271563628,31.806361927418102,31.670770300831578,31.55969814586293,31.473225539388977,31.411414823373427,31.374310559921824,31.361939499154687,31.364698832548015,31.372976001469812,31.386768512396316,31.40607221028924,31.43088127984751,31.46118824725912,31.496983982452658,31.538257701847755,31.584996971603683,31.637187711365094,31.694814198503764,31.75785907285508,31.826303341947863,31.900126386725894,31.97930596775948,32.06381823194515,32.15363771969149,32.248737372588906,32.349088541561066,32.45466099549554,32.565422930351005,32.68134097873832,32.80238021997255,32.928504190592946,33.05967489534768,33.19585281864004,33.336996936432605,33.483064728605896,33.634012191767695,33.7897938525092,33.950362781104026,34.115670605645974,34.28566752662118,34.4603023319104,34.63952241221682,34.82327377691479,35.01150107031464,35.204147588338806,35.401155295604084,35.60246484290498,35.808015585092846,36.017745599345446,36.23159170382138,36.449489476693834,36.67137327555787,36.89717625720536,37.1268303977618,37.36026651317866,37.597414280075306,37.83820225692419,38.082557905572756,38.3304076130959,38.581676713972,38.83628951257622,39.094169305984,39.355238407078105,39.61941816795209,39.88662900360326,40.15679041590787,40.429821017871504,40.70563855814707,40.98415994581346,41.26530127540669,41.54897785219697,41.835104217703076,42.12359417543708,42.41436081687125,42.70731654761963,43.00237311382601,43.29944162875077,43.598432599548275,43.89925595422682,44.20182106878327,44.50603679450358,44.81181148542192,45.11905302592909,45.42766885852278,45.73756601169074,46.04865112791879,46.36083049181504,46.674010058342006,46.98809548114791,47.30299214098887,47.61860517423324,47.934839501439555,48.251599855999615,48.56879081283771,48.88631681715785,49.2040822132299,49.5219912732062,49.83994822595986,50.157857285936146,50.47562268200819,50.79314868632832,51.110339643166405,51.427099997726444,51.74333432493274,52.058947358177086,52.37384401801802,52.68792944082389,53.00110900735083,53.31328837124705,53.62437348747505,53.934270640642964,54.2428864732366,54.55012801374372,54.85590270466201,55.16011843038227,55.462683544938635,55.76350689961714,56.06249787041457,56.359566385339264,56.65462295154557,56.947578682293866,57.23834532372796,57.526835281461864,57.8129616469679,58.09663822375808,58.377779553351246,58.656300941017506,58.932118481292996,59.20514908325652,59.47531049556103,59.742521331212096,60.00670109208597,60.26777019317996,60.52564998658761,60.780262785191724,61.0315318860677,61.27938159359073,61.523737242239164,61.764525219087915,62.00167298598444,62.235109101401164,62.46476324195747,62.690566223604826,62.91245002246871,63.13034779534102,63.344193899816815,63.55392391406925,63.759474656256984,63.960784203557715,64.15779191082284,64.35043842884686,64.53866572224655,64.72241708694435,64.90163716725061,65.07627197253967,65.2462688935147,65.41157671805648,65.57214564665114,65.72792730739248,65.87887477055409,66.02494256272722,66.1660866805196,66.30226460381178,66.43343530856635,66.55955927918656,66.6805985204206,66.79651656880773,66.90727850366301,67.0128509575973,67.11320212656928,67.2083017794665,67.29812126721265,67.38263353139813,67.46181311243153,67.53563615720937,67.60408042630195,67.66712530065308,67.72475178779155,67.77694252755278,67.82368179730851,67.8649555167034,67.90075125189675,67.93105821930817,67.95586728886623,67.97517098675897,67.98896349768526,67.99724066660687,68,67.99297206223508,67.97189323018631,67.93677844406085,67.88765259243796,67.82455049462834,67.7475168759951,67.65660633625336,67.55188331077125,67.43342202489941,67.3013064413619,67.15563020074518,66.99649655512773,66.82401829489736,66.63831766880777,66.43952629733151,66.22778507937016,66.00324409238846,65.76606248604261,65.51640836937864,65.25445869168041,64.9803991170519,64.69442389282264,64.39673571186948,64.08754556895246,63.76707261116634,63.435543982614085,63.093194663412106,62.74026730314166,62.37701204886415,62.00368636782251,61.62055486495412,61.22788909534473,60.82596737175623,60.41507456736478,59.995501913849054,59.567546794971676,59.131512535800205,58.68770818771715,58.236448309371156,57.77805274372485,57.31284639135728,56.84115898018162,56.3633248317413,55.87968262425042,55.390575152546106,54.896349085123184,54.397354718423216,53.893945728552254,53.38647892060304,52.875313975759454,52.36081319636259,51.84334124911882,51.323264906632204,50.80095278744421,50.276775094765085,49.751103354082076,49.2243101498304,48.696768861313714,48.168853398061174,47.64093793480862,47.113396646291946,46.58660344204028,46.060931701357276,45.53675400867816,45.014441889490186,44.49436554700359,43.97689359975983,43.46239282036299,42.95122787551945,42.44376106757025,41.94035207769933,41.441357710999405,40.94713164357651,40.45802417187224,39.97438196438141,39.496547815941135,39.02486040476551,38.559654052398,38.101258486751746,37.64999860840581,37.20619426032282,36.77016000115141,36.34220488227408,35.92263222875843,35.511739424367065,35.10981770077863,34.717151931169305,34.33402042830099,33.960694747259424,33.597439492982,33.244512132711634,32.90216281350974,32.57063418495756,32.25016122717153,31.9409710842546,31.64328290330154,31.357307679072363,31.08324810444395,30.821298426745813,30.571644310081933,30.334462703736182,30.10992171675457,29.898180498793334,29.699389127317176,29.513688501227698,29.341210240997416,29.182076595380074,29.036400354763455,28.90428477122606,28.785823485354335,28.68110045987231,28.590189920130694,28.51315630149756,28.45005420368805,28.400928352065257,28.36581356593992,28.34473473389124,28.33770679612644,28.348843761421897,28.38224773416936,28.437897949256886,28.515759812507454,28.61578492218397,28.73791109907753,28.882062425160207,29.04814929077851,29.23606845035792,29.445703086584054,29.676922883020524,29.929584105118344,30.20352968956645,30.498589341927968,30.814579642501315,31.151304160340537,31.508553575363784,31.886105808474298,32.28372615961272,32.70116745365509,33.13817019406582,33.5944627242101,34.0697613962254,34.56377074734722,35.07618368357937,35.606681670594654,36.15493493174729,36.720602653073925,37.30333319515586,37.90276431171078,38.51852337477812,39.15022760635793,39.797484316359565,40.45989114671187,41.13703632148357,41.82849890285789,42.53384905280268,43.252648300273364,43.984449813782064,44.728798679164306,45.485232182370076,46.253280097103385,47.032464977131966,47.822302453085,48.62230153355456,49.43196491031361,50.250789267460576,51.07826559429868,51.913879501755424,52.75711154214517,53.607437532076595,54.46432887830408,55.32725290632009,56.19567319148495,57.0690498924877,57.946840086930806,58.82849810883047,59.713475887822,60.60122328986017,61.4911884592025,62.38281816146238,63.2755581275197,64.16885339807435,65.06214866862896,65.95488863468626,66.8465183369461,67.73648350628835,68.6242309083265,69.50920868731795,70.39086670921753,71.26865690366057,72.14203360466317,73.01045388982789,73.87337791784375,74.73026926407105,75.58059525400235,76.42382729439191,77.25944120184843,78.08691752868636,78.9057418858331,79.71540526259189,80.51540434306125,81.305241819014,82.08442669904231,82.85247461377533,83.60890811698079,84.35325698236275,85.08505849587112,85.80385774334148,86.50920789328596,87.2006704746599,87.87781564943123,88.54022247978318,89.18747918978441,89.81918342136386,90.43494248443078,91.03437360098528,91.61710414306683,92.182771864393,92.73102512554522,93.26152311256007,93.77393604879174,94.26794539991309,94.74324407192793,95.19953660207172,95.636539342482,96.05398063652386,96.45160098766178,96.82915322077181,97.18640263579454,97.52312715363324,97.83911745420608,98.13417710656707,98.40812269101465,98.66078391311194,98.89200370954788,99.10163834577347,99.28955750535233,99.4556443709701,99.59979569705223,99.72192187394523,99.82194698362119,99.89980884687121,99.95545906195818,99.9888630347051];
			sleepState = [100,99.99894563,99.99578258,99.99051102,99.98313125,99.9736437,99.96204888,99.94834745,99.93254019,99.91462797,99.89461182,99.87249285,99.8482723,99.82195154,99.79353206,99.76301543,99.73040339,99.69569776,99.6589005,99.62001367,99.57903946,99.53598018,99.49083824,99.44361618,99.39431666,99.34294245,99.28949643,99.23398162,99.17640113,99.11675819,99.05505617,98.99129853,98.92548886,98.85763085,98.78772831,98.71578519,98.64180552,98.56579346,98.48775329,98.4076894,98.32560627,98.24150854,98.15540092,98.06728825,97.9771755,97.88506772,97.7909701,97.69488792,97.59682659,97.49679162,97.39478863,97.29082335,97.18490163,97.07702944,96.96721282,96.85545795,96.74177112,96.62615872,96.50862724,96.3891833,96.26783361,96.14458499,96.01944436,95.89241878,95.76351536,95.63274137,95.50010415,95.36561117,95.22926997,95.09108823,94.95107372,94.8092343,94.66557795,94.52011274,94.37284686,94.22378858,94.07294628,93.92032844,93.76594364,93.60980056,93.45190798,93.29227478,93.13090992,92.96782248,92.80302163,92.63651664,92.46831685,92.29843174,92.12687085,91.95364382,91.77876039,91.6022304,91.42406376,91.2442705,91.06286072,90.87984462,90.69523249,90.50903471,90.32126174,90.13192414,89.94103256,89.74859772,89.55463045,89.35914165,89.1621423,88.96364349,88.76365637,88.56219218,88.35926226,88.154878,87.9490509,87.74179254,87.53311455,87.32302868,87.11154673,86.89868059,86.68444223,86.46884369,86.2518971,86.03361465,85.8140086,85.59309131,85.3708752,85.14737276,84.92259655,84.6965592,84.46927344,84.24075202,84.01100781,83.78005371,83.54790271,83.31456786,83.08006228,82.84439916,82.60759173,82.36965331,82.13059728,81.89043708,81.6491862,81.40685822,81.16346675,80.91902548,80.67354815,80.42704855,80.17954055,79.93103807,79.68155506,79.43110556,79.17970364,78.92736344,78.67409915,78.419925,78.16485528,77.90890433,77.65208654,77.39441635,77.13590824,76.87657674,76.61643644,76.35550196,76.09378796,75.83130917,75.56808033,75.30411624,75.03943175,74.77404173,74.50796111,74.24120483,73.97378791,73.70572536,73.43703227,73.16772373,72.89781488,72.62732091,72.35625701,72.08463842,71.81248042,71.5397983,71.26660739,70.99292306,70.71876068,70.44413567,70.16906347,69.89355955,69.61763938,69.34131848,69.06461239,68.78753666,68.51010687,68.23233861,67.9542475,67.67584918,67.39715929,67.11819349,66.83896749,66.55949696,66.27979763,65.99988521,65.71977544,65.43948407,65.15902686,64.87841957,64.59767798,64.31681787,64.03585502,63.75480524,63.47368433,63.19250808,62.91129231,62.63005282,62.34880543,62.06756594,61.78635017,61.50517392,61.22405301,60.94300323,60.66204039,60.38118027,60.10043868,59.81983139,59.53937418,59.25908281,58.97897305,58.69906063,58.41936129,58.13989077,57.86066476,57.58169897,57.30300908,57.02461075,56.74651964,56.46875138,56.19132159,55.91424586,55.63753977,55.36121888,55.08529871,54.80979478,54.53472258,54.26009757,53.98593519,53.71225086,53.43905995,53.16637784,52.89421983,52.62260125,52.35153735,52.08104337,51.81113453,51.54182599,51.27313289,51.00507035,50.73765342,50.47089714,50.20481652,49.9394265,49.67474201,49.41077792,49.14754908,48.88507029,48.62335629,48.36242181,48.10228151,47.84295001,47.5844419,47.32677171,47.06995392,46.81400297,46.55893325,46.3047591,46.05149481,45.79915461,45.54775269,45.29730319,45.04782019,44.7993177,44.5518097,44.30531011,44.05983277,43.8153915,43.57200003,43.32967205,43.08842118,42.84826097,42.60920495,42.37126653,42.1344591,41.89879597,41.66429039,41.43095554,41.19880454,40.96785045,40.73810623,40.50958482,40.28229905,40.05626171,39.8314855,39.60798305,39.38576694,39.16484965,38.94524361,38.72696115,38.51001456,38.29441602,38.08017766,37.86731153,37.65582958,37.4457437,37.23706572,37.02980735,36.82398025,36.619596,36.41666607,36.21520189,36.01521477,35.81671595,35.61971661,35.4242278,35.23026053,35.03782569,34.84693411,34.65759651,34.46982354,34.28362576,34.09901363,33.91599753,33.73458775,33.55479449,33.37662786,33.20009786,33.02521444,32.85198741,32.68042651,32.5105414,32.34234162,32.17583662,32.01103577,31.84794833,31.68658348,31.52695027,31.36905769,31.21291461,31.05852982,30.90591198,30.75506968,30.6060114,30.45874551,30.31328031,30.16962396,30.02778454,29.88777002,29.74958828,29.61324709,29.4787541,29.34611688,29.21534289,29.08643948,28.95941389,28.83427327,28.71102464,28.58967495,28.47023101,28.35269953,28.23708713,28.1234003,28.01164544,27.90182882,27.79395662,27.6880349,27.58406963,27.48206664,27.38203166,27.28397033,27.18788815,27.09379053,27.00168275,26.91157,26.82345734,26.73734972,26.65325198,26.57116886,26.49110496,26.41306479,26.33705273,26.26307306,26.19112994,26.12122741,26.0533694,25.98755972,25.92380208,25.86210006,25.80245713,25.74487663,25.68936182,25.6359158,25.58454159,25.53524207,25.48802001,25.44287807,25.39981879,25.35884458,25.31995775,25.28316049,25.24845486,25.21584282,25.1853262,25.15690671,25.13058595,25.10636541,25.08424643,25.06423028,25.04631807,25.0305108,25.01680938,25.00521456,24.995727,24.98834723,24.98307568,24.97991262,24.97885825,24.98382148,24.99870883,25.02351332,25.05822331,25.10282249,25.15728994,25.22160009,25.29572274,25.37962312,25.47326183,25.57659492,25.68957389,25.81214569,25.94425281,26.08583321,26.23682046,26.39714367,26.56672758,26.74549259,26.9333548,27.13022601,27.33601382,27.55062162,27.77394868,28.00589017,28.24633722,28.49517695,28.75229256,29.01756337,29.29086484,29.57206869,29.86104293,30.15765191,30.46175639,30.77321364,31.09187745,31.41759824,31.75022311,32.08959593,32.4355574,32.78794511,33.14659367,33.51133472,33.88199704,34.25840664,34.64038685,35.02775835,35.42033931,35.81794546,36.22039014,36.62748447,37.03903733,37.45485556,37.87474396,38.29850543,38.72594107,39.15685022,39.59103062,40.02827847,40.46838851,40.91115416,41.35636758,41.80381979,42.25330075,42.70459948,43.15750412,43.6118021,44.06728014,44.52372447,44.98092081,45.43865456,45.89671085,46.35487468,46.81293097,47.27066472,47.72786106,48.18430538,48.63978343,49.0940814,49.54698605,49.99828477,50.44776573,50.89521794,51.34043137,51.78319702,52.22330706,52.66055491,53.09473531,53.52564446,53.95308009,54.37684157,54.79672997,55.21254819,55.62410106,56.03119538,56.43364007,56.83124621,57.22382718,57.61119868,57.99317888,58.36958849,58.74025081,59.10499185,59.46364041,59.81602813,60.1619896,60.50136242,60.83398729,61.15970808,61.47837189,61.78982913,62.09393362,62.39054259,62.67951683,62.96072069,63.23402216,63.49929296,63.75640858,64.00524831,64.24569535,64.47763684,64.7009639,64.91557171,65.12135951,65.31823073,65.50609293,65.68485795,65.85444186,66.01476507,66.16575231,66.30733272,66.43943983,66.56201164,66.67499061,66.7783237,66.87196241,66.95586278,67.02998544,67.09429559,67.14876304,67.19336222,67.2280722,67.25287669,67.26776405,67.27272727,67.27070428,67.26463571,67.25452289,67.24036795,67.22217393,67.1999447,67.17368502,67.1434005,67.10909759,67.07078362,67.02846677,66.98215608,66.93186143,66.87759357,66.81936407,66.75718538,66.69107076,66.62103434,66.54709106,66.46925672,66.38754794,66.30198215,66.21257762,66.11935346,66.02232955,65.92152662,65.81696618,65.70867057,65.59666291,65.4809671,65.36160785,65.23861065,65.11200175,64.98180819,64.84805777,64.71077904,64.57000131,64.42575464,64.27806983,64.12697841,63.97251264,63.8147055,63.65359068,63.48920258,63.3215763,63.15074763,62.97675304,62.79962968,62.61941537,62.43614859,62.24986847,62.06061477,61.86842791,61.67334891,61.47541944,61.27468174,61.07117868,60.86495371,60.65605086,60.44451474,60.23039049,60.01372385,59.79456108,59.57294896,59.34893481,59.12256647,58.89389226,58.662961,58.42982201,58.19452506,57.95712039,57.71765868,57.47619106,57.2327691,56.98744475,56.74027041,56.49129884,56.2405832,55.98817702,55.73413419,55.47850895,55.22135589,54.9627299,54.7026862,54.44128032,54.17856807,53.91460553,53.64944907,53.3831553,53.11578108,52.84738349,52.57801984,52.30774764,52.03662459,51.76470859,51.49205768,51.21873008,50.94478416,50.67027839,50.39527139,50.11982188,49.84398866,49.56783063,49.29140675,49.01477604,48.73799756,48.4611304,48.18423369,47.90736654,47.63058806,47.35395735,47.07753347,46.80137544,46.52554222,46.2500927,45.9750857,45.70057994,45.42663401,45.15330641,44.88065551,44.6087395,44.33761645,44.06734425,43.7979806,43.52958301,43.26220879,42.99591502,42.73075856,42.46679603,42.20408377,41.94267789,41.6826342,41.42400821,41.16685514,40.91122991,40.65718708,40.4047809,40.15406526,39.90509369,39.65791934,39.412595,39.16917303,38.92770542,38.68824371,38.45083903,38.21554208,37.98240309,37.75147184,37.52279763,37.29642928,37.07241514,36.85080302,36.63164024,36.4149736,36.20084936,35.98931323,35.78041038,35.57418541,35.37068235,35.16994466,34.97201518,34.77693619,34.58474933,34.39549563,34.2092155,34.02594872,33.84573441,33.66861106,33.49461647,33.3237878,33.15616151,32.99177342,32.83065859,32.67285145,32.51838568,32.36729426,32.21960945,32.07536278,31.93458505,31.79730632,31.6635559,31.53336234,31.40675345,31.28375624,31.164397,31.04870119,30.93669352,30.82839791,30.72383748,30.62303454,30.52601064,30.43278647,30.34338195,30.25781616,30.17610737,30.09827303,30.02432975,29.95429333,29.88817872,29.82600002,29.76777053,29.71350266,29.66320802,29.61689733,29.57458048,29.53626651,29.5019636,29.47167907,29.44541939,29.42319017,29.40499614,29.39084121,29.38072838,29.37465982,29.37263682,29.38237305,29.41157172,29.46020284,29.52821643,29.61554261,29.72209163,29.84775402,29.99240065,30.15588288,30.33803272,30.53866301,30.75756757,30.99452149,31.24928125,31.52158509,31.8111532,32.11768801,32.44087456,32.78038073,33.13585767,33.5069401,33.8932467,34.29438052,34.70992937,35.13946625,35.58254977,36.03872464,36.5075221,36.98846044,37.48104546,37.984771,38.49911943,39.02356224,39.55756053,40.10056557,40.65201939,41.21135533,41.77799865,42.35136706,42.93087141,43.51591621,44.10590028,44.70021739,45.29825682,45.89940405,46.50304136,47.10854848,47.7153032,48.32268205,48.93006089,49.53681561,50.14232273,50.74596004,51.34710728,51.94514671,52.53946381,53.12944788,53.71449268,54.29399703,54.86736545,55.43400876,55.99334471,56.54479853,57.08780357,57.62180185,58.14624466,58.6605931,59.16431863,59.65690365,60.13784199,60.60663945,61.06281432,61.50589784,61.93543472,62.35098357,62.7521174,63.138424,63.50950643,63.86498336,64.20448954,64.52767608,64.8342109,65.123779,65.39608284,65.65084261,65.88779652,66.10670109,66.30733137,66.48948122,66.65296345,66.79761007,66.92327246,67.02982149,67.11714766,67.18516125,67.23379237,67.26299105,67.27272727,67.2708128,67.26506976,67.25549927,67.24210319,67.22488414,67.20384547,67.17899129,67.15032644,67.1178565,67.08158782,67.04152746,66.99768322,66.95006366,66.89867807,66.84353645,66.78464955,66.72202887,66.6556866,66.58563569,66.51188978,66.43446325,66.3533712,66.26862944,66.18025448,66.08826356,65.99267461,65.89350627,65.79077786,65.68450942,65.57472166,65.46143599,65.34467449,65.22445992,65.10081573,64.97376601,64.84333553,64.70954973,64.57243467,64.4320171,64.28832439,64.14138455,63.99122623,63.8378787,63.68137186,63.52173622,63.35900289,63.19320362,63.0243707,62.85253707,62.67773623,62.50000224,62.31936976,62.135874,61.94955074,61.7604363,61.56856755,61.37398189,61.17671726,60.97681211,60.77430543,60.56923668,60.36164584,60.1515734,59.93906029,59.72414795,59.50687827,59.28729363,59.06543681,58.84135108,58.61508012,58.38666804,58.15615937,57.92359905,57.68903242,57.4525052,57.21406351,56.97375384,56.73162303,56.48771828,56.24208715,55.99477752,55.74583761,55.49531594,55.24326136,54.989723,54.7347503,54.47839296,54.22070095,53.96172452,53.70151415,53.44012057,53.17759474,52.91398785,52.64935127,52.38373661,52.11719564,51.84978033,51.58154281,51.31253537,51.04281046,50.77242067,50.50141869,50.22985738,49.95778966,49.68526857,49.41234726,49.13907892,48.86551682,48.5917143,48.31772475,48.04360156,47.76939818,47.49516808,47.2209647,46.94684151,46.67285195,46.39904944,46.12548734,45.852219,45.57929769,45.3067766,45.03470888,44.76314757,44.49214559,44.2217558,43.95203089,43.68302345,43.41478593,43.14737062,42.88082965,42.61521499,42.35057841,42.08697152,41.82444569,41.56305211,41.30284174,41.04386531,40.7861733,40.52981596,40.27484326,40.0213049,39.76925032,39.51872865,39.26978874,39.02247911,38.77684798,38.53294323,38.29081242,38.05050274,37.81206106,37.57553384,37.34096721,37.10840689,36.87789822,36.64948614,36.42321518,36.19912945,35.97727263,35.75768799,35.54041831,35.32550597,35.11299286,34.90292042,34.69532958,34.49026083,34.28775415,34.087849,33.89058437,33.69599871,33.50412996,33.31501552,33.12869226,32.9451965,32.76456402,32.58683003,32.41202919,32.24019556,32.07136264,31.90556337,31.74283004,31.5831944,31.42668756,31.27334003,31.12318171,30.97624187,30.83254916,30.69213159,30.55501653,30.42123073,30.29080025,30.16375053,30.04010633,29.91989177,29.80313027,29.6898446,29.58005684,29.4737884,29.37105999,29.27189165,29.1763027,29.08431178,28.99593682,28.91119506,28.83010301,28.75267648,28.67893057,28.60887966,28.54253739,28.47991671,28.42102981,28.36588819,28.3145026,28.26688304,28.2230388,28.18297844,28.14670976,28.11423982,28.08557497,28.06072079,28.03968212,28.02246307,28.00906699,27.9994965,27.99375346,27.99183899,28.35830861,29.45025723,31.2454559,33.70735957,36.78585098,40.41826091,44.53064398,49.03928392,53.85239784,58.8720046,63.99591949,69.11983439,74.13944115,78.95255507,83.46119501,87.57357808,91.20598801,94.28447942,96.74638309,98.54158176,99.63353037,100,99.99582262,99.98329136,99.96240894,99.93317986,99.8956104,99.84970867,99.79548457,99.73294977,99.66211775,99.58300378,99.49562491,99.39999997,99.29614956,99.18409607,99.06386365,98.9354782,98.7989674,98.65436066,98.50168915,98.34098577,98.17228516,97.99562366,97.81103936,97.61857203,97.41826314,97.21015588,96.99429508,96.77072726,96.53950062,96.30066497,96.05427179,95.80037419,95.53902687,95.27028615,94.99420997,94.7108578,94.42029072,94.12257135,93.81776384,93.5059339,93.1871487,92.86147697,92.52898888,92.18975609,91.84385171,91.49135027,91.13232776,90.76686153,90.39503035,90.01691436,89.63259504,89.24215522,88.84567903,88.44325193,88.03496064,87.62089314,87.20113868,86.77578771,86.34493191,85.90866412,85.46707836,85.02026981,84.56833474,84.11137056,83.64947575,83.18274985,82.71129343,82.23520812,81.75459649,81.26956214,80.78020959,80.2866443,79.78897263,79.28730185,78.78174006,78.27239621,77.75938008,77.24280223,76.72277398,76.19940739,75.67281527,75.1431111,74.61040902,74.07482385,73.53647101,72.99546652,72.45192696,71.90596948,71.35771173,70.80727188,70.25476853,69.70032076,69.14404807,68.58607032,68.02650778,67.46548103,66.90311097,66.33951881,65.774826,65.20915423,64.64262542,64.07536166,63.50748519,62.9391184,62.37038378,61.80140389,61.23230135,60.66319881,60.09421893,59.5254843,58.95711751,58.38924104,57.82197728,57.25544847,56.6897767,56.12508389,55.56149173,54.99912167,54.43809492,53.87853238,53.32055463,52.76428194,52.20983417,51.65733083,51.10689097,50.55863322,50.01267574,49.46913618,48.92813169,48.38977885,47.85419368,47.32149161,46.79178743,46.26519531,45.74182873,45.22180047,44.70522262,44.19220649,43.68286264,43.17730085,42.67563007,42.1779584,41.68439311,41.19504056,40.71000621,40.22939458,39.75330927,39.28185285,38.81512695,38.35323214,37.89626796,37.44433289,36.99752434,36.55593858,36.11967079,35.68881499,35.26346402,34.84370956,34.42964206,34.02135077,33.61892367,33.22244748,32.83200766,32.44768834,32.06957235,31.69774117,31.33227495,30.97325243,30.62075099,30.27484661,29.93561382,29.60312573,29.277454,28.95866881,28.64683886,28.34203135,28.04431198,27.7537449,27.47039274,27.19431655,26.92557584,26.66422851,26.41033091,26.16393773,25.92510208,25.69387544,25.47030762,25.25444682,25.04633956,24.84603068,24.65356334,24.46897904,24.29231754,24.12361693,23.96291355,23.81024204,23.6656353,23.5291245,23.40073905,23.28050663,23.16845314,23.06460274,22.96897779,22.88159892,22.80248495,22.73165294,22.66911814,22.61489403,22.5689923,22.53142285,22.50219376,22.48131134,22.46878009,22.4646027,22.47837479,22.51967086,22.58843029,22.68455218,22.80789544,22.95827906,23.13548233,23.33924517,23.56926854,23.82521485,24.10670846,24.41333624,24.74464817,25.100158,25.47934398,25.88164959,26.3064844,26.75322491,27.22121546,27.70976921,28.21816914,28.74566911,29.29149493,29.85484552,30.43489411,31.03078938,31.64165677,32.26659976,32.90470115,33.55502444,34.2166152,34.88850244,35.56970008,36.25920837,36.95601536,37.65909839,38.36742559,39.07995738,39.79564804,40.51344719,41.23230135,41.95115551,42.66895466,43.38464532,44.09717712,44.80550431,45.50858734,46.20539433,46.89490262,47.57610026,48.2479875,48.90957826,49.55990155,50.19800294,50.82294593,51.43381332,52.02970859,52.60975718,53.17310778,53.7189336,54.24643356,54.75483349,55.24338724,55.71137779,56.1581183,56.58295311,56.98525872,57.3644447,57.71995454,58.05126646,58.35789424,58.63938785,58.89533416,59.12535753,59.32912037,59.50632364,59.65670726,59.78005053,59.87617241,59.94493184,59.98622791,60,59.99657576,59.98630426,59.96918919,59.94523667,59.91445529,59.87685606,59.83245245,59.78126037,59.72329815,59.65858655,59.58714875,59.50901033,59.42419928,59.33274597,59.23468317,59.13004598,59.01887189,58.90120071,58.77707459,58.64653799,58.50963765,58.36642262,58.21694417,58.06125585,57.89941343,57.73147485,57.55750028,57.37755201,57.19169451,56.99999433,56.80252014,56.59934266,56.39053466,56.17617092,55.95632823,55.73108531,55.50052284,55.2647234,55.02377144,54.77775326,54.52675697,54.27087246,54.01019139,53.74480711,53.47481468,53.20031079,52.92139376,52.63816349,52.35072141,52.05917047,51.76361509,51.46416114,51.16091585,50.85398784,50.54348704,50.22952464,49.91221311,49.59166609,49.26799837,48.94132589,48.61176565,48.27943567,47.94445499,47.60694357,47.26702231,46.92481293,46.58043802,46.2340209,45.88568565,45.53555702,45.18376043,44.83042185,44.47566785,44.11962548,43.76242226,43.40418612,43.04504537,42.68512863,42.32456481,41.96348305,41.60201267,41.24028314,40.878424,40.51656486,40.15483532,39.79336495,39.43228319,39.07171937,38.71180263,38.35266188,37.99442574,37.63722251,37.28118014,36.92642614,36.57308757,36.22129097,35.87116235,35.5228271,35.17640998,34.83203506,34.48982569,34.14990442,33.81239301,33.47741232,33.14508235,32.8155221,32.48884962,32.16518191,31.84463488,31.52732335,31.21336096,30.90286015,30.59593215,30.29268686,29.9932329,29.69767753,29.40612659,29.11868451,28.83545423,28.5565372,28.28203332,28.01204088,27.74665661,27.48597553,27.23009103,26.97909473,26.73307655,26.49212459,26.25632515,26.02576268,25.80051977,25.58067707,25.36631334,25.15750533,24.95432785,24.75685366,24.56515348,24.37929598,24.19934772,24.02537315,23.85743457,23.69559214,23.53990382,23.39042538,23.24721034,23.11031001,22.9797734,22.85564728,22.73797611,22.62680202,22.52216483,22.42410202,22.33264872,22.24783767,22.16969925,22.09826145,22.03354985,21.97558763,21.92439555,21.87999194,21.84239271,21.81161132,21.7876588,21.77054373,21.76027224,21.756848,21.7735482,21.82362432,21.90700284,22.0235614,22.17312894,22.35548595,22.57036479,22.81745009,23.09637923,23.40674284,23.74808541,24.11990598,24.52165886,24.9527544,25.41255993,25.90040061,26.41556047,26.95728345,27.52477448,28.1172007,28.73369264,29.37334551,30.03522054,30.71834632,31.42172029,32.14431014,32.88505537,33.64286884,34.41663835,35.20522828,36.00748128,36.82221992,37.64824846,38.4843546,39.32931123,40.18187826,41.04080444,41.90482916,42.77268436,43.64309633,44.51478763,45.38647894,46.25689091,47.12474611,47.98877083,48.847697,49.70026404,50.54522067,51.3813268,52.20735535,53.02209399,53.82434699,54.61293692,55.38670643,56.1445199,56.88526513,57.60785498,58.31122894,58.99435473,59.65622976,60.29588263,60.91237457,61.50480079,62.07229182,62.61401479,63.12917466,63.61701534,64.07682087,64.50791641,64.90966929,65.28148986,65.62283243,65.93319604,66.21212518,66.45921048,66.67408932,66.85644632,67.00601386,67.12257243,67.20595095,67.25602707,67.27272727,67.27140981,67.26745763,67.26087132,67.25165185,67.23980062,67.22531939,67.20821032,67.18847598,67.1661193,67.14114364,67.11355272,67.08335066,67.05054198,67.01513158,66.97712476,66.93652719,66.89334493,66.84758445,66.79925257,66.74835652,66.69490391,66.63890272,66.58036133,66.51928847,66.45569328,66.38958525,66.32097427,66.24987058,66.17628482,66.10022798,66.02171142,65.94074688,65.85734645,65.7715226,65.68328815,65.59265628,65.49964054,65.40425483,65.3065134,65.20643085,65.10402214,64.99930258,64.89228781,64.78299382,64.67143694,64.55763385,64.44160154,64.32335736,64.20291897,64.08030438,63.9555319,63.82862018,63.69958818,63.56845518,63.43524078,63.29996489,63.16264771,63.02330977,62.88197188,62.73865517,62.59338106,62.44617124,62.29704772,62.14603278,61.99314898,61.83841918,61.68186648,61.52351429,61.36338627,61.20150634,61.03789869,60.87258778,60.70559829,60.53695519,60.36668368,60.19480919,60.02135742,59.84635427,59.6698259,59.49179868,59.31229923,59.13135436,58.9489911,58.76523672,58.58011866,58.39366459,58.20590236,58.01686005,57.82656589,57.63504831,57.44233595,57.24845758,57.05344219,56.85731892,56.66011706,56.4618661,56.26259564,56.06233547,55.86111552,55.65896584,55.45591665,55.25199829,55.04724122,54.84167605,54.63533349,54.42824438,54.22043965,54.01195037,53.80280767,53.59304283,53.38268717,53.17177214,52.96032924,52.74839008,52.53598633,52.32314972,52.10991205,51.89630519,51.68236106,51.46811163,51.25358891,51.03882495,50.82385186,50.60870174,50.39340676,50.17799908,49.96251088,49.74697438,49.53142177,49.31588526,49.10039707,48.88498938,48.6696944,48.45454429,48.23957119,48.02480724,47.81028452,47.59603508,47.38209095,47.1684841,46.95524643,46.74240982,46.53000606,46.3180669,46.10662401,45.89570897,45.68535332,45.47558847,45.26644578,45.05795649,44.85015177,44.64306265,44.43672009,44.23115492,44.02639786,43.82247949,43.6194303,43.41728063,43.21606067,43.0158005,42.81653005,42.61827908,42.42107723,42.22495395,42.02993856,41.8360602,41.64334783,41.45183026,41.2615361,41.07249378,40.88473156,40.69827749,40.51315943,40.32940504,40.14704179,39.96609692,39.78659746,39.60857025,39.43204188,39.25703873,39.08358695,38.91171247,38.74144095,38.57279785,38.40580837,38.24049745,38.0768898,37.91500987,37.75488185,37.59652966,37.43997697,37.28524716,37.13236337,36.98134843,36.83222491,36.68501509,36.53974097,36.39642426,36.25508638,36.11574844,35.97843126,35.84315536,35.70994096,35.57880797,35.44977597,35.32286424,35.19809176,35.07547717,34.95503879,34.83679461,34.7207623,34.60695921,34.49540233,34.38610834,34.27909357,34.174374,34.0719653,33.97188275,33.87414132,33.77875561,33.68573987,33.595108,33.50687355,33.42104969,33.33764927,33.25668472,33.17816816,33.10211132,33.02852556,32.95742188,32.8888109,32.82270287,32.75910768,32.69803482,32.63949342,32.58349223,32.53003962,32.47914358,32.4308117,32.38505121,32.34186896,32.30127139,32.26326456,32.22785416,32.19504549,32.16484343,32.13725251,32.11227684,32.08992017,32.07018582,32.05307675,32.03859552,32.02674429,32.01752483,32.01093851,32.00698633,32.00566887,32.65891488,34.59354901,37.73522437,41.96320813,47.11502124,52.99268243,59.37031646,66.00283444,72.63535241,79.01298644,84.89064763,90.04246075,94.27044451,97.41211986,99.346754,100];
			var fakeRem = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,60.42731930066195,60.482908238571625,60.535695802392524,60.58567422560381,60.632836154987466,60.677174651710146,60.718683192344116,60.757355669826964,60.79318639436019,60.82617009424627,60.85630191666432,60.88357742838406,60.907992616418035,60.92954388861211,60.94822807417391,60.96404242413935,60.97698461177712,60.98705273293095,60.9942453062998,60.998561273655824,61,60.969879814919985,60.87961402892559,60.72948665157468,60.51997003913819,60.25172340839251,59.92559076247967,59.54259823536117,59.10395086322091,58.611028792975546,58.06538293982166,57.46873010748281,56.82294758650983,56.130067247630194,55.392269148731074,54.611874675590606,53.79133923793944,52.933244543833304,52.040290476644316,51.11528660022903,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,60.21025644024444,60.28677457511918,60.3594647293289,60.42831180711881,60.49330151083588,60.55442034389807,60.61165561359718,60.66499543373479,60.714428727090706,60.75994522772337,60.80153548310185,60.83919085606884,60.87290352663436,60.90266649359982,60.928473576011854,60.95031941444606,60.96819947211993,60.982110035835035,60.992048216748174,60.99801195097126,61,60.98308519493533,60.93236893276503,60.84793562570235,60.72992580465422,60.578535885321514,60.394017841284395,60.17667878461724,59.92688045473085,59.64503861629295,59.331622367228874,58.987153357954405,58.61220492314011,58.207401127452414,57.77341572685946,57.31097104723089,56.82083678209768,56.30382871157318,55.7608073445677,55.192676486556294,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,59.55201333113226,59.59554287421173,59.63686988768518,59.67598968465322,59.71289782853701,59.747590133581504,59.78006266533001,59.810311741070535,59.83833393025334,59.86412605488006,59.887685189864115,59.9090086633624,59.92809405707834,59.94493920653617,59.959542201326336,59.97190138532221,59.98201535686792,59.98988296893725,59.9955033292638,59.99887580044211,60,59.995941964063874,59.983769567127496,59.96348794108549,59.93510563669153,59.89863461995333,59.85409026708775,59.80149135803819,59.74086006855692,59.672221960855794,59.59560597282914,59.511044405853596,59.418572911169754,59.31823047485157,59.21005940136982,59.09410529575648,58.97041704437759,58.83904679432274,58.700049931419784,58.553485056884114,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,61.304829661575496,61.86014762025572,62.4152431446373,62.97000507325211,63.52432231143642,64.07808385357893,64.63117880534983,65.18349640590847,65.73492605008374,66.28535731052368,66.83467995980891,67.38278399252674,67.92955964730032,68.47489742876905,69.01868812951574,69.56082285193622,70.10119303004653,70.63969045122423,71.1762072778785,71.71063606904546,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
			fakeRem = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,65.31823073,65.50609293,65.68485795,65.85444186,66.01476507,66.16575231,66.30733272,66.43943983,66.56201164,66.67499061,66.7783237,66.87196241,66.95586278,67.02998544,67.09429559,67.14876304,67.19336222,67.2280722,67.25287669,67.26776405,67.27272727,67.27070428,67.26463571,67.25452289,67.24036795,67.22217393,67.1999447,67.17368502,67.1434005,67.10909759,67.07078362,67.02846677,66.98215608,66.93186143,66.87759357,66.81936407,66.75718538,66.69107076,66.62103434,66.54709106,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,63.50950643,63.86498336,64.20448954,64.52767608,64.8342109,65.123779,65.39608284,65.65084261,65.88779652,66.10670109,66.30733137,66.48948122,66.65296345,66.79761007,66.92327246,67.02982149,67.11714766,67.18516125,67.23379237,67.26299105,67.27272727,67.2708128,67.26506976,67.25549927,67.24210319,67.22488414,67.20384547,67.17899129,67.15032644,67.1178565,67.08158782,67.04152746,66.99768322,66.95006366,66.89867807,66.84353645,66.78464955,66.72202887,66.6556866,66.58563569,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,54.75483349,55.24338724,55.71137779,56.1581183,56.58295311,56.98525872,57.3644447,57.71995454,58.05126646,58.35789424,58.63938785,58.89533416,59.12535753,59.32912037,59.50632364,59.65670726,59.78005053,59.87617241,59.94493184,59.98622791,60,59.99657576,59.98630426,59.96918919,59.94523667,59.91445529,59.87685606,59.83245245,59.78126037,59.72329815,59.65858655,59.58714875,59.50901033,59.42419928,59.33274597,59.23468317,59.13004598,59.01887189,58.90120071,58.77707459,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,60.91237457,61.50480079,62.07229182,62.61401479,63.12917466,63.61701534,64.07682087,64.50791641,64.90966929,65.28148986,65.62283243,65.93319604,66.21212518,66.45921048,66.67408932,66.85644632,67.00601386,67.12257243,67.20595095,67.25602707,67.27272727,67.27140981,67.26745763,67.26087132,67.25165185,67.23980062,67.22531939,67.20821032,67.18847598,67.1661193,67.14114364,67.11355272,67.08335066,67.05054198,67.01513158,66.97712476,66.93652719,66.89334493,66.84758445,66.79925257,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,];
			//var fakeTimeArray = [0,0.004166666666666667,0.008333333333333333,0.0125,0.016666666666666666,0.020833333333333332,0.024999999999999998,0.029166666666666664,0.03333333333333333,0.0375,0.041666666666666664,0.04583333333333333,0.049999999999999996,0.05416666666666666,0.05833333333333333,0.06249999999999999,0.06666666666666667,0.07083333333333333,0.075,0.07916666666666666,0.08333333333333333,0.0875,0.09166666666666666,0.09583333333333333,0.09999999999999999,0.10416666666666666,0.10833333333333332,0.11249999999999999,0.11666666666666665,0.12083333333333332,0.12499999999999999,0.12916666666666665,0.13333333333333333,0.1375,0.1416666666666667,0.14583333333333337,0.15000000000000005,0.15416666666666673,0.1583333333333334,0.1625000000000001,0.16666666666666677,0.17083333333333345,0.17500000000000013,0.1791666666666668,0.1833333333333335,0.18750000000000017,0.19166666666666685,0.19583333333333353,0.2000000000000002,0.20416666666666689,0.20833333333333356,0.21250000000000024,0.21666666666666692,0.2208333333333336,0.22500000000000028,0.22916666666666696,0.23333333333333364,0.23750000000000032,0.241666666666667,0.24583333333333368,0.25000000000000033,0.254166666666667,0.25833333333333364,0.2625000000000003,0.26666666666666694,0.2708333333333336,0.27500000000000024,0.2791666666666669,0.28333333333333355,0.2875000000000002,0.29166666666666685,0.2958333333333335,0.30000000000000016,0.3041666666666668,0.30833333333333346,0.3125000000000001,0.31666666666666676,0.3208333333333334,0.32500000000000007,0.3291666666666667,0.33333333333333337,0.3375,0.3416666666666667,0.3458333333333333,0.35,0.35416666666666663,0.3583333333333333,0.36249999999999993,0.3666666666666666,0.37083333333333324,0.3749999999999999,0.37916666666666654,0.3833333333333332,0.38749999999999984,0.3916666666666665,0.39583333333333315,0.3999999999999998,0.40416666666666645,0.4083333333333331,0.41249999999999976,0.4166666666666664,0.42083333333333306,0.4249999999999997,0.42916666666666636,0.433333333333333,0.43749999999999967,0.4416666666666663,0.44583333333333297,0.4499999999999996,0.4541666666666663,0.4583333333333329,0.4624999999999996,0.46666666666666623,0.4708333333333329,0.47499999999999953,0.4791666666666662,0.48333333333333284,0.4874999999999995,0.49166666666666614,0.4958333333333328,0.49999999999999944,0.5041666666666661,0.5083333333333327,0.5124999999999994,0.516666666666666,0.5208333333333327,0.5249999999999994,0.529166666666666,0.5333333333333327,0.5374999999999993,0.541666666666666,0.5458333333333326,0.5499999999999993,0.5541666666666659,0.5583333333333326,0.5624999999999992,0.5666666666666659,0.5708333333333325,0.5749999999999992,0.5791666666666658,0.5833333333333325,0.5874999999999991,0.5916666666666658,0.5958333333333324,0.5999999999999991,0.6041666666666657,0.6083333333333324,0.612499999999999,0.6166666666666657,0.6208333333333323,0.624999999999999,0.6291666666666657,0.6333333333333323,0.637499999999999,0.6416666666666656,0.6458333333333323,0.6499999999999989,0.6541666666666656,0.6583333333333322,0.6624999999999989,0.6666666666666655,0.6708333333333322,0.6749999999999988,0.6791666666666655,0.6833333333333321,0.6874999999999988,0.6916666666666654,0.6958333333333321,0.6999999999999987,0.7041666666666654,0.708333333333332,0.7124999999999987,0.7166666666666653,0.720833333333332,0.7249999999999986,0.7291666666666653,0.733333333333332,0.7374999999999986,0.7416666666666653,0.7458333333333319,0.7499999999999986,0.7541666666666652,0.7583333333333319,0.7624999999999985,0.7666666666666652,0.7708333333333318,0.7749999999999985,0.7791666666666651,0.7833333333333318,0.7874999999999984,0.7916666666666651,0.7958333333333317,0.7999999999999984,0.804166666666665,0.8083333333333317,0.8124999999999983,0.816666666666665,0.8208333333333316,0.8249999999999983,0.8291666666666649,0.8333333333333316,0.8374999999999982,0.8416666666666649,0.8458333333333315,0.8499999999999982,0.8541666666666649,0.8583333333333315,0.8624999999999982,0.8666666666666648,0.8708333333333315,0.8749999999999981,0.8791666666666648,0.8833333333333314,0.8874999999999981,0.8916666666666647,0.8958333333333314,0.899999999999998,0.9041666666666647,0.9083333333333313,0.912499999999998,0.9166666666666646,0.9208333333333313,0.9249999999999979,0.9291666666666646,0.9333333333333312,0.9374999999999979,0.9416666666666645,0.9458333333333312,0.9499999999999978,0.9541666666666645,0.9583333333333311,0.9624999999999978,0.9666666666666645,0.9708333333333311,0.9749999999999978,0.9791666666666644,0.9833333333333311,0.9874999999999977,0.9916666666666644,0.995833333333331,0.9999999999999977,1.0041666666666644,1.008333333333331,1.0124999999999977,1.0166666666666644,1.020833333333331,1.0249999999999977,1.0291666666666643,1.033333333333331,1.0374999999999976,1.0416666666666643,1.045833333333331,1.0499999999999976,1.0541666666666643,1.058333333333331,1.0624999999999976,1.0666666666666642,1.0708333333333309,1.0749999999999975,1.0791666666666642,1.0833333333333308,1.0874999999999975,1.0916666666666641,1.0958333333333308,1.0999999999999974,1.104166666666664,1.1083333333333307,1.1124999999999974,1.116666666666664,1.1208333333333307,1.1249999999999973,1.129166666666664,1.1333333333333306,1.1374999999999973,1.141666666666664,1.1458333333333306,1.1499999999999972,1.154166666666664,1.1583333333333306,1.1624999999999972,1.1666666666666639,1.1708333333333305,1.1749999999999972,1.1791666666666638,1.1833333333333305,1.1874999999999971,1.1916666666666638,1.1958333333333304,1.199999999999997,1.2041666666666637,1.2083333333333304,1.212499999999997,1.2166666666666637,1.2208333333333303,1.224999999999997,1.2291666666666636,1.2333333333333303,1.237499999999997,1.2416666666666636,1.2458333333333302,1.249999999999997,1.2541666666666635,1.2583333333333302,1.2624999999999968,1.2666666666666635,1.2708333333333302,1.2749999999999968,1.2791666666666635,1.28333333333333,1.2874999999999968,1.2916666666666634,1.29583333333333,1.2999999999999967,1.3041666666666634,1.30833333333333,1.3124999999999967,1.3166666666666633,1.32083333333333,1.3249999999999966,1.3291666666666633,1.33333333333333,1.3374999999999966,1.3416666666666632,1.3458333333333299,1.3499999999999965,1.3541666666666632,1.3583333333333298,1.3624999999999965,1.3666666666666631,1.3708333333333298,1.3749999999999964,1.379166666666663,1.3833333333333298,1.3874999999999964,1.391666666666663,1.3958333333333297,1.3999999999999964,1.404166666666663,1.4083333333333297,1.4124999999999963,1.416666666666663,1.4208333333333296,1.4249999999999963,1.429166666666663,1.4333333333333296,1.4374999999999962,1.4416666666666629,1.4458333333333295,1.4499999999999962,1.4541666666666628,1.4583333333333295,1.4624999999999961,1.4666666666666628,1.4708333333333294,1.474999999999996,1.4791666666666627,1.4833333333333294,1.487499999999996,1.4916666666666627,1.4958333333333294,1.499999999999996,1.5041666666666627,1.5083333333333293,1.512499999999996,1.5166666666666626,1.5208333333333293,1.524999999999996,1.5291666666666626,1.5333333333333292,1.5374999999999959,1.5416666666666625,1.5458333333333292,1.5499999999999958,1.5541666666666625,1.5583333333333291,1.5624999999999958,1.5666666666666624,1.570833333333329,1.5749999999999957,1.5791666666666624,1.583333333333329,1.5874999999999957,1.5916666666666623,1.595833333333329,1.5999999999999956,1.6041666666666623,1.608333333333329,1.6124999999999956,1.6166666666666623,1.620833333333329,1.6249999999999956,1.6291666666666622,1.6333333333333289,1.6374999999999955,1.6416666666666622,1.6458333333333288,1.6499999999999955,1.6541666666666621,1.6583333333333288,1.6624999999999954,1.666666666666662,1.6708333333333287,1.6749999999999954,1.679166666666662,1.6833333333333287,1.6874999999999953,1.691666666666662,1.6958333333333286,1.6999999999999953,1.704166666666662,1.7083333333333286,1.7124999999999952,1.716666666666662,1.7208333333333286,1.7249999999999952,1.7291666666666619,1.7333333333333285,1.7374999999999952,1.7416666666666618,1.7458333333333285,1.7499999999999951,1.7541666666666618,1.7583333333333284,1.762499999999995,1.7666666666666617,1.7708333333333284,1.774999999999995,1.7791666666666617,1.7833333333333283,1.787499999999995,1.7916666666666616,1.7958333333333283,1.799999999999995,1.8041666666666616,1.8083333333333282,1.812499999999995,1.8166666666666615,1.8208333333333282,1.8249999999999948,1.8291666666666615,1.8333333333333282,1.8374999999999948,1.8416666666666615,1.845833333333328,1.8499999999999948,1.8541666666666614,1.858333333333328,1.8624999999999947,1.8666666666666614,1.870833333333328,1.8749999999999947,1.8791666666666613,1.883333333333328,1.8874999999999946,1.8916666666666613,1.895833333333328,1.8999999999999946,1.9041666666666612,1.9083333333333279,1.9124999999999945,1.9166666666666612,1.9208333333333278,1.9249999999999945,1.9291666666666611,1.9333333333333278,1.9374999999999944,1.941666666666661,1.9458333333333278,1.9499999999999944,1.954166666666661,1.9583333333333277,1.9624999999999944,1.966666666666661,1.9708333333333277,1.9749999999999943,1.979166666666661,1.9833333333333276,1.9874999999999943,1.991666666666661,1.9958333333333276,1.9999999999999942,2.004166666666661,2.008333333333328,2.012499999999995,2.0166666666666617,2.0208333333333286,2.0249999999999955,2.0291666666666623,2.033333333333329,2.037499999999996,2.041666666666663,2.04583333333333,2.0499999999999967,2.0541666666666636,2.0583333333333305,2.0624999999999973,2.066666666666664,2.070833333333331,2.074999999999998,2.079166666666665,2.0833333333333317,2.0874999999999986,2.0916666666666655,2.0958333333333323,2.099999999999999,2.104166666666666,2.108333333333333,2.1125,2.1166666666666667,2.1208333333333336,2.1250000000000004,2.1291666666666673,2.133333333333334,2.137500000000001,2.141666666666668,2.145833333333335,2.1500000000000017,2.1541666666666686,2.1583333333333354,2.1625000000000023,2.166666666666669,2.170833333333336,2.175000000000003,2.17916666666667,2.1833333333333367,2.1875000000000036,2.1916666666666704,2.1958333333333373,2.200000000000004,2.204166666666671,2.208333333333338,2.212500000000005,2.2166666666666717,2.2208333333333385,2.2250000000000054,2.2291666666666723,2.233333333333339,2.237500000000006,2.241666666666673,2.24583333333334,2.2500000000000067,2.2541666666666735,2.2583333333333404,2.2625000000000073,2.266666666666674,2.270833333333341,2.275000000000008,2.279166666666675,2.2833333333333417,2.2875000000000085,2.2916666666666754,2.2958333333333423,2.300000000000009,2.304166666666676,2.308333333333343,2.3125000000000098,2.3166666666666766,2.3208333333333435,2.3250000000000104,2.3291666666666773,2.333333333333344,2.337500000000011,2.341666666666678,2.3458333333333448,2.3500000000000116,2.3541666666666785,2.3583333333333454,2.3625000000000123,2.366666666666679,2.370833333333346,2.375000000000013,2.3791666666666798,2.3833333333333466,2.3875000000000135,2.3916666666666804,2.3958333333333472,2.400000000000014,2.404166666666681,2.408333333333348,2.4125000000000147,2.4166666666666816,2.4208333333333485,2.4250000000000154,2.4291666666666822,2.433333333333349,2.437500000000016,2.441666666666683,2.4458333333333497,2.4500000000000166,2.4541666666666835,2.4583333333333504,2.4625000000000172,2.466666666666684,2.470833333333351,2.475000000000018,2.4791666666666847,2.4833333333333516,2.4875000000000185,2.4916666666666853,2.495833333333352,2.500000000000019,2.504166666666686,2.508333333333353,2.5125000000000197,2.5166666666666866,2.5208333333333535,2.5250000000000203,2.529166666666687,2.533333333333354,2.537500000000021,2.541666666666688,2.5458333333333547,2.5500000000000216,2.5541666666666885,2.5583333333333553,2.562500000000022,2.566666666666689,2.570833333333356,2.575000000000023,2.5791666666666897,2.5833333333333566,2.5875000000000234,2.5916666666666903,2.595833333333357,2.600000000000024,2.604166666666691,2.608333333333358,2.6125000000000247,2.6166666666666916,2.6208333333333584,2.6250000000000253,2.629166666666692,2.633333333333359,2.637500000000026,2.641666666666693,2.6458333333333597,2.6500000000000266,2.6541666666666934,2.6583333333333603,2.662500000000027,2.666666666666694,2.670833333333361,2.675000000000028,2.6791666666666947,2.6833333333333615,2.6875000000000284,2.6916666666666953,2.695833333333362,2.700000000000029,2.704166666666696,2.708333333333363,2.7125000000000297,2.7166666666666965,2.7208333333333634,2.7250000000000303,2.729166666666697,2.733333333333364,2.737500000000031,2.741666666666698,2.7458333333333647,2.7500000000000315,2.7541666666666984,2.7583333333333653,2.762500000000032,2.766666666666699,2.770833333333366,2.7750000000000328,2.7791666666666996,2.7833333333333665,2.7875000000000334,2.7916666666667003,2.795833333333367,2.800000000000034,2.804166666666701,2.8083333333333678,2.8125000000000346,2.8166666666667015,2.8208333333333684,2.8250000000000353,2.829166666666702,2.833333333333369,2.837500000000036,2.8416666666667028,2.8458333333333696,2.8500000000000365,2.8541666666667034,2.8583333333333703,2.862500000000037,2.866666666666704,2.870833333333371,2.8750000000000377,2.8791666666667046,2.8833333333333715,2.8916666666667052,2.895833333333372,2.900000000000039,2.904166666666706,2.9083333333333727,2.9125000000000396,2.9166666666667065,2.9208333333333734,2.9250000000000402,2.929166666666707,2.933333333333374,2.937500000000041,2.9416666666667077,2.9458333333333746,2.9500000000000415,2.9541666666667084,2.9583333333333752,2.962500000000042,2.966666666666709,2.970833333333376,2.9750000000000427,2.9791666666667096,2.9833333333333765,2.9875000000000433,2.99166666666671,2.995833333333377,3.000000000000044,3.004166666666711,3.0083333333333777,3.0125000000000446,3.0166666666667115,3.0208333333333783,3.025000000000045,3.029166666666712,3.033333333333379,3.037500000000046,3.0416666666667127,3.0458333333333796,3.0500000000000465,3.0541666666667133,3.05833333333338,3.062500000000047,3.066666666666714,3.070833333333381,3.0750000000000477,3.0791666666667146,3.0833333333333814,3.0875000000000483,3.091666666666715,3.095833333333382,3.100000000000049,3.104166666666716,3.1083333333333827,3.1125000000000496,3.1166666666667164,3.1208333333333833,3.12500000000005,3.129166666666717,3.133333333333384,3.137500000000051,3.1416666666667177,3.1458333333333846,3.1500000000000514,3.1541666666667183,3.158333333333385,3.162500000000052,3.166666666666719,3.170833333333386,3.1750000000000527,3.1791666666667195,3.1833333333333864,3.1875000000000533,3.19166666666672,3.195833333333387,3.200000000000054,3.204166666666721,3.2083333333333877,3.2125000000000545,3.2166666666667214,3.2208333333333883,3.225000000000055,3.229166666666722,3.233333333333389,3.2375000000000558,3.2416666666667227,3.2458333333333895,3.2500000000000564,3.2541666666667233,3.25833333333339,3.262500000000057,3.266666666666724,3.2708333333333908,3.2750000000000576,3.2791666666667245,3.2833333333333914,3.2875000000000583,3.291666666666725,3.295833333333392,3.300000000000059,3.3041666666667258,3.3083333333333926,3.3125000000000595,3.3166666666667264,3.3208333333333933,3.32500000000006,3.329166666666727,3.333333333333394,3.3375000000000608,3.3416666666667276,3.3458333333333945,3.3500000000000614,3.3541666666667282,3.358333333333395,3.362500000000062,3.366666666666729,3.3708333333333957,3.3750000000000626,3.3791666666667295,3.3833333333333964,3.3875000000000632,3.39166666666673,3.395833333333397,3.400000000000064,3.4041666666667307,3.4083333333333976,3.4125000000000645,3.4166666666667314,3.4208333333333982,3.425000000000065,3.429166666666732,3.433333333333399,3.4375000000000657,3.4416666666667326,3.4458333333333995,3.4500000000000663,3.454166666666733,3.4583333333334,3.462500000000067,3.466666666666734,3.4708333333334007,3.4750000000000676,3.4791666666667345,3.4833333333334013,3.487500000000068,3.491666666666735,3.495833333333402,3.500000000000069,3.5041666666667357,3.5083333333334026,3.5125000000000695,3.5166666666667363,3.520833333333403,3.52500000000007,3.529166666666737,3.533333333333404,3.5375000000000707,3.5416666666667376,3.5458333333334044,3.5500000000000713,3.554166666666738,3.558333333333405,3.562500000000072,3.566666666666739,3.5708333333334057,3.5750000000000726,3.5791666666667394,3.5833333333334063,3.587500000000073,3.59166666666674,3.595833333333407,3.600000000000074,3.6041666666667407,3.6083333333334076,3.6125000000000744,3.6166666666667413,3.620833333333408,3.625000000000075,3.629166666666742,3.633333333333409,3.6375000000000757,3.6416666666667425,3.6458333333334094,3.6500000000000763,3.654166666666743,3.65833333333341,3.662500000000077,3.666666666666744,3.6708333333334107,3.6750000000000775,3.6791666666667444,3.6833333333334113,3.687500000000078,3.691666666666745,3.695833333333412,3.700000000000079,3.7041666666667457,3.7083333333334125,3.7125000000000794,3.7166666666667463,3.720833333333413,3.72500000000008,3.729166666666747,3.7333333333334138,3.7375000000000806,3.7416666666667475,3.7458333333334144,3.7500000000000813,3.754166666666748,3.758333333333415,3.762500000000082,3.7666666666667488,3.7708333333334156,3.7750000000000825,3.7791666666667494,3.7833333333334163,3.787500000000083,3.79166666666675,3.795833333333417,3.8000000000000838,3.8041666666667506,3.8083333333334175,3.8125000000000844,3.8166666666667513,3.820833333333418,3.825000000000085,3.829166666666752,3.8333333333334187,3.8375000000000856,3.8416666666667525,3.8458333333334194,3.8500000000000862,3.854166666666753,3.85833333333342,3.862500000000087,3.8666666666667537,3.8708333333334206,3.8750000000000875,3.8791666666667544,3.8833333333334212,3.887500000000088,3.891666666666755,3.895833333333422,3.9000000000000887,3.9041666666667556,3.9083333333334225,3.9125000000000894,3.9166666666667562,3.920833333333423,3.92500000000009,3.929166666666757,3.9333333333334237,3.9375000000000906,3.9416666666667575,3.9458333333334243,3.950000000000091,3.954166666666758,3.958333333333425,3.962500000000092,3.9666666666667587,3.9708333333334256,3.9750000000000925,3.9791666666667593,3.983333333333426,3.987500000000093,3.99166666666676,3.995833333333427,4.000000000000093,4.00416666666676,4.008333333333426,4.0125000000000925,4.016666666666759,4.020833333333425,4.025000000000092,4.029166666666758,4.033333333333425,4.037500000000091,4.041666666666758,4.045833333333424,4.05000000000009,4.054166666666757,4.058333333333423,4.06250000000009,4.066666666666756,4.070833333333423,4.075000000000089,4.079166666666755,4.083333333333422,4.087500000000088,4.091666666666755,4.095833333333421,4.100000000000088,4.104166666666754,4.10833333333342,4.112500000000087,4.116666666666753,4.12083333333342,4.125000000000086,4.129166666666753,4.133333333333419,4.137500000000085,4.141666666666752,4.145833333333418,4.150000000000085,4.154166666666751,4.158333333333418,4.162500000000084,4.1666666666667505,4.170833333333417,4.175000000000083,4.17916666666675,4.183333333333416,4.187500000000083,4.191666666666749,4.1958333333334155,4.200000000000082,4.204166666666748,4.208333333333415,4.212500000000081,4.216666666666748,4.220833333333414,4.2250000000000805,4.229166666666747,4.233333333333413,4.23750000000008,4.241666666666746,4.245833333333413,4.250000000000079,4.2541666666667455,4.258333333333412,4.262500000000078,4.266666666666745,4.270833333333411,4.275000000000078,4.279166666666744,4.2833333333334105,4.287500000000077,4.291666666666743,4.29583333333341,4.300000000000076,4.304166666666743,4.308333333333409,4.3125000000000755,4.316666666666742,4.320833333333408,4.325000000000075,4.329166666666741,4.333333333333408,4.337500000000074,4.3416666666667405,4.345833333333407,4.350000000000073,4.35416666666674,4.358333333333406,4.362500000000073,4.366666666666739,4.3708333333334055,4.375000000000072,4.379166666666738,4.383333333333405,4.387500000000071,4.391666666666738,4.395833333333404,4.4000000000000705,4.404166666666737,4.408333333333403,4.41250000000007,4.416666666666736,4.420833333333403,4.425000000000069,4.4291666666667355,4.433333333333402,4.437500000000068,4.441666666666735,4.445833333333401,4.450000000000068,4.454166666666734,4.4583333333334005,4.462500000000067,4.466666666666733,4.4708333333334,4.475000000000066,4.479166666666733,4.483333333333399,4.4875000000000655,4.491666666666732,4.495833333333398,4.500000000000065,4.504166666666731,4.508333333333398,4.512500000000064,4.516666666666731,4.520833333333397,4.525000000000063,4.52916666666673,4.533333333333396,4.537500000000063,4.541666666666729,4.545833333333396,4.550000000000062,4.554166666666728,4.558333333333395,4.562500000000061,4.566666666666728,4.570833333333394,4.575000000000061,4.579166666666727,4.583333333333393,4.58750000000006,4.591666666666726,4.595833333333393,4.600000000000059,4.604166666666726,4.608333333333392,4.612500000000058,4.616666666666725,4.620833333333391,4.625000000000058,4.629166666666724,4.633333333333391,4.637500000000057,4.6416666666667235,4.64583333333339,4.650000000000056,4.654166666666723,4.658333333333389,4.662500000000056,4.666666666666722,4.6708333333333885,4.675000000000055,4.679166666666721,4.683333333333388,4.687500000000054,4.691666666666721,4.695833333333387,4.7000000000000535,4.70416666666672,4.708333333333386,4.712500000000053,4.716666666666719,4.720833333333386,4.725000000000052,4.7291666666667185,4.733333333333385,4.737500000000051,4.741666666666718,4.745833333333384,4.750000000000051,4.754166666666717,4.7583333333333835,4.76250000000005,4.766666666666716,4.770833333333383,4.775000000000049,4.779166666666716,4.783333333333382,4.7875000000000485,4.791666666666715,4.795833333333381,4.800000000000048,4.804166666666714,4.808333333333381,4.812500000000047,4.8166666666667135,4.82083333333338,4.825000000000046,4.829166666666713,4.833333333333379,4.837500000000046,4.841666666666712,4.8458333333333785,4.850000000000045,4.854166666666711,4.858333333333378,4.862500000000044,4.866666666666711,4.870833333333377,4.8750000000000435,4.87916666666671,4.883333333333376,4.887500000000043,4.891666666666709,4.895833333333376,4.900000000000042,4.9041666666667085,4.908333333333375,4.912500000000041,4.916666666666708,4.920833333333374,4.925000000000041,4.929166666666707,4.9333333333333735,4.93750000000004,4.941666666666706,4.945833333333373,4.950000000000039,4.954166666666706,4.958333333333372,4.9625000000000385,4.966666666666705,4.970833333333371,4.975000000000038,4.979166666666704,4.983333333333371,4.987500000000037,4.9916666666667036,4.99583333333337,5.000000000000036,5.004166666666703,5.008333333333369,5.012500000000036,5.016666666666702,5.020833333333369,5.025000000000035,5.029166666666701,5.033333333333368,5.037500000000034,5.041666666666701,5.045833333333367,5.050000000000034,5.0541666666667,5.058333333333366,5.062500000000033,5.066666666666699,5.070833333333366,5.075000000000032,5.079166666666699,5.083333333333365,5.087500000000031,5.091666666666698,5.095833333333364,5.100000000000031,5.104166666666697,5.108333333333364,5.11250000000003,5.1166666666666965,5.120833333333363,5.125000000000029,5.129166666666696,5.133333333333362,5.137500000000029,5.141666666666695,5.1458333333333615,5.150000000000028,5.154166666666694,5.158333333333361,5.162500000000027,5.166666666666694,5.17083333333336,5.1750000000000265,5.179166666666693,5.183333333333359,5.187500000000026,5.191666666666692,5.195833333333359,5.200000000000025,5.2041666666666915,5.208333333333358,5.212500000000024,5.216666666666691,5.220833333333357,5.225000000000024,5.22916666666669,5.2333333333333565,5.237500000000023,5.241666666666689,5.245833333333356,5.250000000000022,5.254166666666689,5.258333333333355,5.2625000000000215,5.266666666666688,5.270833333333354,5.275000000000021,5.279166666666687,5.283333333333354,5.28750000000002,5.2916666666666865,5.295833333333353,5.300000000000019,5.304166666666686,5.308333333333352,5.312500000000019,5.316666666666685,5.3208333333333515,5.325000000000018,5.329166666666684,5.333333333333351,5.337500000000017,5.341666666666684,5.34583333333335,5.3500000000000165,5.354166666666683,5.358333333333349,5.362500000000016,5.366666666666682,5.370833333333349,5.375000000000015,5.3791666666666815,5.383333333333348,5.387500000000014,5.391666666666681,5.395833333333347,5.400000000000014,5.40416666666668,5.4083333333333465,5.412500000000013,5.416666666666679,5.420833333333346,5.425000000000012,5.429166666666679,5.433333333333345,5.4375000000000115,5.441666666666678,5.445833333333344,5.450000000000011,5.454166666666677,5.458333333333344,5.46250000000001,5.4666666666666766,5.470833333333343,5.475000000000009,5.479166666666676,5.483333333333342,5.487500000000009,5.491666666666675,5.495833333333342,5.500000000000008,5.504166666666674,5.508333333333341,5.512500000000007,5.516666666666674,5.52083333333334,5.525000000000007,5.529166666666673,5.533333333333339,5.537500000000006,5.541666666666672,5.545833333333339,5.550000000000005,5.554166666666672,5.558333333333338,5.562500000000004,5.566666666666671,5.570833333333337,5.575000000000004,5.57916666666667,5.583333333333337,5.587500000000003,5.5916666666666694,5.595833333333336,5.600000000000002,5.604166666666669,5.608333333333335,5.612500000000002,5.616666666666668,5.6208333333333345,5.625000000000001,5.629166666666667,5.633333333333334,5.6375,5.641666666666667,5.645833333333333,5.6499999999999995,5.654166666666666,5.658333333333332,5.662499999999999,5.666666666666665,5.670833333333332,5.674999999999998,5.6791666666666645,5.683333333333331,5.687499999999997,5.691666666666664,5.69583333333333,5.699999999999997,5.704166666666663,5.7083333333333295,5.712499999999996,5.716666666666662,5.720833333333329,5.724999999999995,5.729166666666662,5.733333333333328,5.7374999999999945,5.741666666666661,5.745833333333327,5.749999999999994,5.75416666666666,5.758333333333327,5.762499999999993,5.7666666666666595,5.770833333333326,5.774999999999992,5.779166666666659,5.783333333333325,5.787499999999992,5.791666666666658,5.7958333333333245,5.799999999999991,5.804166666666657,5.808333333333324,5.81249999999999,5.816666666666657,5.820833333333323,5.8249999999999895,5.829166666666656,5.833333333333322,5.837499999999989,5.841666666666655,5.845833333333322,5.849999999999988,5.8541666666666545,5.858333333333321,5.862499999999987,5.866666666666654,5.87083333333332,5.874999999999987,5.879166666666653,5.8833333333333195,5.887499999999986,5.891666666666652,5.895833333333319,5.899999999999985,5.904166666666652,5.908333333333318,5.9124999999999845,5.916666666666651,5.920833333333317,5.924999999999984,5.92916666666665,5.933333333333317,5.937499999999983,5.9416666666666496,5.945833333333316,5.949999999999982,5.954166666666649,5.958333333333315,5.962499999999982,5.966666666666648,5.970833333333315,5.974999999999981,5.979166666666647,5.983333333333314,5.98749999999998,5.991666666666647,5.995833333333313,5.99999999999998,6.004166666666646,6.008333333333312,6.012499999999979,6.016666666666645,6.020833333333312,6.024999999999978,6.029166666666645,6.033333333333311,6.037499999999977,6.041666666666644,6.04583333333331,6.049999999999977,6.054166666666643,6.05833333333331,6.062499999999976,6.0666666666666424,6.070833333333309,6.074999999999975,6.079166666666642,6.083333333333308,6.087499999999975,6.091666666666641,6.0958333333333075,6.099999999999974,6.10416666666664,6.108333333333307,6.112499999999973,6.11666666666664,6.120833333333306,6.1249999999999725,6.129166666666639,6.133333333333305,6.137499999999972,6.141666666666638,6.145833333333305,6.149999999999971,6.1541666666666375,6.158333333333304,6.16249999999997,6.166666666666637,6.170833333333303,6.17499999999997,6.179166666666636,6.1833333333333025,6.187499999999969,6.191666666666635,6.195833333333302,6.199999999999968,6.204166666666635,6.208333333333301,6.2124999999999675,6.216666666666634,6.2208333333333,6.224999999999967,6.229166666666633,6.2333333333333,6.237499999999966,6.2416666666666325,6.245833333333299,6.249999999999965,6.254166666666632,6.258333333333298,6.262499999999965,6.266666666666631,6.2708333333332975,6.274999999999964,6.27916666666663,6.283333333333297,6.287499999999963,6.29166666666663,6.295833333333296,6.2999999999999625,6.304166666666629,6.308333333333295,6.312499999999962,6.316666666666628,6.320833333333295,6.324999999999961,6.3291666666666275,6.333333333333294,6.33749999999996,6.341666666666627,6.345833333333293,6.34999999999996,6.354166666666626,6.3583333333332925,6.362499999999959,6.366666666666625,6.370833333333292,6.374999999999958,6.379166666666625,6.383333333333291,6.3874999999999575,6.391666666666624,6.39583333333329,6.399999999999957,6.404166666666623,6.40833333333329,6.412499999999956,6.4166666666666226,6.420833333333289,6.424999999999955,6.429166666666622,6.433333333333288,6.437499999999955,6.441666666666621,6.445833333333288,6.449999999999954,6.45416666666662,6.458333333333287,6.462499999999953,6.46666666666662,6.470833333333286,6.474999999999953,6.479166666666619,6.483333333333285,6.487499999999952,6.491666666666618,6.495833333333285,6.499999999999951,6.504166666666618,6.508333333333284,6.51249999999995,6.516666666666617,6.520833333333283,6.52499999999995,6.529166666666616,6.533333333333283,6.537499999999949,6.5416666666666154,6.545833333333282,6.549999999999948,6.554166666666615,6.558333333333281,6.562499999999948,6.566666666666614,6.5708333333332805,6.574999999999947,6.579166666666613,6.58333333333328,6.587499999999946,6.591666666666613,6.595833333333279,6.5999999999999455,6.604166666666612,6.608333333333278,6.612499999999945,6.616666666666611,6.620833333333278,6.624999999999944,6.6291666666666105,6.633333333333277,6.637499999999943,6.64166666666661,6.645833333333276,6.649999999999943,6.654166666666609,6.6583333333332755,6.662499999999942,6.666666666666608,6.670833333333275,6.674999999999941,6.679166666666608,6.683333333333274,6.6874999999999405,6.691666666666607,6.695833333333273,6.69999999999994,6.704166666666606,6.708333333333273,6.712499999999939,6.7166666666666055,6.720833333333272,6.724999999999938,6.729166666666605,6.733333333333271,6.737499999999938,6.741666666666604,6.7458333333332705,6.749999999999937,6.754166666666603,6.75833333333327,6.762499999999936,6.766666666666603,6.770833333333269,6.7749999999999355,6.779166666666602,6.783333333333268,6.787499999999935,6.791666666666601,6.795833333333268,6.799999999999934,6.8041666666666005,6.808333333333267,6.812499999999933,6.8166666666666,6.820833333333266,6.824999999999933,6.829166666666599,6.8333333333332655,6.837499999999932,6.841666666666598,6.845833333333265,6.849999999999931,6.854166666666598,6.858333333333264,6.8624999999999305,6.866666666666597,6.870833333333263,6.87499999999993,6.879166666666596,6.883333333333263,6.887499999999929,6.8916666666665956,6.895833333333262,6.899999999999928,6.904166666666595,6.908333333333261,6.912499999999928,6.916666666666594,6.920833333333261,6.924999999999927,6.929166666666593,6.93333333333326,6.937499999999926,6.941666666666593,6.945833333333259,6.949999999999926,6.954166666666592,6.958333333333258,6.962499999999925,6.966666666666591,6.970833333333258,6.974999999999924,6.979166666666591,6.983333333333257,6.987499999999923,6.99166666666659,6.995833333333256,6.999999999999923,7.004166666666589,7.008333333333256,7.012499999999922,7.0166666666665884,7.020833333333255,7.024999999999921,7.029166666666588,7.033333333333254,7.037499999999921,7.041666666666587,7.0458333333332535,7.04999999999992,7.054166666666586,7.058333333333253,7.062499999999919,7.066666666666586,7.070833333333252,7.0749999999999185,7.079166666666585,7.083333333333251,7.087499999999918,7.091666666666584,7.095833333333251,7.099999999999917,7.1041666666665835,7.10833333333325,7.112499999999916,7.116666666666583,7.120833333333249,7.124999999999916,7.129166666666582,7.1333333333332485,7.137499999999915,7.141666666666581,7.145833333333248,7.149999999999914,7.154166666666581,7.158333333333247,7.1624999999999135,7.16666666666658,7.170833333333246,7.174999999999913,7.179166666666579,7.183333333333246,7.187499999999912,7.1916666666665785,7.195833333333245,7.199999999999911,7.204166666666578,7.208333333333244,7.212499999999911,7.216666666666577,7.2208333333332435,7.22499999999991,7.229166666666576,7.233333333333243,7.237499999999909,7.241666666666576,7.245833333333242,7.2499999999999085,7.254166666666575,7.258333333333241,7.262499999999908,7.266666666666574,7.270833333333241,7.274999999999907,7.2791666666665735,7.28333333333324,7.287499999999906,7.291666666666573,7.295833333333239,7.299999999999906,7.304166666666572,7.3083333333332385,7.312499999999905,7.316666666666571,7.320833333333238,7.324999999999904,7.329166666666571,7.333333333333237,7.3374999999999035,7.34166666666657,7.345833333333236,7.349999999999903,7.354166666666569,7.358333333333236,7.362499999999902,7.3666666666665686,7.370833333333235,7.374999999999901,7.379166666666568,7.383333333333234,7.387499999999901,7.391666666666567,7.395833333333234,7.3999999999999,7.404166666666566,7.408333333333233,7.412499999999899,7.416666666666566,7.420833333333232,7.424999999999899,7.429166666666565,7.433333333333231,7.437499999999898,7.441666666666564,7.445833333333231,7.449999999999897,7.454166666666564,7.45833333333323,7.462499999999896,7.466666666666563,7.470833333333229,7.474999999999896,7.479166666666562,7.483333333333229,7.487499999999895,7.4916666666665614,7.495833333333228,7.499999999999894,7.504166666666561,7.508333333333227,7.512499999999894,7.51666666666656,7.5208333333332265,7.524999999999893,7.529166666666559,7.533333333333226,7.537499999999892,7.541666666666559,7.545833333333225,7.5499999999998915,7.554166666666558,7.558333333333224,7.562499999999891,7.566666666666557,7.570833333333224,7.57499999999989,7.5791666666665565,7.583333333333223,7.587499999999889,7.591666666666556,7.595833333333222,7.599999999999889,7.604166666666555,7.6083333333332215,7.612499999999888,7.616666666666554,7.620833333333221,7.624999999999887,7.629166666666554,7.63333333333322,7.6374999999998865,7.641666666666553,7.645833333333219,7.649999999999886,7.654166666666552,7.658333333333219,7.662499999999885,7.6666666666665515,7.670833333333218,7.674999999999884,7.679166666666551,7.683333333333217,7.687499999999884,7.69166666666655,7.6958333333332165,7.699999999999883,7.704166666666549,7.708333333333216,7.712499999999882,7.716666666666549,7.720833333333215,7.7249999999998815,7.729166666666548,7.733333333333214,7.737499999999881,7.741666666666547,7.745833333333214,7.74999999999988,7.7541666666665465,7.758333333333213,7.762499999999879,7.766666666666546,7.770833333333212,7.774999999999879,7.779166666666545,7.7833333333332115,7.787499999999878,7.791666666666544,7.795833333333211,7.799999999999877,7.804166666666544,7.80833333333321,7.8124999999998765,7.816666666666543,7.820833333333209,7.824999999999876,7.829166666666542,7.833333333333209,7.837499999999875,7.8416666666665416,7.845833333333208,7.849999999999874,7.854166666666541,7.858333333333207,7.862499999999874,7.86666666666654,7.870833333333207,7.874999999999873,7.879166666666539,7.883333333333206,7.887499999999872,7.891666666666539,7.895833333333205,7.899999999999872,7.904166666666538,7.908333333333204,7.912499999999871,7.916666666666537,7.920833333333204,7.92499999999987,7.929166666666537,7.933333333333203,7.937499999999869,7.941666666666536,7.945833333333202,7.949999999999869,7.954166666666535,7.958333333333202,7.962499999999868,7.9666666666665344,7.970833333333201];
			var fakeTimeArray = [0,0.004166667,0.008333333,0.0125,0.016666667,0.020833333,0.025,0.029166667,0.033333333,0.0375,0.041666667,0.045833333,0.05,0.054166667,0.058333333,0.0625,0.066666667,0.070833333,0.075,0.079166667,0.083333333,0.0875,0.091666667,0.095833333,0.1,0.104166667,0.108333333,0.1125,0.116666667,0.120833333,0.125,0.129166667,0.133333333,0.1375,0.141666667,0.145833333,0.15,0.154166667,0.158333333,0.1625,0.166666667,0.170833333,0.175,0.179166667,0.183333333,0.1875,0.191666667,0.195833333,0.2,0.204166667,0.208333333,0.2125,0.216666667,0.220833333,0.225,0.229166667,0.233333333,0.2375,0.241666667,0.245833333,0.25,0.254166667,0.258333333,0.2625,0.266666667,0.270833333,0.275,0.279166667,0.283333333,0.2875,0.291666667,0.295833333,0.3,0.304166667,0.308333333,0.3125,0.316666667,0.320833333,0.325,0.329166667,0.333333333,0.3375,0.341666667,0.345833333,0.35,0.354166667,0.358333333,0.3625,0.366666667,0.370833333,0.375,0.379166667,0.383333333,0.3875,0.391666667,0.395833333,0.4,0.404166667,0.408333333,0.4125,0.416666667,0.420833333,0.425,0.429166667,0.433333333,0.4375,0.441666667,0.445833333,0.45,0.454166667,0.458333333,0.4625,0.466666667,0.470833333,0.475,0.479166667,0.483333333,0.4875,0.491666667,0.495833333,0.5,0.504166667,0.508333333,0.5125,0.516666667,0.520833333,0.525,0.529166667,0.533333333,0.5375,0.541666667,0.545833333,0.55,0.554166667,0.558333333,0.5625,0.566666667,0.570833333,0.575,0.579166667,0.583333333,0.5875,0.591666667,0.595833333,0.6,0.604166667,0.608333333,0.6125,0.616666667,0.620833333,0.625,0.629166667,0.633333333,0.6375,0.641666667,0.645833333,0.65,0.654166667,0.658333333,0.6625,0.666666667,0.670833333,0.675,0.679166667,0.683333333,0.6875,0.691666667,0.695833333,0.7,0.704166667,0.708333333,0.7125,0.716666667,0.720833333,0.725,0.729166667,0.733333333,0.7375,0.741666667,0.745833333,0.75,0.754166667,0.758333333,0.7625,0.766666667,0.770833333,0.775,0.779166667,0.783333333,0.7875,0.791666667,0.795833333,0.8,0.804166667,0.808333333,0.8125,0.816666667,0.820833333,0.825,0.829166667,0.833333333,0.8375,0.841666667,0.845833333,0.85,0.854166667,0.858333333,0.8625,0.866666667,0.870833333,0.875,0.879166667,0.883333333,0.8875,0.891666667,0.895833333,0.9,0.904166667,0.908333333,0.9125,0.916666667,0.920833333,0.925,0.929166667,0.933333333,0.9375,0.941666667,0.945833333,0.95,0.954166667,0.958333333,0.9625,0.966666667,0.970833333,0.975,0.979166667,0.983333333,0.9875,0.991666667,0.995833333,1,1.004166667,1.008333333,1.0125,1.016666667,1.020833333,1.025,1.029166667,1.033333333,1.0375,1.041666667,1.045833333,1.05,1.054166667,1.058333333,1.0625,1.066666667,1.070833333,1.075,1.079166667,1.083333333,1.0875,1.091666667,1.095833333,1.1,1.104166667,1.108333333,1.1125,1.116666667,1.120833333,1.125,1.129166667,1.133333333,1.1375,1.141666667,1.145833333,1.15,1.154166667,1.158333333,1.1625,1.166666667,1.170833333,1.175,1.179166667,1.183333333,1.1875,1.191666667,1.195833333,1.2,1.204166667,1.208333333,1.2125,1.216666667,1.220833333,1.225,1.229166667,1.233333333,1.2375,1.241666667,1.245833333,1.25,1.254166667,1.258333333,1.2625,1.266666667,1.270833333,1.275,1.279166667,1.283333333,1.2875,1.291666667,1.295833333,1.3,1.304166667,1.308333333,1.3125,1.316666667,1.320833333,1.325,1.329166667,1.333333333,1.3375,1.341666667,1.345833333,1.35,1.354166667,1.358333333,1.3625,1.366666667,1.370833333,1.375,1.379166667,1.383333333,1.3875,1.391666667,1.395833333,1.4,1.404166667,1.408333333,1.4125,1.416666667,1.420833333,1.425,1.429166667,1.433333333,1.4375,1.441666667,1.445833333,1.45,1.454166667,1.458333333,1.4625,1.466666667,1.470833333,1.475,1.479166667,1.483333333,1.4875,1.491666667,1.495833333,1.5,1.504166667,1.508333333,1.5125,1.516666667,1.520833333,1.525,1.529166667,1.533333333,1.5375,1.541666667,1.545833333,1.55,1.554166667,1.558333333,1.5625,1.566666667,1.570833333,1.575,1.579166667,1.583333333,1.5875,1.591666667,1.595833333,1.6,1.604166667,1.608333333,1.6125,1.616666667,1.620833333,1.625,1.629166667,1.633333333,1.6375,1.641666667,1.645833333,1.65,1.654166667,1.658333333,1.6625,1.666666667,1.670833333,1.675,1.679166667,1.683333333,1.6875,1.691666667,1.695833333,1.7,1.704166667,1.708333333,1.7125,1.716666667,1.720833333,1.725,1.729166667,1.733333333,1.7375,1.741666667,1.745833333,1.75,1.754166667,1.758333333,1.7625,1.766666667,1.770833333,1.775,1.779166667,1.783333333,1.7875,1.791666667,1.795833333,1.8,1.804166667,1.808333333,1.8125,1.816666667,1.820833333,1.825,1.829166667,1.833333333,1.8375,1.841666667,1.845833333,1.85,1.854166667,1.858333333,1.8625,1.866666667,1.870833333,1.875,1.879166667,1.883333333,1.8875,1.891666667,1.895833333,1.9,1.904166667,1.908333333,1.9125,1.916666667,1.920833333,1.925,1.929166667,1.933333333,1.9375,1.941666667,1.945833333,1.95,1.954166667,1.958333333,1.9625,1.966666667,1.970833333,1.975,1.979166667,1.983333333,1.9875,1.991666667,1.995833333,2,2.004166667,2.008333333,2.0125,2.016666667,2.020833333,2.025,2.029166667,2.033333333,2.0375,2.041666667,2.045833333,2.05,2.054166667,2.058333333,2.0625,2.066666667,2.070833333,2.075,2.079166667,2.083333333,2.0875,2.091666667,2.095833333,2.1,2.104166667,2.108333333,2.1125,2.116666667,2.120833333,2.125,2.129166667,2.133333333,2.1375,2.141666667,2.145833333,2.15,2.154166667,2.158333333,2.1625,2.166666667,2.170833333,2.175,2.179166667,2.183333333,2.1875,2.191666667,2.195833333,2.2,2.204166667,2.208333333,2.2125,2.216666667,2.220833333,2.225,2.229166667,2.233333333,2.2375,2.241666667,2.245833333,2.25,2.254166667,2.258333333,2.2625,2.266666667,2.270833333,2.275,2.279166667,2.283333333,2.2875,2.291666667,2.295833333,2.3,2.304166667,2.308333333,2.3125,2.316666667,2.320833333,2.325,2.329166667,2.333333333,2.3375,2.341666667,2.345833333,2.35,2.354166667,2.358333333,2.3625,2.366666667,2.370833333,2.375,2.379166667,2.383333333,2.3875,2.391666667,2.395833333,2.4,2.404166667,2.408333333,2.4125,2.416666667,2.420833333,2.425,2.429166667,2.433333333,2.4375,2.441666667,2.445833333,2.45,2.454166667,2.458333333,2.4625,2.466666667,2.470833333,2.475,2.479166667,2.483333333,2.4875,2.491666667,2.495833333,2.5,2.504166667,2.508333333,2.5125,2.516666667,2.520833333,2.525,2.529166667,2.533333333,2.5375,2.541666667,2.545833333,2.55,2.554166667,2.558333333,2.5625,2.566666667,2.570833333,2.575,2.579166667,2.583333333,2.5875,2.591666667,2.595833333,2.6,2.604166667,2.608333333,2.6125,2.616666667,2.620833333,2.625,2.629166667,2.633333333,2.6375,2.641666667,2.645833333,2.65,2.654166667,2.658333333,2.6625,2.666666667,2.670833333,2.675,2.679166667,2.683333333,2.6875,2.691666667,2.695833333,2.7,2.704166667,2.708333333,2.7125,2.716666667,2.720833333,2.725,2.729166667,2.733333333,2.7375,2.741666667,2.745833333,2.75,2.754166667,2.758333333,2.7625,2.766666667,2.770833333,2.775,2.779166667,2.783333333,2.7875,2.791666667,2.795833333,2.8,2.804166667,2.808333333,2.8125,2.816666667,2.820833333,2.825,2.829166667,2.833333333,2.8375,2.841666667,2.845833333,2.85,2.854166667,2.858333333,2.8625,2.866666667,2.870833333,2.875,2.879166667,2.883333333,2.8875,2.891666667,2.895833333,2.9,2.904166667,2.908333333,2.9125,2.916666667,2.920833333,2.925,2.929166667,2.933333333,2.9375,2.941666667,2.945833333,2.95,2.954166667,2.958333333,2.9625,2.966666667,2.970833333,2.975,2.979166667,2.983333333,2.9875,2.991666667,2.995833333,3,3.004166667,3.008333333,3.0125,3.016666667,3.020833333,3.025,3.029166667,3.033333333,3.0375,3.041666667,3.045833333,3.05,3.054166667,3.058333333,3.0625,3.066666667,3.070833333,3.075,3.079166667,3.083333333,3.0875,3.091666667,3.095833333,3.1,3.104166667,3.108333333,3.1125,3.116666667,3.120833333,3.125,3.129166667,3.133333333,3.1375,3.141666667,3.145833333,3.15,3.154166667,3.158333333,3.1625,3.166666667,3.170833333,3.175,3.179166667,3.183333333,3.1875,3.191666667,3.195833333,3.2,3.204166667,3.208333333,3.2125,3.216666667,3.220833333,3.225,3.229166667,3.233333333,3.2375,3.241666667,3.245833333,3.25,3.254166667,3.258333333,3.2625,3.266666667,3.270833333,3.275,3.279166667,3.283333333,3.2875,3.291666667,3.295833333,3.3,3.304166667,3.308333333,3.3125,3.316666667,3.320833333,3.325,3.329166667,3.333333333,3.3375,3.341666667,3.345833333,3.35,3.354166667,3.358333333,3.3625,3.366666667,3.370833333,3.375,3.379166667,3.383333333,3.3875,3.391666667,3.395833333,3.4,3.404166667,3.408333333,3.4125,3.416666667,3.420833333,3.425,3.429166667,3.433333333,3.4375,3.441666667,3.445833333,3.45,3.454166667,3.458333333,3.4625,3.466666667,3.470833333,3.475,3.479166667,3.483333333,3.4875,3.491666667,3.495833333,3.5,3.504166667,3.508333333,3.5125,3.516666667,3.520833333,3.525,3.529166667,3.533333333,3.5375,3.541666667,3.545833333,3.55,3.554166667,3.558333333,3.5625,3.566666667,3.570833333,3.575,3.579166667,3.583333333,3.5875,3.591666667,3.595833333,3.6,3.604166667,3.608333333,3.6125,3.616666667,3.620833333,3.625,3.629166667,3.633333333,3.6375,3.641666667,3.645833333,3.65,3.654166667,3.658333333,3.6625,3.666666667,3.670833333,3.675,3.679166667,3.683333333,3.6875,3.691666667,3.695833333,3.7,3.704166667,3.708333333,3.7125,3.716666667,3.720833333,3.725,3.729166667,3.733333333,3.7375,3.741666667,3.745833333,3.75,3.754166667,3.758333333,3.7625,3.766666667,3.770833333,3.775,3.779166667,3.783333333,3.7875,3.791666667,3.795833333,3.8,3.804166667,3.808333333,3.8125,3.816666667,3.820833333,3.825,3.829166667,3.833333333,3.8375,3.841666667,3.845833333,3.85,3.854166667,3.858333333,3.8625,3.866666667,3.870833333,3.875,3.879166667,3.883333333,3.8875,3.891666667,3.895833333,3.9,3.904166667,3.908333333,3.9125,3.916666667,3.920833333,3.925,3.929166667,3.933333333,3.9375,3.941666667,3.945833333,3.95,3.954166667,3.958333333,3.9625,3.966666667,3.970833333,3.975,3.979166667,3.983333333,3.9875,3.991666667,3.995833333,4,4.004166667,4.008333333,4.0125,4.016666667,4.020833333,4.025,4.029166667,4.033333333,4.0375,4.041666667,4.045833333,4.05,4.054166667,4.058333333,4.0625,4.066666667,4.070833333,4.075,4.079166667,4.083333333,4.0875,4.091666667,4.095833333,4.1,4.104166667,4.108333333,4.1125,4.116666667,4.120833333,4.125,4.129166667,4.133333333,4.1375,4.141666667,4.145833333,4.15,4.154166667,4.158333333,4.1625,4.166666667,4.170833333,4.175,4.179166667,4.183333333,4.1875,4.191666667,4.195833333,4.2,4.204166667,4.208333333,4.2125,4.216666667,4.220833333,4.225,4.229166667,4.233333333,4.2375,4.241666667,4.245833333,4.25,4.254166667,4.258333333,4.2625,4.266666667,4.270833333,4.275,4.279166667,4.283333333,4.2875,4.291666667,4.295833333,4.3,4.304166667,4.308333333,4.3125,4.316666667,4.320833333,4.325,4.329166667,4.333333333,4.3375,4.341666667,4.345833333,4.35,4.354166667,4.358333333,4.3625,4.366666667,4.370833333,4.375,4.379166667,4.383333333,4.3875,4.391666667,4.395833333,4.4,4.404166667,4.408333333,4.4125,4.416666667,4.420833333,4.425,4.429166667,4.433333333,4.4375,4.441666667,4.445833333,4.45,4.454166667,4.458333333,4.4625,4.466666667,4.470833333,4.475,4.479166667,4.483333333,4.4875,4.491666667,4.495833333,4.5,4.504166667,4.508333333,4.5125,4.516666667,4.520833333,4.525,4.529166667,4.533333333,4.5375,4.541666667,4.545833333,4.55,4.554166667,4.558333333,4.5625,4.566666667,4.570833333,4.575,4.579166667,4.583333333,4.5875,4.591666667,4.595833333,4.6,4.604166667,4.608333333,4.6125,4.616666667,4.620833333,4.625,4.629166667,4.633333333,4.6375,4.641666667,4.645833333,4.65,4.654166667,4.658333333,4.6625,4.666666667,4.670833333,4.675,4.679166667,4.683333333,4.6875,4.691666667,4.695833333,4.7,4.704166667,4.708333333,4.7125,4.716666667,4.720833333,4.725,4.729166667,4.733333333,4.7375,4.741666667,4.745833333,4.75,4.754166667,4.758333333,4.7625,4.766666667,4.770833333,4.775,4.779166667,4.783333333,4.7875,4.791666667,4.795833333,4.8,4.804166667,4.808333333,4.8125,4.816666667,4.820833333,4.825,4.829166667,4.833333333,4.8375,4.841666667,4.845833333,4.85,4.854166667,4.858333333,4.8625,4.866666667,4.870833333,4.875,4.879166667,4.883333333,4.8875,4.891666667,4.895833333,4.9,4.904166667,4.908333333,4.9125,4.916666667,4.920833333,4.925,4.929166667,4.933333333,4.9375,4.941666667,4.945833333,4.95,4.954166667,4.958333333,4.9625,4.966666667,4.970833333,4.975,4.979166667,4.983333333,4.9875,4.991666667,4.995833333,5,5.004166667,5.008333333,5.0125,5.016666667,5.020833333,5.025,5.029166667,5.033333333,5.0375,5.041666667,5.045833333,5.05,5.054166667,5.058333333,5.0625,5.066666667,5.070833333,5.075,5.079166667,5.083333333,5.0875,5.091666667,5.095833333,5.1,5.104166667,5.108333333,5.1125,5.116666667,5.120833333,5.125,5.129166667,5.133333333,5.1375,5.141666667,5.145833333,5.15,5.154166667,5.158333333,5.1625,5.166666667,5.170833333,5.175,5.179166667,5.183333333,5.1875,5.191666667,5.195833333,5.2,5.204166667,5.208333333,5.2125,5.216666667,5.220833333,5.225,5.229166667,5.233333333,5.2375,5.241666667,5.245833333,5.25,5.254166667,5.258333333,5.2625,5.266666667,5.270833333,5.275,5.279166667,5.283333333,5.2875,5.291666667,5.295833333,5.3,5.304166667,5.308333333,5.3125,5.316666667,5.320833333,5.325,5.329166667,5.333333333,5.3375,5.341666667,5.345833333,5.35,5.354166667,5.358333333,5.3625,5.366666667,5.370833333,5.375,5.379166667,5.383333333,5.3875,5.391666667,5.395833333,5.4,5.404166667,5.408333333,5.4125,5.416666667,5.420833333,5.425,5.429166667,5.433333333,5.4375,5.441666667,5.445833333,5.45,5.454166667,5.458333333,5.4625,5.466666667,5.470833333,5.475,5.479166667,5.483333333,5.4875,5.491666667,5.495833333,5.5,5.504166667,5.508333333,5.5125,5.516666667,5.520833333,5.525,5.529166667,5.533333333,5.5375,5.541666667,5.545833333,5.55,5.554166667,5.558333333,5.5625,5.566666667,5.570833333,5.575,5.579166667,5.583333333,5.5875,5.591666667,5.595833333,5.6,5.604166667,5.608333333,5.6125,5.616666667,5.620833333,5.625,5.629166667,5.633333333,5.6375,5.641666667,5.645833333,5.65,5.654166667,5.658333333,5.6625,5.666666667,5.670833333,5.675,5.679166667,5.683333333,5.6875,5.691666667,5.695833333,5.7,5.704166667,5.708333333,5.7125,5.716666667,5.720833333,5.725,5.729166667,5.733333333,5.7375,5.741666667,5.745833333,5.75,5.754166667,5.758333333,5.7625,5.766666667,5.770833333,5.775,5.779166667,5.783333333,5.7875,5.791666667,5.795833333,5.8,5.804166667,5.808333333,5.8125,5.816666667,5.820833333,5.825,5.829166667,5.833333333,5.8375,5.841666667,5.845833333,5.85,5.854166667,5.858333333,5.8625,5.866666667,5.870833333,5.875,5.879166667,5.883333333,5.8875,5.891666667,5.895833333,5.9,5.904166667,5.908333333,5.9125,5.916666667,5.920833333,5.925,5.929166667,5.933333333,5.9375,5.941666667,5.945833333,5.95,5.954166667,5.958333333,5.9625,5.966666667,5.970833333,5.975,5.979166667,5.983333333,5.9875,5.991666667,5.995833333,6,6.004166667,6.008333333,6.0125,6.016666667,6.020833333,6.025,6.029166667,6.033333333,6.0375,6.041666667,6.045833333,6.05,6.054166667,6.058333333,6.0625,6.066666667,6.070833333,6.075,6.079166667,6.083333333,6.0875,6.091666667,6.095833333,6.1,6.104166667,6.108333333,6.1125,6.116666667,6.120833333,6.125,6.129166667,6.133333333,6.1375,6.141666667,6.145833333,6.15,6.154166667,6.158333333,6.1625,6.166666667,6.170833333,6.175,6.179166667,6.183333333,6.1875,6.191666667,6.195833333,6.2,6.204166667,6.208333333,6.2125,6.216666667,6.220833333,6.225,6.229166667,6.233333333,6.2375,6.241666667,6.245833333,6.25,6.254166667,6.258333333,6.2625,6.266666667,6.270833333,6.275,6.279166667,6.283333333,6.2875,6.291666667,6.295833333,6.3,6.304166667,6.308333333,6.3125,6.316666667,6.320833333,6.325,6.329166667,6.333333333,6.3375,6.341666667,6.345833333,6.35,6.354166667,6.358333333,6.3625,6.366666667,6.370833333,6.375,6.379166667,6.383333333,6.3875,6.391666667,6.395833333,6.4,6.404166667,6.408333333,6.4125,6.416666667,6.420833333,6.425,6.429166667,6.433333333,6.4375,6.441666667,6.445833333,6.45,6.454166667,6.458333333,6.4625,6.466666667,6.470833333,6.475,6.479166667,6.483333333,6.4875,6.491666667,6.495833333,6.5,6.504166667,6.508333333,6.5125,6.516666667,6.520833333,6.525,6.529166667,6.533333333,6.5375,6.541666667,6.545833333,6.55,6.554166667,6.558333333,6.5625,6.566666667,6.570833333,6.575,6.579166667,6.583333333,6.5875,6.591666667,6.595833333,6.6,6.604166667,6.608333333,6.6125,6.616666667,6.620833333,6.625,6.629166667,6.633333333,6.6375,6.641666667,6.645833333,6.65,6.654166667,6.658333333,6.6625,6.666666667,6.670833333,6.675,6.679166667,6.683333333,6.6875,6.691666667,6.695833333,6.7,6.704166667,6.708333333,6.7125,6.716666667,6.720833333,6.725,6.729166667,6.733333333,6.7375,6.741666667,6.745833333,6.75,6.754166667,6.758333333,6.7625,6.766666667,6.770833333,6.775,6.779166667,6.783333333,6.7875,6.791666667,6.795833333,6.8,6.804166667,6.808333333,6.8125,6.816666667,6.820833333,6.825,6.829166667,6.833333333,6.8375,6.841666667,6.845833333,6.85,6.854166667,6.858333333,6.8625,6.866666667,6.870833333,6.875,6.879166667,6.883333333,6.8875,6.891666667,6.895833333,6.9,6.904166667,6.908333333,6.9125,6.916666667,6.920833333,6.925,6.929166667,6.933333333,6.9375,6.941666667,6.945833333,6.95,6.954166667,6.958333333,6.9625,6.966666667,6.970833333,6.975,6.979166667,6.983333333,6.9875,6.991666667,6.995833333,7,7.004166667,7.008333333,7.0125,7.016666667,7.020833333,7.025,7.029166667,7.033333333,7.0375,7.041666667,7.045833333,7.05,7.054166667,7.058333333,7.0625,7.066666667,7.070833333,7.075,7.079166667,7.083333333,7.0875,7.091666667,7.095833333,7.1,7.104166667,7.108333333,7.1125,7.116666667,7.120833333,7.125,7.129166667,7.133333333,7.1375,7.141666667,7.145833333,7.15,7.154166667,7.158333333,7.1625,7.166666667,7.170833333,7.175,7.179166667,7.183333333,7.1875,7.191666667,7.195833333,7.2,7.204166667,7.208333333,7.2125,7.216666667,7.220833333,7.225,7.229166667,7.233333333,7.2375,7.241666667,7.245833333,7.25,7.254166667,7.258333333,7.2625,7.266666667,7.270833333,7.275,7.279166667,7.283333333,7.2875,7.291666667,7.295833333,7.3,7.304166667,7.308333333,7.3125,7.316666667,7.320833333,7.325,7.329166667,7.333333333,7.3375,7.341666667,7.345833333,7.35,7.354166667,7.358333333,7.3625,7.366666667,7.370833333,7.375,7.379166667,7.383333333,7.3875,7.391666667,7.395833333,7.4,7.404166667,7.408333333,7.4125,7.416666667,7.420833333,7.425,7.429166667,7.433333333,7.4375,7.441666667,7.445833333,7.45,7.454166667,7.458333333,7.4625,7.466666667,7.470833333,7.475,7.479166667,7.483333333,7.4875,7.491666667,7.495833333,7.5,7.504166667,7.508333333,7.5125,7.516666667,7.520833333,7.525,7.529166667,7.533333333,7.5375,7.541666667,7.545833333,7.55,7.554166667,7.558333333,7.5625,7.566666667,7.570833333,7.575,7.579166667,7.583333333,7.5875,7.591666667,7.595833333,7.6,7.604166667,7.608333333,7.6125,7.616666667,7.620833333,7.625,7.629166667,7.633333333,7.6375,7.641666667,7.645833333,7.65,7.654166667,7.658333333,7.6625,7.666666667,7.670833333,7.675,7.679166667,7.683333333,7.6875,7.691666667,7.695833333,7.7,7.704166667,7.708333333,7.7125,7.716666667,7.720833333,7.725,7.729166667,7.733333333,7.7375,7.741666667,7.745833333,7.75,7.754166667,7.758333333,7.7625,7.766666667,7.770833333,7.775,7.779166667,7.783333333,7.7875,7.791666667,7.795833333,7.8,7.804166667,7.808333333,7.8125,7.816666667,7.820833333,7.825,7.829166667,7.833333333,7.8375,7.841666667,7.845833333,7.85,7.854166667,7.858333333,7.8625,7.866666667,7.870833333,7.875,7.879166667,7.883333333,7.8875,7.891666667,7.895833333,7.9,7.904166667,7.908333333,7.9125,7.916666667,7.920833333,7.925,7.929166667,7.933333333,7.9375,7.941666667,7.945833333,7.95,7.954166667,7.958333333,7.9625,7.966666667,7.970833333,7.975,7.979166667,7.983333333,7.9875,7.991666667,7.995833333,8,8.004166667,8.008333333,8.0125,8.016666667,8.020833333,8.025,8.029166667,8.033333333,8.0375,8.041666667,8.045833333,8.05,8.054166667,8.058333333,8.0625,8.066666667,8.070833333,8.075,8.079166667,8.083333333,8.0875];

			tones = [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100];
			trends = [[25,35,42,10,4,20,35], [55,20,12,68,90,50,60], [20,54,32,45,93,20,30], ["4/3","4/4","4/5","4/6","4/7","4/8","4/9"]];
			lastSleepStates = [0.25*secondsPerReading*sleepState.length,0.50*secondsPerReading*sleepState.length,0.25*secondsPerReading*sleepState.length];
			//alert('states'+lastSleepStates);
			// fakeAngles = [];
			// var possibleStates = [1,1,2,2,4,4,6];
			// for (i = 0; i < sleepState.length ; i++){
				// fakeAngles.push(possibleStates[Math.round(Math.random()*6)]);
			// }
			
			sleepState2 = [99.97,100,99.97,99.87,99.7,99.46,99.16,98.79,98.36,97.86,97.3,96.67,95.98,95.23,94.42,93.55,92.62,91.64,90.59,89.5,88.35,87.15,85.9,84.61,83.26,81.88,80.45,78.98,77.48,75.93,74.36,72.75,71.11,69.45,67.76,66.05,64.32,62.58,60.82,59.04,57.26,55.46,53.67,51.87,50.07,48.27,46.48,44.69,42.92,41.16,39.41,37.68,35.97,34.28,32.62,30.98,29.38,27.8,26.26,24.75,23.28,21.86,20.47,19.13,17.83,16.58,15.38,14.23,13.14,12.1,11.11,10.18,9.31,8.5,7.75,7.06,6.43,5.87,5.37,4.94,4.57,4.27,4.04,3.87,3.77,3.73,3.58,3.43,3.27,3.17,3.07,2.97,2.86,2.76,2.66,2.56,2.45,2.35,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.35,2.4,2.45,2.51,2.56,2.61,2.66,2.71,2.76,2.81,2.86,2.91,2.97,3.02,3.07,3.12,3.22,3.32,3.43,3.53,3.63,3.73,3.84,3.94,4.04,4.14,4.24,4.35,4.4,4.45,4.5,4.6,4.76,4.91,5.06,5.22,5.37,5.52,5.68,5.83,5.98,6.14,6.29,6.44,6.6,6.75,6.9,7.06,7.21,7.36,7.52,7.67,7.82,7.98,8.13,8.28,8.39,8.49,8.59,8.69,8.8,8.9,9,9.1,9.2,9.31,9.41,9.51,9.61,9.72,9.82,9.92,10.02,10.12,10.23,10.33,10.43,10.53,10.64,10.74,10.84,10.94,11.05,11.15,11.25,11.35,11.45,11.56,11.66,11.71,11.76,11.81,11.86,11.91,11.97,12.02,12.07,12.12,12.17,12.22,12.27,12.32,12.37,12.43,12.48,12.53,12.58,12.63,12.68,12.73,12.78,12.83,12.89,12.94,12.99,13.04,13.09,13.09,13.09,13.09,13.09,13.09,13.09,13.09,13.09,13.09,13.09,13.09,13.09,13.14,13.19,13.24,13.24,13.19,13.14,13.09,13.04,12.99,12.94,12.89,12.83,12.78,12.73,12.68,12.63,12.58,12.53,12.48,12.43,12.37,12.32,12.27,12.22,12.17,12.12,12.07,12.02,11.97,11.91,11.86,11.81,11.76,11.71,11.66,11.61,11.56,11.51,11.45,11.4,11.35,11.3,11.25,11.2,11.2,11.2,11.25,11.3,11.3,11.25,11.2,11.15,11.1,11.05,10.99,10.94,10.89,10.84,10.79,10.74,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.69,10.74,10.84,10.94,11.05,11.15,11.25,11.35,11.45,11.56,11.66,11.76,11.86,11.97,12.07,12.17,12.27,12.37,12.48,12.58,12.68,12.78,12.83,12.89,12.89,12.89,12.89,12.89,12.89,12.89,12.89,12.89,12.89,12.89,12.94,13.04,13.14,13.24,13.35,13.45,13.55,13.65,13.76,13.86,13.96,14.06,14.16,14.27,14.37,14.47,14.52,14.57,14.57,14.57,14.68,14.83,14.98,15.14,15.29,15.44,15.6,15.75,15.9,16.06,16.21,16.36,16.52,16.67,16.82,16.98,17.13,17.28,17.44,17.59,17.69,17.79,17.9,18.05,18.2,18.36,18.51,18.66,18.82,18.97,19.12,19.33,19.58,19.89,20.25,20.66,21.12,21.63,22.19,22.81,23.42,24.08,24.75,25.47,26.18,26.95,27.72,28.53,29.3,30.02,30.73,31.45,32.16,32.83,33.44,34.06,34.67,35.28,35.9,36.51,37.18,37.84,38.5,39.17,39.83,40.5,41.16,41.83,42.49,43.21,43.92,44.69,45.46,46.17,46.89,47.61,48.32,49.04,49.75,50.47,51.19,51.85,52.46,53.08,53.69,54.31,54.92,55.58,56.25,56.91,57.58,58.29,59.01,59.73,60.39,61.05,61.67,62.28,62.9,63.51,64.12,64.69,65.25,65.81,66.32,66.78,67.19,67.55,67.86,68.11,68.32,68.47,68.57,68.67,68.73,68.78,68.78,68.78,68.73,68.67,68.57,68.52,68.47,68.42,68.32,68.21,68.11,68.01,67.91,67.8,67.7,67.6,67.45,67.19,66.88,66.53,66.12,65.66,65.15,64.58,63.97,63.36,62.69,62.03,61.31,60.59,59.83,59.06,58.24,57.42,56.61,55.79,54.97,54.15,53.38,52.67,51.95,51.24,50.52,49.81,49.04,48.22,47.4,46.58,45.71,44.85,43.98,43.16,42.39,41.62,40.86,40.09,39.32,38.56,37.84,37.12,36.41,35.69,34.98,34.26,33.54,32.83,32.11,31.4,30.68,29.97,29.25,28.53,27.77,27,26.23,25.47,24.65,23.83,23.01,22.24,21.48,20.76,20.04,19.33,18.61,17.9,17.18,16.47,15.75,15.08,14.52,14.01,13.55,13.14,12.78,12.48,12.22,12.02,11.81,11.66,11.51,11.4,11.3,11.25,11.2,11.2,11.25,11.35,11.45,11.56,11.66,11.76,11.86,11.97,12.07,12.17,12.27,12.37,12.53,12.68,12.83,12.99,13.14,13.3,13.4,13.45,13.5,13.55,13.6,13.65,13.7,13.76,13.81,13.86,13.91,13.96,14.01,14.06,14.11,14.16,14.22,14.27,14.32,14.37,14.42,14.52,14.62,14.73,14.83,14.98,15.14,15.29,15.39,15.44,15.49,15.54,15.6,15.65,15.7,15.75,15.8,15.85,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.9,15.85,15.75,15.65,15.54,15.44,15.34,15.24,15.14,15.03,14.93,14.83,14.73,14.57,14.42,14.27,14.11,13.96,13.81,13.65,13.5,13.35,13.19,13.04,12.89,12.73,12.58,12.43,12.27,12.07,11.81,11.56,11.3,11.05,10.79,10.53,10.28,10.02,9.77,9.51,9.26,9,8.74,8.49,8.23,7.98,7.72,7.52,7.36,7.21,7.06,6.9,6.75,6.6,6.44,6.29,6.14,5.98,5.83,5.68,5.52,5.37,5.22,5.06,4.91,4.76,4.6,4.45,4.3,4.14,3.99,3.84,3.68,3.53,3.37,3.22,3.07,2.91,2.76,2.61,2.51,2.45,2.4,2.35,2.3,2.25,2.25,2.3,2.35,2.4,2.45,2.51,2.61,2.71,2.81,2.91,3.02,3.12,3.22,3.32,3.43,3.53,3.68,3.89,4.09,4.3,4.5,4.7,4.91,5.11,5.32,5.52,5.73,5.93,6.14,6.34,6.55,6.75,6.95,7.16,7.36,7.57,7.77,7.98,8.23,8.49,8.74,9,9.26,9.51,9.77,10.02,10.28,10.53,10.79,11.1,11.4,11.71,12.02,12.32,12.63,12.94,13.24,13.55,13.86,14.16,14.47,14.78,15.08,15.39,15.7,16.01,16.36,16.67,16.93,17.18,17.44,17.69,17.95,18.2,18.41,18.61,18.82,19.02,19.23,19.38,19.53,19.69,19.89,20.1,20.3,20.51,20.71,20.91,21.12,21.32,21.53,21.73,21.94,22.14,22.35,22.5,22.6,22.7,22.81,22.91,23.01,23.11,23.16,23.27,23.37,23.47,23.57,23.62,23.68,23.78,23.88,23.98,24.14,24.29,24.44,24.6,24.75,24.9,25.06,25.21,25.36,25.52,25.62,25.72,25.82,25.93,26.03,26.13,26.23,26.33,26.44,26.54,26.64,26.74,26.85,26.95,27.05,27.15,27.25,27.25,27.25,27.25,27.25,27.25,27.25,27.25,27.25,27.25,27.25,27.25,27.2,27.15,27.1,27.05,27,26.9,26.79,26.69,26.59,26.49,26.39,26.28,26.18,26.08,25.98,25.87,25.77,25.62,25.52,25.47,25.41,25.36,25.31,25.26,25.21,25.21,25.16,25.11,25.06,25,25,25,24.95,24.85,24.7,24.49,24.29,24.08,23.88,23.68,23.47,23.27,23.06,22.86,22.65,22.45,22.24,22.04,21.83,21.63,21.43,21.22,21.02,20.81,20.56,20.3,20.04,19.79,19.53,19.28,18.97,18.66,18.36,18,17.64,17.28,16.93,16.57,16.21,15.85,15.49,15.14,14.78,14.47,14.16,13.86,13.55,13.24,12.94,12.63,12.32,12.02,11.71,11.4,11.1,10.79,10.48,10.18,9.87,9.56,9.31,9.05,8.8,8.54,8.28,8.08,7.87,7.67,7.47,7.26,7.06,6.85,6.65,6.44,6.24,6.09,5.98,5.88,5.78,5.68,5.57,5.47,5.37,5.27,5.22,5.16,5.11,5.06,5.01,4.96,4.91,4.86,4.81,4.76,4.7,4.65,4.6,4.6,4.6,4.6,4.6,4.6,4.6,4.65,4.7,4.81,4.96,5.11,5.27,5.42,5.57,5.73,5.88,6.03,6.19,6.34,6.49,6.65,6.8,6.95,7.11,7.26,7.41,7.57,7.72,7.87,8.03,8.18,8.33,8.49,8.64,8.8,8.95,9.1,9.26,9.41,9.56,9.72,9.82,9.92,10.02,10.12,10.23,10.33,10.43,10.53,10.64,10.74,10.79,10.84,10.89,10.94,10.99,11.05,11.1,11.15,11.2,11.2,11.2,11.2,11.2,11.2,11.2,11.2,11.2,11.2,11.15,11.1,11.05,10.99,10.94,10.89,10.84,10.79,10.74,10.69,10.58,10.48,10.43,10.43,10.43,10.43,10.43,10.43,10.43,10.38,10.33,10.28,10.23,10.18,10.12,10.12,10.18,10.23,10.28,10.33,10.38,10.43,10.48,10.53,10.58,10.64,10.69,10.74,10.79,10.84,10.89,10.94,10.99,11.05,11.1,11.15,11.2,11.25,11.3,11.35,11.4,11.45,11.51,11.56,11.61,11.66,11.71,11.76,11.81,11.86,11.91,11.97,12.02,12.07,12.12,12.17,12.22,12.27,12.32,12.37,12.43,12.48,12.58,12.78,12.99,13.19,13.4,13.6,13.81,14.01,14.22,14.42,14.62,14.88,15.14,15.34,15.49,15.65,15.8,15.95,16.11,16.26,16.47,16.67,16.87,17.08,17.28,17.49,17.64,17.74,17.85,18,18.15,18.31,18.46,18.61,18.77,18.92,19.12,19.33,19.53,19.74,19.94,20.1,20.2,20.3,20.4,20.51,20.61,20.71,20.81,20.91,21.02,21.12,21.22,21.32,21.37,21.37,21.43,21.48,21.53,21.58,21.63,21.73,21.83,21.94,22.04,22.14,22.24,22.35,22.45,22.55,22.65,22.75,22.86,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.91,22.86,22.7,22.6,22.5,22.4,22.29,22.19,22.09,21.94,21.78,21.63,21.48,21.32,21.22,21.17,21.12,21.12,21.17,21.22,21.27,21.37,21.48,21.58,21.68,21.78,21.89,22.04,22.24,22.4,22.5,22.6,22.7,22.81,22.86,22.91,22.96,22.96,22.96,22.96,22.96,22.96,22.96,22.96,22.96,22.96,22.96,22.96,22.96,22.96,22.96,23.01,23.11,23.22,23.32,23.42,23.52,23.57,23.68,23.78,23.88,23.98,24.03,24.14,24.24,24.34,24.44,24.54,24.65,24.75,24.85,24.95,25.06,25.16,25.31,25.57,25.77,25.98,26.23,26.49,26.74,27,27.25,27.51,27.77,28.02,28.28,28.53,28.79,29.04,29.25,29.4,29.56,29.71,29.81,29.91,30.02,30.12,30.22,30.32,30.43,30.58,30.73,30.94,31.09,31.24,31.4,31.55,31.7,31.86,32.06,32.27,32.47,32.68,32.88,33.08,33.29,33.49,33.65,33.75,33.85,33.95,34.06,34.16,34.21,34.21,34.21,34.21,34.21,34.21,34.26,34.26,34.26,34.26,34.31,34.41,34.46,34.52,34.57,34.62,34.67,34.72,34.77,34.82,34.87,34.93,34.98,35.03,35.03,35.03,35.03,34.98,34.87,34.72,34.57,34.41,34.26,34.11,33.95,33.75,33.54,33.34,33.14,32.93,32.68,32.42,32.16,31.91,31.65,31.4,31.14,30.89,30.63,30.37,30.07,29.76,29.4,29.15,28.89,28.58,28.28,27.97,27.66,27.36,27.05,26.74,26.44,26.13,25.82,25.52,25.21,24.95,24.75,24.54,24.34,24.14,23.93,23.73,23.52,23.32,23.11,22.91,22.65,22.4,22.14,21.89,21.63,21.32,21.02,20.71,20.4,20.1,19.79,19.48,19.18,18.87,18.56,18.26,17.95,17.64,17.33,17.03,16.72,16.36,16.01,15.7,15.44,15.19,14.93,14.68,14.42,14.16,13.96,13.81,13.7,13.55,13.4,13.3,13.19,13.09,12.99,12.89,12.78,12.68,12.58,12.48,12.37,12.27,12.17,12.12,12.02,11.91,11.86,11.81,11.76,11.71,11.66,11.61,11.56,11.51,11.45,11.4,11.35,11.3,11.25,11.2,11.15,11.1,11.05,10.99,10.94,10.89,10.84,10.79,10.74,10.74,10.74,10.74,10.69,10.64,10.58,10.53,10.48,10.43,10.38,10.33,10.28,10.23,10.18,10.18,10.23,10.28,10.33,10.38,10.43,10.48,10.58,10.69,10.79,10.89,10.99,11.1,11.2,11.3,11.4,11.51,11.56,11.56,11.61,11.66,11.71,11.76,11.81,11.86,11.91,11.97,12.02,12.07,12.12,12.17,12.22,12.27,12.32,12.37,12.43,12.48,12.58,12.73,12.89,13.04,13.19,13.35,13.5,13.65,13.81,13.96,14.11,14.27,14.42,14.57,14.73,14.88,15.03,15.19,15.34,15.49,15.65,15.8,15.95,16.11,16.31,16.62,16.93,17.23,17.54,17.85,18.15,18.51,18.87,19.23,19.58,19.99,20.35,20.66,20.97,21.27,21.58,21.89,22.19,22.5,22.81,23.11,23.42,23.73,24.03,24.34,24.65,24.95,25.26,25.57,25.87,26.18,26.49,26.79,27.1,27.41,27.72,28.02,28.33,28.64,28.89,29.1,29.3,29.5,29.71,29.91,30.12,30.32,30.53,30.68,30.78,30.89,30.99,31.09,31.19,31.29,31.4,31.5,31.6,31.7,31.81,31.91,32.01,32.11,32.21,32.32,32.42,32.52,32.62,32.73,32.83,32.93,33.03,33.08,33.08,33.08,33.08,33.03,32.93,32.83,32.68,32.52,32.37,32.21,32.01,31.75,31.45,31.14,30.83,30.53,30.22,29.91,29.61,29.3,28.99,28.69,28.38,28.07,27.77,27.46,27.15,26.79,26.39,25.98,25.57,25.16,24.75,24.34,23.88,23.42,22.96,22.5,21.99,21.53,21.12,20.71,20.3,19.89,19.48,19.07,18.66,18.26,17.85,17.44,17.03,16.62,16.21,15.8,15.39,14.98,14.57,14.16,13.76,13.35,12.94,12.53,12.12,11.71,11.3,10.89,10.48,10.07,9.66,9.26,8.85,8.44,8.03,7.62,7.21,6.8,6.44,6.14,5.83,5.52,5.22,4.91,4.6,4.35,4.19,4.14,4.09,4.09,4.09,4.09,4.09,4.09,4.09,4.09,4.09,4.09,4.09,4.09,4.09,4.14,4.3,4.5,4.7,4.91,5.11,5.32,5.52,5.83,6.19,6.55,6.9,7.36,7.82,8.28,8.8,9.31,9.82,10.38,10.94,11.56,12.22,12.94,13.65,14.37,15.08,15.8,16.52,17.23,17.95,18.66,19.38,20.1,20.81,21.53,22.24,23.01,23.78,24.54,25.31,26.08,26.85,27.61,28.38,29.15,29.91,30.68,31.45,32.21,32.98,33.75,34.52,35.28,36.05,36.82,37.64,38.45,39.22,39.99,40.7,41.42,42.08,42.75,43.41,44.08,44.74,45.46,46.17,46.89,47.66,48.48,49.29,50.11,50.88,51.6,52.31,53.03,53.74,54.51,55.28,56.04,56.76,57.42,58.09,58.75,59.32,59.83,60.29,60.7,61.05,61.41,61.72,62.03,62.28,62.49,62.64,62.79,62.95,63.1,63.25,63.41,63.51,63.56,63.61,63.66,63.71,63.77,63.82,63.87,63.82,63.71,63.61,63.51,63.36,63.2,63.05,62.84,62.64,62.44,62.18,61.92,61.62,61.26,60.85,60.44,60.03,59.67,59.32,58.91,58.5,58.09,57.63,57.17,56.71,56.25,55.84,55.43,54.97,54.51,54,53.49,52.98,52.41,51.85,51.29,50.73,50.16,49.6,49.04,48.53,48.02,47.45,46.89,46.33,45.77,45.2,44.59,43.98,43.41,42.85,42.34,41.83,41.37,40.91,40.45,39.99,39.53,39.02,38.5,37.99,37.43,36.82,36.2,35.59,35.03,34.52,34,33.49,32.98,32.42,31.86,31.29,30.78,30.32,29.86,29.4,28.79,28.18,27.56,27,26.44,25.87,25.41,25.36,25.41,25.56,25.81,26.15,26.59,27.12,27.73,28.44,29.23,30.09,31.03,32.04,33.11,34.24,35.42,36.65,37.91,39.21,40.53,41.87,43.22,44.58,45.93,47.27,48.59,49.88,51.15,52.37,53.55,54.68,55.76,56.76,57.7,58.57,59.36,60.06,60.68,61.21,61.65,61.99,62.24,62.38];
			sleepState3 = [99.96,100,99.96,99.84,99.63,99.35,98.98,98.54,98.01,97.41,96.73,95.97,95.14,94.23,93.26,92.21,91.1,89.92,88.67,87.36,86,84.57,83.1,81.57,79.99,78.36,76.69,74.98,73.23,71.45,69.63,67.79,65.92,64.02,62.11,60.19,58.25,56.31,54.36,52.4,50.45,48.51,46.57,44.64,42.73,40.84,38.97,37.13,35.31,33.53,31.78,30.07,28.4,26.77,25.19,23.66,22.18,20.76,19.39,18.09,16.84,15.66,14.55,13.5,12.52,11.62,10.79,10.03,9.35,8.75,8.22,7.78,7.41,7.13,6.92,6.8,6.76,6.48,6.2,5.92,5.64,5.36,5.09,4.81,4.53,4.25,3.97,3.69,3.41,3.2,3,2.86,2.72,2.58,2.44,2.3,2.16,2.02,1.88,1.74,1.6,1.46,1.32,1.18,1.04,0.91,0.77,0.63,0.49,0.35,0.21,0.07,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.07,0.14,0.21,0.28,0.35,0.42,0.49,0.56,0.63,0.7,0.77,0.84,0.91,0.98,1.04,1.11,1.18,1.25,1.32,1.39,1.46,1.53,1.6,1.67,1.74,1.81,1.88,1.95,2.02,2.09,2.16,2.23,2.3,2.37,2.44,2.51,2.58,2.65,2.72,2.79,2.86,2.93,3,3.07,3.13,3.2,3.27,3.34,3.41,3.48,3.55,3.62,3.69,3.76,3.83,3.9,3.97,4.04,4.11,4.18,4.25,4.32,4.39,4.46,4.53,4.6,4.67,4.74,4.81,4.88,4.95,5.02,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.16,5.22,5.29,5.36,5.43,5.5,5.57,5.64,5.71,5.78,5.85,5.92,5.99,6.06,6.13,6.2,6.27,6.34,6.41,6.48,6.55,6.62,6.69,6.76,6.83,6.9,6.97,7.04,7.11,7.18,7.25,7.31,7.38,7.45,7.52,7.59,7.66,7.73,7.8,7.87,7.94,8.01,8.08,8.15,8.22,8.29,8.36,8.43,8.5,8.57,8.64,8.71,8.78,8.85,8.92,8.99,9.06,9.13,9.2,9.27,9.34,9.4,9.47,9.54,9.61,9.68,9.75,9.82,9.89,9.96,10.03,10.1,10.17,10.17,10.17,10.17,10.17,10.17,10.17,10.17,10.17,10.17,10.17,10.17,10.17,10.17,10.24,10.38,10.52,10.66,10.8,10.94,11.08,11.22,11.36,11.49,11.63,11.77,11.91,12.05,12.19,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.26,12.33,12.47,12.61,12.75,12.89,13.03,13.17,13.31,13.45,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.52,13.58,13.72,13.86,14,14.14,14.28,14.42,14.56,14.7,14.84,14.98,15.12,15.26,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.33,15.26,15.12,14.98,14.84,14.7,14.56,14.42,14.28,14.14,14,13.86,13.72,13.58,13.45,13.31,13.17,13.03,12.89,12.75,12.61,12.54,12.47,12.4,12.33,12.26,12.19,12.12,12.05,11.91,11.7,11.49,11.29,11.08,10.87,10.66,10.45,10.24,10.1,10.03,9.96,9.89,9.82,9.75,9.68,9.61,9.54,9.47,9.4,9.34,9.27,9.2,9.13,9.06,8.99,8.92,8.85,8.78,8.71,8.64,8.57,8.5,8.43,8.36,8.29,8.22,8.15,8.08,8.01,7.94,7.87,7.8,7.73,7.66,7.59,7.52,7.45,7.38,7.31,7.25,7.18,7.11,7.04,6.97,6.9,6.83,6.76,6.69,6.62,6.55,6.48,6.41,6.34,6.27,6.13,5.99,5.85,5.71,5.57,5.43,5.29,5.16,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.09,5.02,4.95,4.88,4.81,4.74,4.67,4.6,4.53,4.46,4.39,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.32,4.39,4.46,4.53,4.6,4.67,4.74,4.81,4.88,4.95,5.02,5.09,5.16,5.22,5.29,5.36,5.43,5.5,5.64,5.78,5.92,6.06,6.2,6.34,6.48,6.62,6.76,6.9,7.04,7.18,7.31,7.45,7.59,7.73,7.94,8.15,8.36,8.57,8.78,8.99,9.2,9.4,9.61,9.82,10.03,10.17,10.31,10.45,10.59,10.73,10.87,11.01,11.15,11.29,11.43,11.56,11.7,11.84,11.98,12.12,12.26,12.4,12.54,12.68,12.82,12.96,13.1,13.24,13.38,13.52,13.65,13.86,14.07,14.21,14.28,14.35,14.42,14.49,14.56,14.63,14.7,14.77,14.84,14.91,14.98,15.05,15.12,15.19,15.26,15.33,15.47,15.54,15.6,15.67,15.74,15.81,15.88,15.95,16.02,16.09,16.16,16.23,16.23,16.23,16.23,16.23,16.23,16.23,16.23,16.3,16.37,16.44,16.51,16.58,16.65,16.72,16.79,16.86,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,16.93,17,17.14,17.28,17.35,17.42,17.56,17.69,17.83,17.97,18.11,18.25,18.39,18.53,18.74,19.02,19.3,19.58,19.85,20.13,20.41,20.69,21.04,21.32,21.6,21.87,22.15,22.43,22.71,22.99,23.27,23.55,23.76,23.96,24.17,24.45,24.73,25.01,25.29,25.64,25.99,26.33,26.61,26.89,27.17,27.45,27.73,28.01,28.28,28.56,28.84,29.05,29.33,29.61,29.89,30.16,30.44,30.79,31.14,31.49,31.84,32.25,32.67,33.09,33.51,33.93,34.34,34.76,35.18,35.6,35.95,36.3,36.64,36.99,37.27,37.48,37.69,37.9,38.11,38.32,38.52,38.73,38.94,39.15,39.36,39.57,39.78,39.92,39.99,40.06,40.13,40.2,40.27,40.34,40.41,40.41,40.41,40.41,40.41,40.41,40.41,40.41,40.34,40.2,40.06,39.99,39.92,39.85,39.78,39.71,39.64,39.57,39.43,39.29,39.15,38.94,38.66,38.39,38.11,37.83,37.55,37.27,36.99,36.64,36.37,36.09,35.81,35.53,35.25,34.97,34.62,34.28,33.93,33.58,33.16,32.74,32.32,31.91,31.49,31.07,30.58,30.1,29.61,29.19,28.77,28.35,27.94,27.52,27.1,26.68,26.26,25.85,25.43,25.01,24.59,24.17,23.76,23.34,22.85,22.36,21.87,21.39,20.83,20.27,19.72,19.16,18.6,18.04,17.49,16.93,16.37,15.81,15.26,14.7,14.14,13.65,13.24,12.82,12.4,11.98,11.56,11.15,10.73,10.31,9.89,9.47,9.06,8.64,8.29,8.01,7.73,7.45,7.18,6.9,6.62,6.34,6.13,5.92,5.71,5.5,5.29,5.09,4.88,4.67,4.46,4.25,4.04,3.83,3.62,3.41,3.2,3,2.79,2.65,2.51,2.37,2.23,2.09,1.95,1.81,1.67,1.53,1.39,1.25,1.11,0.98,0.84,0.7,0.56,0.42,0.28,0.21,0.14,0.07,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.07,0.14,0.21,0.28,0.35,0.42,0.49,0.56,0.63,0.7,0.77,0.84,0.91,0.98,1.04,1.11,1.25,1.39,1.53,1.67,1.81,1.95,2.09,2.23,2.37,2.51,2.65,2.79,2.93,3.07,3.2,3.34,3.48,3.62,3.76,3.9,4.04,4.18,4.32,4.46,4.6,4.81,5.02,5.22,5.43,5.64,5.85,6.06,6.27,6.48,6.69,6.9,7.11,7.31,7.52,7.73,7.94,8.22,8.5,8.78,9.06,9.34,9.61,9.89,10.17,10.45,10.73,11.01,11.29,11.56,11.84,12.12,12.4,12.61,12.82,13.1,13.38,13.65,13.93,14.21,14.49,14.77,15.05,15.33,15.6,15.88,16.16,16.44,16.72,16.93,17.14,17.35,17.63,17.97,18.32,18.67,19.02,19.37,19.72,20.06,20.41,20.69,20.97,21.25,21.53,21.81,22.08,22.36,22.64,22.92,23.2,23.48,23.76,24.03,24.24,24.45,24.66,24.8,24.94,25.08,25.22,25.36,25.5,25.64,25.78,25.92,26.05,26.19,26.33,26.47,26.54,26.61,26.68,26.75,26.82,26.89,26.96,27.03,27.1,27.17,27.24,27.31,27.31,27.31,27.31,27.31,27.31,27.31,27.24,27.17,27.1,27.03,26.96,26.89,26.82,26.75,26.68,26.61,26.47,26.33,26.19,26.05,25.92,25.78,25.64,25.43,25.15,24.87,24.59,24.31,24.03,23.76,23.48,23.2,22.99,22.78,22.5,22.22,21.94,21.67,21.39,21.11,20.83,20.55,20.27,19.99,19.72,19.44,19.16,18.88,18.67,18.46,18.25,17.97,17.63,17.28,16.93,16.58,16.23,15.88,15.54,15.19,14.84,14.49,14.14,13.86,13.58,13.31,13.03,12.75,12.47,12.19,11.91,11.63,11.36,11.15,11.01,10.87,10.8,10.8,10.8,10.8,10.8,10.8,10.8,10.8,10.8,10.8,10.8,10.8,10.8,10.87,10.94,11.01,11.08,11.15,11.22,11.29,11.36,11.43,11.49,11.56,11.63,11.7,11.77,11.84,11.98,12.12,12.26,12.47,12.68,12.89,13.1,13.31,13.52,13.72,13.93,14.14,14.35,14.56,14.77,14.98,15.26,15.54,15.81,16.09,16.44,16.93,17.49,18.04,18.6,19.16,19.72,20.27,20.83,21.39,21.94,22.5,22.99,23.48,23.96,24.45,24.94,25.43,25.92,26.4,26.89,27.38,27.87,28.28,28.7,29.05,29.33,29.61,29.89,30.16,30.44,30.72,31,31.28,31.56,31.84,32.12,32.39,32.67,32.95,33.16,33.37,33.58,33.79,34,34.21,34.41,34.62,34.83,35.04,35.25,35.39,35.53,35.53,35.46,35.39,35.32,35.25,35.18,35.11,35.04,34.97,34.9,34.83,34.76,34.69,34.62,34.55,34.48,34.34,34.21,34.07,33.93,33.79,33.58,33.3,33.02,32.74,32.46,32.19,31.91,31.56,31.21,30.86,30.51,30.16,29.82,29.47,29.12,28.77,28.42,28.08,27.73,27.38,27.03,26.75,26.47,26.12,25.78,25.43,25.08,24.73,24.31,23.83,23.34,22.85,22.36,21.87,21.39,20.9,20.41,19.92,19.44,19.02,18.6,18.18,17.76,17.35,16.93,16.51,16.09,15.67,15.26,14.84,14.49,14.14,13.86,13.65,13.45,13.24,13.03,12.82,12.61,12.4,12.19,11.98,11.77,11.56,11.36,11.15,10.94,10.73,10.52,10.31,10.1,9.89,9.68,9.47,9.27,9.06,8.85,8.64,8.43,8.22,8.08,7.94,7.8,7.66,7.52,7.38,7.25,7.11,6.97,6.83,6.69,6.55,6.41,6.27,6.06,5.85,5.78,5.71,5.64,5.57,5.5,5.5,5.57,5.64,5.71,5.78,5.85,5.92,5.99,6.06,6.13,6.2,6.27,6.34,6.41,6.48,6.55,6.62,6.69,6.76,6.83,6.9,6.9,6.9,6.9,6.9,6.9,6.9,6.9,6.9,6.9,6.9,6.9,6.97,7.04,7.11,7.18,7.25,7.31,7.38,7.45,7.52,7.59,7.66,7.73,7.8,7.87,7.94,8.01,8.08,8.15,8.22,8.29,8.36,8.43,8.5,8.57,8.64,8.78,8.92,9.06,9.2,9.34,9.47,9.61,9.75,9.89,10.03,10.17,10.31,10.52,10.73,10.94,11.15,11.36,11.56,11.77,11.98,12.19,12.4,12.61,12.82,13.03,13.24,13.45,13.65,13.86,14.07,14.28,14.49,14.7,14.91,15.12,15.33,15.54,15.81,16.09,16.3,16.51,16.72,16.93,17.14,17.35,17.56,17.76,17.97,18.11,18.25,18.39,18.53,18.67,18.81,18.95,19.09,19.23,19.37,19.51,19.65,19.78,19.92,20.06,20.2,20.34,20.48,20.62,20.76,20.9,21.04,21.18,21.32,21.46,21.53,21.67,21.87,22.01,22.15,22.29,22.43,22.57,22.71,22.85,22.99,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.13,23.27,23.41,23.55,23.69,23.83,24.03,24.24,24.45,24.66,24.87,25.08,25.29,25.5,25.71,25.92,26.12,26.26,26.4,26.54,26.68,26.82,26.96,27.1,27.24,27.38,27.52,27.66,27.8,27.94,28.08,28.21,28.35,28.49,28.63,28.77,28.91,29.05,29.19,29.33,29.47,29.61,29.75,29.89,30.03,30.16,30.3,30.44,30.58,30.72,30.86,30.93,30.93,31,31.07,31.14,31.21,31.28,31.35,31.42,31.49,31.56,31.63,31.7,31.77,31.84,31.91,31.98,32.05,32.12,32.19,32.25,32.32,32.32,32.25,32.19,32.12,32.05,31.98,31.77,31.49,31.21,30.93,30.65,30.37,30.1,29.82,29.54,29.26,29.05,28.91,28.77,28.63,28.49,28.35,28.21,28.08,27.94,27.8,27.66,27.52,27.31,27.03,26.75,26.47,26.19,25.85,25.43,25.01,24.59,24.17,23.76,23.41,23.13,22.85,22.64,22.5,22.36,22.22,22.08,21.94,21.81,21.67,21.53,21.39,21.25,21.11,21.04,21.04,21.04,21.11,21.25,21.39,21.53,21.67,21.87,22.15,22.5,22.85,23.2,23.62,24.03,24.45,24.87,25.29,25.71,26.12,26.61,27.1,27.59,28.08,28.56,29.12,29.75,30.37,31,31.63,32.25,32.88,33.51,34.14,34.76,35.39,36.02,36.64,37.27,37.9,38.52,39.15,39.78,40.41,41.03,41.66,42.29,43.05,43.89,44.72,45.56,46.4,47.3,48.28,49.25,50.23,51.2,52.18,53.08,53.92,54.76,55.52,56.22,56.92,57.61,58.31,59.01,59.7,60.4,61.1,61.79,62.49,63.19,63.81,64.37,64.93,65.42,65.83,66.25,66.67,67.09,67.44,67.71,67.92,68.13,68.34,68.41,68.41,68.41,68.34,68.2,68.06,67.92,67.71,67.51,67.3,67.09,66.88,66.67,66.46,66.25,65.97,65.62,65.28,64.86,64.37,63.88,63.4,62.91,62.35,61.72,61.03,60.33,59.63,58.87,58.1,57.4,56.78,56.15,55.52,54.83,54.06,53.29,52.53,51.76,50.99,50.23,49.46,48.7,47.93,47.16,46.4,45.63,44.86,44.1,43.33,42.57,41.8,41.03,40.27,39.5,38.73,37.97,37.2,36.43,35.67,34.9,34.14,33.3,32.46,31.63,30.79,29.96,29.12,28.28,27.45,26.61,25.78,24.94,24.17,23.48,22.78,22.15,21.6,21.04,20.48,19.92,19.37,18.81,18.25,17.69,17.14,16.58,16.02,15.6,15.26,14.91,14.63,14.42,14.28,14.14,14,13.93,13.93,14,14.07,14.14,14.28,14.42,14.49,14.49,14.49,14.49,14.49,14.56,14.7,14.91,15.12,15.33,15.54,15.74,15.95,16.16,16.37,16.58,16.79,17,17.21,17.42,17.63,17.83,18.04,18.25,18.46,18.67,18.88,19.09,19.23,19.3,19.37,19.44,19.58,19.72,19.85,19.99,20.13,20.27,20.41,20.55,20.69,20.83,20.97,21.11,21.25,21.39,21.53,21.67,21.81,21.94,22.08,22.22,22.36,22.5,22.64,22.78,22.92,23.06,23.13,23.2,23.27,23.34,23.48,23.62,23.76,23.9,24.03,24.17,24.31,24.45,24.59,24.73,24.87,25.01,25.15,25.29,25.43,25.57,25.71,25.78,25.78,25.78,25.78,25.78,25.78,25.78,25.71,25.64,25.57,25.5,25.43,25.29,25.15,25.01,24.87,24.73,24.59,24.45,24.31,24.17,23.9,23.69,23.55,23.41,23.31,23.27,23.31,23.42,23.61,23.88,24.22,24.64,25.12,25.67,26.29,26.97,27.71,28.5,29.35,30.24,31.18,32.15,33.16,34.2,35.26,36.34,37.44,38.54,39.64,40.75,41.84,42.92,43.98,45.02,46.03,47,47.94,48.83,49.68,50.47,51.21,51.89,52.51,53.06,53.55,53.96,54.3,54.57,54.76,54.88];
			sleepState4 = [99.96,100,99.96,99.84,99.63,99.34,98.97,98.52,98,97.39,96.7,95.94,95.11,94.2,93.22,92.17,91.05,89.87,88.62,87.32,85.95,84.53,83.06,81.53,79.96,78.35,76.69,75,73.27,71.51,69.72,67.9,66.07,64.22,62.35,60.47,58.59,56.7,54.81,52.92,51.04,49.18,47.32,45.49,43.67,41.89,40.12,38.4,36.7,35.04,33.43,31.86,30.34,28.86,27.44,26.08,24.77,23.52,22.34,21.22,20.17,19.19,18.29,17.45,16.69,16,15.4,14.87,14.42,14.05,13.76,13.56,13.43,13.39,13.31,13.23,13.14,13.06,12.98,12.89,12.81,12.73,12.64,12.48,12.31,12.23,12.15,12.06,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.98,11.9,11.81,11.73,11.65,11.56,11.48,11.4,11.31,11.23,11.15,11.06,10.98,10.9,10.81,10.73,10.65,10.56,10.48,10.4,10.32,10.23,10.15,10.07,9.98,9.9,9.82,9.73,9.65,9.57,9.48,9.4,9.32,9.23,9.15,9.07,8.98,8.98,8.98,8.9,8.82,8.73,8.65,8.57,8.57,8.57,8.57,8.57,8.65,8.73,8.82,8.9,8.98,9.07,9.15,9.23,9.32,9.4,9.48,9.57,9.65,9.73,9.82,9.9,9.98,10.07,10.15,10.15,10.15,10.15,10.15,10.15,10.15,10.15,10.23,10.32,10.4,10.48,10.56,10.65,10.73,10.81,10.9,10.98,11.06,11.15,11.23,11.31,11.4,11.48,11.56,11.65,11.73,11.81,11.9,11.98,12.06,12.15,12.23,12.31,12.39,12.48,12.56,12.64,12.73,12.81,12.89,12.98,13.06,13.14,13.23,13.31,13.39,13.48,13.56,13.64,13.73,13.73,13.73,13.73,13.73,13.64,13.56,13.48,13.39,13.39,13.48,13.56,13.64,13.73,13.81,13.89,13.98,14.06,14.14,14.22,14.31,14.39,14.47,14.56,14.72,14.89,15.06,15.22,15.39,15.47,15.56,15.64,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.72,15.81,15.89,15.97,16.05,16.14,16.22,16.3,16.39,16.47,16.55,16.64,16.72,16.8,16.89,16.97,17.05,17.14,17.14,17.05,16.97,16.89,16.8,16.72,16.64,16.55,16.47,16.39,16.3,16.22,16.14,16.05,15.97,15.89,15.81,15.81,15.81,15.81,15.89,15.97,16.05,16.14,16.3,16.47,16.64,16.8,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.89,16.97,17.05,17.14,17.22,17.3,17.39,17.47,17.55,17.64,17.72,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.8,17.72,17.64,17.55,17.47,17.39,17.3,17.14,16.97,16.8,16.64,16.47,16.3,16.14,15.97,15.81,15.64,15.47,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.39,15.22,15.06,14.89,14.72,14.56,14.39,14.22,14.06,13.89,13.73,13.64,13.56,13.48,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.39,13.31,13.23,13.14,13.06,12.98,12.89,12.81,12.73,12.64,12.56,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.48,12.56,12.64,12.73,12.81,12.89,12.98,13.06,13.14,13.23,13.31,13.31,13.31,13.31,13.31,13.23,13.14,13.06,12.98,12.89,12.81,12.73,12.64,12.56,12.48,12.39,12.31,12.23,12.15,12.15,12.15,12.15,12.15,12.15,12.15,12.15,12.15,12.15,12.15,12.06,11.98,11.9,11.81,11.65,11.48,11.31,11.15,10.98,10.81,10.65,10.48,10.32,10.15,9.98,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.9,9.98,10.07,10.15,10.23,10.32,10.4,10.48,10.56,10.65,10.81,10.98,11.15,11.31,11.48,11.65,11.81,11.98,12.15,12.31,12.48,12.64,12.81,12.98,13.14,13.39,13.64,13.89,14.14,14.39,14.64,14.89,15.14,15.39,15.64,15.89,16.14,16.47,16.89,17.3,17.72,18.22,18.72,19.22,19.72,20.21,20.71,21.21,21.71,22.21,22.71,23.21,23.62,23.96,24.29,24.62,24.96,25.29,25.62,25.95,26.29,26.62,26.95,27.29,27.62,27.95,28.28,28.62,28.95,29.28,29.61,29.95,30.28,30.61,30.86,31.11,31.36,31.61,31.86,32.11,32.28,32.36,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.44,32.36,32.28,32.19,32.11,31.94,31.78,31.61,31.44,31.28,31.11,30.95,30.78,30.61,30.28,29.95,29.61,29.28,28.95,28.62,28.28,27.95,27.62,27.29,26.95,26.62,26.29,25.95,25.62,25.21,24.79,24.37,23.96,23.54,23.13,22.71,22.29,21.88,21.46,21.05,20.63,20.21,19.72,19.22,18.72,18.22,17.72,17.22,16.72,16.22,15.72,15.22,14.72,14.22,13.73,13.23,12.81,12.48,12.15,11.81,11.48,11.15,10.81,10.48,10.15,9.82,9.48,9.15,8.82,8.49,8.15,7.82,7.49,7.15,6.82,6.49,6.16,5.82,5.57,5.32,5.07,4.82,4.58,4.41,4.24,4.08,3.91,3.83,3.74,3.66,3.58,3.49,3.41,3.33,3.24,3.16,3.08,2.99,2.91,2.83,2.75,2.66,2.66,2.66,2.66,2.66,2.66,2.66,2.66,2.66,2.66,2.66,2.66,2.66,2.66,2.75,2.83,2.91,2.99,3.08,3.16,3.24,3.33,3.49,3.66,3.83,3.99,4.16,4.33,4.49,4.66,4.82,4.99,5.24,5.49,5.74,5.99,6.24,6.49,6.74,6.99,7.24,7.49,7.74,7.99,8.24,8.49,8.73,8.98,9.23,9.48,9.73,9.98,10.23,10.48,10.73,10.9,11.06,11.23,11.4,11.56,11.73,11.9,12.06,12.23,12.39,12.56,12.73,12.89,13.06,13.23,13.39,13.56,13.73,13.89,14.06,14.22,14.39,14.56,14.72,14.89,15.06,15.22,15.39,15.47,15.56,15.64,15.72,15.81,15.89,15.97,16.05,16.14,16.22,16.3,16.39,16.39,16.39,16.39,16.39,16.39,16.39,16.39,16.39,16.39,16.39,16.3,16.22,16.14,16.05,15.97,15.89,15.81,15.72,15.64,15.56,15.47,15.39,15.31,15.22,15.14,15.06,14.97,14.89,14.72,14.56,14.39,14.22,14.06,13.89,13.73,13.56,13.39,13.23,12.98,12.73,12.48,12.23,11.98,11.73,11.48,11.23,10.98,10.73,10.48,10.23,9.98,9.73,9.48,9.23,8.98,8.73,8.49,8.24,7.99,7.74,7.57,7.57,7.57,7.57,7.57,7.57,7.65,7.82,7.99,8.15,8.32,8.49,8.65,8.82,8.98,9.15,9.32,9.57,9.82,10.07,10.32,10.56,10.81,11.06,11.31,11.56,11.81,12.06,12.31,12.56,12.81,13.06,13.31,13.56,13.81,14.06,14.31,14.56,14.81,15.06,15.31,15.64,15.97,16.39,16.89,17.39,17.89,18.38,18.97,19.55,20.13,20.8,21.46,22.13,22.79,23.54,24.29,25.04,25.79,26.54,27.29,28.12,28.95,29.78,30.61,31.44,32.36,33.27,34.19,35.1,36.02,36.93,37.85,38.68,39.43,40.18,40.93,41.76,42.59,43.34,44.01,44.67,45.34,46,46.67,47.33,48,48.66,49.33,50,50.58,51.16,51.74,52.32,52.91,53.49,54.07,54.65,55.24,55.82,56.4,56.9,57.32,57.73,58.15,58.56,58.98,59.31,59.56,59.81,60.06,60.31,60.56,60.81,61.06,61.31,61.47,61.56,61.56,61.56,61.56,61.47,61.39,61.31,61.23,61.14,61.06,60.98,60.81,60.64,60.48,60.31,60.14,59.98,59.73,59.48,59.23,58.98,58.73,58.4,58.06,57.73,57.4,57.07,56.65,56.15,55.65,55.15,54.65,54.07,53.41,52.74,52.07,51.41,50.74,50.08,49.33,48.58,47.83,47.08,46.33,45.59,44.75,43.92,43.09,42.26,41.43,40.51,39.6,38.68,37.77,36.85,35.94,35.02,34.19,33.44,32.69,31.94,31.11,30.28,29.53,28.87,28.2,27.53,26.87,26.2,25.54,24.87,24.21,23.54,22.88,22.29,21.71,21.13,20.55,19.96,19.38,18.8,18.22,17.64,17.05,16.47,15.89,15.31,14.81,14.31,13.81,13.31,12.81,12.31,11.81,11.31,10.81,10.32,9.82,9.32,8.82,8.4,8.07,7.74,7.4,7.07,6.82,6.57,6.32,6.07,5.82,5.57,5.32,5.16,4.99,4.82,4.66,4.49,4.33,4.24,4.24,4.24,4.24,4.24,4.33,4.41,4.49,4.58,4.66,4.74,4.82,4.99,5.16,5.32,5.49,5.74,5.99,6.24,6.49,6.82,7.15,7.49,7.82,8.15,8.49,8.82,9.15,9.48,9.9,10.32,10.73,11.15,11.56,11.98,12.39,12.81,13.23,13.64,14.06,14.47,14.89,15.22,15.56,15.89,16.22,16.55,16.89,17.22,17.55,17.89,18.22,18.55,18.88,19.22,19.55,19.96,20.38,20.8,21.21,21.63,22.04,22.46,22.88,23.29,23.71,24.12,24.54,24.96,25.37,25.79,26.2,26.62,27.04,27.37,27.7,28.03,28.37,28.7,29.03,29.36,29.7,30.03,30.36,30.7,30.95,31.19,31.44,31.69,31.94,32.19,32.53,32.86,33.11,33.36,33.61,33.86,34.11,34.36,34.61,34.86,35.1,35.19,35.27,35.35,35.44,35.52,35.6,35.69,35.77,35.85,35.94,36.02,36.02,36.02,36.02,36.02,36.02,36.1,36.19,36.27,36.27,36.27,36.27,36.27,36.35,36.44,36.52,36.6,36.6,36.52,36.44,36.35,36.27,36.19,36.1,36.02,35.94,35.85,35.77,35.69,35.6,35.52,35.44,35.35,35.27,35.19,35.1,35.02,34.94,34.86,34.77,34.69,34.61,34.52,34.44,34.36,34.19,34.02,33.86,33.69,33.52,33.36,33.19,32.94,32.69,32.44,32.19,31.94,31.69,31.44,31.11,30.78,30.45,30.11,29.86,29.61,29.36,29.12,28.87,28.62,28.37,28.12,27.87,27.62,27.37,27.2,27.04,26.87,26.7,26.54,26.29,25.95,25.62,25.37,25.12,24.96,24.87,24.71,24.54,24.37,24.21,24.04,23.96,23.87,23.79,23.71,23.62,23.62,23.62,23.62,23.62,23.71,23.87,24.04,24.21,24.37,24.54,24.71,24.79,24.87,24.96,25.04,25.12,25.21,25.29,25.29,25.29,25.29,25.29,25.37,25.46,25.54,25.62,25.7,25.79,25.87,25.95,26.04,26.12,26.2,26.29,26.37,26.45,26.62,26.79,26.95,27.12,27.29,27.45,27.62,27.78,27.95,28.12,28.28,28.45,28.62,28.78,28.95,29.12,29.28,29.45,29.61,29.78,29.95,30.2,30.45,30.7,30.95,31.11,31.19,31.28,31.36,31.44,31.53,31.61,31.69,31.78,31.86,31.94,32.03,32.03,32.03,32.03,32.03,31.94,31.78,31.61,31.44,31.28,31.11,30.95,30.86,30.78,30.7,30.61,30.53,30.36,30.11,29.95,29.78,29.61,29.45,29.28,29.12,28.95,28.78,28.62,28.45,28.2,27.95,27.7,27.45,27.12,26.7,26.29,25.87,25.46,25.04,24.62,24.21,23.79,23.38,22.96,22.54,22.13,21.71,21.3,20.88,20.46,20.05,19.63,19.22,18.8,18.38,17.97,17.55,17.14,16.72,16.3,15.89,15.47,15.06,14.64,14.22,13.81,13.39,12.98,12.56,12.15,11.73,11.31,10.9,10.48,10.07,9.65,9.23,8.82,8.4,7.99,7.57,7.15,6.74,6.32,5.91,5.49,5.07,4.66,4.24,3.83,3.49,3.24,2.99,2.75,2.5,2.25,2,1.75,1.5,1.25,1,0.75,0.58,0.42,0.25,0.17,0.17,0.25,0.33,0.42,0.5,0.58,0.67,0.75,0.83,0.92,1,1.08,1.16,1.25,1.33,1.41,1.5,1.58,1.66,1.75,1.83,1.91,2,2.08,2.16,2.25,2.33,2.41,2.5,2.58,2.66,2.75,2.83,2.91,2.99,3.08,3.16,3.24,3.33,3.41,3.49,3.58,3.66,3.74,3.83,3.91,3.99,4.08,4.24,4.41,4.58,4.74,4.91,5.07,5.24,5.41,5.57,5.74,5.91,6.07,6.24,6.41,6.57,6.74,6.9,7.07,7.24,7.4,7.65,7.9,8.15,8.4,8.57,8.82,9.07,9.32,9.57,9.82,10.07,10.32,10.56,10.81,11.06,11.31,11.56,11.81,12.06,12.31,12.56,12.81,13.06,13.31,13.56,13.81,14.06,14.31,14.56,14.81,15.06,15.31,15.47,15.64,15.81,15.97,16.14,16.3,16.47,16.64,16.8,16.97,17.14,17.3,17.47,17.64,17.8,17.97,18.13,18.3,18.47,18.63,18.8,18.88,18.97,19.05,19.13,19.22,19.3,19.38,19.47,19.55,19.63,19.72,19.8,19.88,20.05,20.3,20.55,20.8,21.05,21.3,21.55,21.71,21.88,22.04,22.21,22.38,22.46,22.54,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.63,22.71,22.79,22.96,23.13,23.29,23.38,23.46,23.54,23.62,23.79,23.87,23.96,24.04,24.12,24.21,24.29,24.37,24.46,24.54,24.71,24.87,25.04,25.21,25.37,25.54,25.7,25.87,26.04,26.2,26.37,26.54,26.7,26.87,27.04,27.2,27.37,27.53,27.7,27.87,28.03,28.2,28.37,28.53,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.62,28.78,28.95,29.12,29.28,29.45,29.61,29.78,29.95,30.11,30.36,30.61,30.86,31.11,31.28,31.36,31.36,31.36,31.28,31.19,31.11,31.11,31.11,31.11,31.11,31.11,31.19,31.28,31.36,31.44,31.53,31.61,31.69,31.78,31.86,31.86,31.86,31.86,31.86,31.86,31.86,31.86,31.86,31.86,31.78,31.69,31.53,31.36,31.19,31.03,30.86,30.7,30.53,30.36,30.2,30.03,29.86,29.7,29.53,29.36,29.2,29.03,28.87,28.62,28.37,28.12,27.87,27.62,27.37,27.12,26.87,26.62,26.37,26.12,25.79,25.46,25.12,24.79,24.46,24.12,23.79,23.46,23.13,22.71,22.29,21.88,21.46,21.13,20.88,20.63,20.38,20.13,19.88,19.63,19.38,19.13,18.88,18.63,18.38,18.13,17.89,17.64,17.3,16.97,16.64,16.3,15.97,15.64,15.31,14.97,14.64,14.22,13.81,13.39,12.98,12.56,12.15,11.81,11.48,11.23,10.98,10.73,10.56,10.4,10.32,10.23,10.15,10.07,9.98,9.9,9.82,9.73,9.65,9.57,9.48,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.4,9.23,9.07,8.9,8.8,8.73,8.8,9,9.34,9.8,10.4,11.12,11.96,12.93,14.01,15.2,16.49,17.88,19.36,20.93,22.58,24.29,26.07,27.9,29.77,31.68,33.62,35.58,37.55,39.51,41.47,43.41,45.32,47.2,49.03,50.8,52.52,54.16,55.73,57.21,58.6,59.9,61.09,62.16,63.13,63.97,64.7,65.29,65.76,66.09,66.29];
			sleepState5 = [99.97,100,99.97,99.88,99.73,99.51,99.24,98.91,98.51,98.06,97.56,96.99,96.37,95.69,94.97,94.18,93.35,92.47,91.54,90.57,89.55,88.48,87.38,86.24,85.06,83.84,82.6,81.32,80.01,78.68,77.33,75.95,74.56,73.14,71.72,70.28,68.83,67.38,65.92,64.47,63.01,61.56,60.11,58.67,57.25,55.84,54.44,53.06,51.71,50.38,49.07,47.79,46.55,45.33,44.15,43.01,41.91,40.84,39.82,38.85,37.92,37.04,36.21,35.43,34.7,34.02,33.4,32.84,32.33,31.88,31.49,31.15,30.88,30.67,30.51,30.42,30.39,30.11,29.82,29.53,29.25,28.96,28.68,28.3,27.91,27.53,27.15,26.68,26.2,25.91,25.72,25.63,25.63,25.63,25.63,25.53,25.44,25.34,25.25,25.15,25.06,24.96,24.96,24.96,24.96,24.96,24.96,24.96,24.96,24.96,24.96,24.96,24.96,24.96,24.96,24.87,24.77,24.68,24.58,24.49,24.39,24.29,24.2,24.1,24.01,23.91,23.82,23.72,23.63,23.53,23.44,23.34,23.25,23.15,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.06,23.15,23.34,23.63,24.01,24.49,24.96,25.44,25.91,26.3,26.58,26.77,26.96,27.15,27.34,27.63,27.91,28.2,28.49,28.77,29.06,29.34,29.63,29.92,30.2,30.49,30.77,31.06,31.34,31.63,31.92,32.2,32.49,32.77,33.15,33.73,34.39,34.97,35.44,35.82,36.3,36.78,37.25,37.73,38.2,38.68,39.16,39.63,40.11,40.59,41.06,41.54,42.02,42.49,42.97,43.44,43.92,44.4,44.87,45.35,45.83,46.3,46.78,47.26,47.73,48.21,48.78,49.35,49.92,50.49,51.07,51.64,52.21,52.78,53.26,53.64,54.02,54.31,54.5,54.69,54.97,55.26,55.54,55.83,56.12,56.4,56.69,56.97,57.26,57.54,57.83,58.12,58.4,58.69,58.97,59.26,59.55,59.83,60.12,60.4,60.69,60.97,61.16,61.26,61.36,61.36,61.26,61.07,60.78,60.4,60.12,59.93,59.83,59.64,59.45,59.26,59.07,58.88,58.69,58.5,58.31,58.12,57.93,57.74,57.54,57.35,57.16,56.97,56.78,56.59,56.4,56.21,56.02,55.92,55.83,55.64,55.35,54.97,54.59,54.11,53.64,53.07,52.5,51.92,51.35,50.78,50.21,49.64,49.07,48.49,47.92,47.35,46.78,46.11,45.45,44.78,44.11,43.44,42.78,42.11,41.44,40.78,40.11,39.44,38.78,38.11,37.44,36.68,35.92,35.16,34.39,33.63,32.87,32.11,31.34,30.68,30.11,29.53,29.06,28.68,28.3,27.82,27.34,26.87,26.39,25.91,25.44,24.96,24.49,24.01,23.53,23.06,22.58,22.1,21.63,21.15,20.67,20.2,19.72,19.25,18.77,18.29,17.82,17.34,16.86,16.39,15.82,15.24,14.77,14.39,14.1,13.81,13.53,13.24,13.05,12.86,12.67,12.48,12.29,12.1,11.91,11.72,11.53,11.34,11.15,10.96,10.77,10.58,10.38,10.19,10,9.81,9.62,9.43,9.15,8.86,8.57,8.29,8,7.81,7.72,7.62,7.53,7.43,7.34,7.24,7.15,7.05,6.95,6.86,6.76,6.67,6.57,6.48,6.48,6.48,6.48,6.48,6.48,6.48,6.48,6.48,6.48,6.48,6.48,6.57,6.67,6.76,6.86,6.95,7.05,7.15,7.24,7.34,7.43,7.53,7.62,7.72,7.81,7.91,8,8.1,8.19,8.29,8.38,8.48,8.57,8.67,8.77,8.86,8.96,9.05,9.15,9.24,9.34,9.43,9.53,9.62,9.72,9.81,9.91,10,10.1,10.19,10.29,10.38,10.48,10.67,10.86,11.05,11.24,11.43,11.53,11.62,11.72,11.81,11.91,12,12.1,12.19,12.29,12.39,12.48,12.58,12.67,12.77,12.86,12.96,13.05,13.15,13.24,13.34,13.43,13.53,13.62,13.72,13.91,14.1,14.2,14.29,14.29,14.29,14.29,14.29,14.29,14.29,14.29,14.29,14.29,14.39,14.48,14.58,14.67,14.77,14.86,14.96,15.05,15.15,15.24,15.34,15.43,15.53,15.62,15.72,15.82,15.91,15.91,15.91,16.01,16.1,16.2,16.29,16.39,16.48,16.58,16.67,16.77,16.86,16.96,17.05,17.15,17.24,17.34,17.43,17.53,17.63,17.72,17.91,18.1,18.29,18.48,18.67,18.96,19.25,19.53,19.82,20.1,20.39,20.67,20.96,21.25,21.53,21.82,22.1,22.39,22.67,22.96,23.25,23.53,23.72,23.91,24.1,24.29,24.58,24.87,25.15,25.53,25.91,26.3,26.68,27.06,27.44,27.72,28.11,28.58,29.06,29.53,30.01,30.49,30.96,31.44,31.92,32.39,32.87,33.35,33.82,34.3,34.68,35.06,35.54,36.01,36.39,36.78,37.16,37.54,37.92,38.3,38.68,39.06,39.44,39.73,40.01,40.3,40.59,40.87,41.16,41.44,41.73,42.02,42.3,42.49,42.68,42.97,43.25,43.54,43.73,43.92,44.11,44.3,44.4,44.59,44.78,45.06,45.35,45.64,45.92,46.21,46.49,46.78,47.06,47.35,47.64,47.92,48.21,48.49,48.78,49.07,49.35,49.54,49.64,49.83,50.02,50.21,50.3,50.4,50.49,50.49,50.4,50.3,50.21,50.11,50.02,49.92,49.83,49.73,49.64,49.54,49.45,49.45,49.54,49.73,49.92,50.11,50.3,50.49,50.68,50.88,50.97,51.07,51.16,51.26,51.35,51.45,51.64,51.73,51.73,51.73,51.73,51.73,51.73,51.73,51.73,51.73,51.73,51.73,51.64,51.54,51.45,51.35,51.26,51.16,51.07,51.07,50.97,50.88,50.68,50.49,50.3,50.11,49.92,49.73,49.54,49.35,49.16,48.97,48.78,48.59,48.4,48.21,48.02,47.83,47.73,47.64,47.35,47.06,46.78,46.59,46.4,46.21,46.02,45.83,45.64,45.54,45.35,45.16,44.97,44.78,44.59,44.4,44.21,44.02,43.73,43.35,42.97,42.59,42.21,41.82,41.44,41.06,40.68,40.4,40.01,39.63,39.25,38.87,38.49,38.11,37.82,37.63,37.44,37.25,37.06,36.87,36.68,36.49,36.3,36.11,35.92,35.73,35.44,35.06,34.68,34.3,33.92,33.54,33.25,32.96,32.68,32.39,32.11,31.82,31.54,31.25,30.96,30.68,30.39,30.11,29.82,29.53,29.25,28.96,28.68,28.39,28.2,28.01,27.82,27.72,27.63,27.53,27.44,27.34,27.25,27.15,27.06,26.96,26.87,26.96,27.06,27.15,27.25,27.34,27.44,27.53,27.63,27.72,27.82,27.91,28.01,28.11,28.2,28.39,28.58,28.77,28.96,29.25,29.53,29.82,30.11,30.39,30.68,30.96,31.25,31.44,31.54,31.63,31.73,31.82,31.92,32.01,32.11,32.2,32.3,32.49,32.77,33.06,33.35,33.63,33.92,34.11,34.3,34.49,34.68,34.87,35.06,35.25,35.44,35.63,35.82,36.01,36.2,36.39,36.58,36.78,36.97,37.16,37.35,37.44,37.54,37.63,37.73,37.82,37.92,38.01,38.11,38.2,38.3,38.3,38.3,38.2,38.01,37.82,37.63,37.44,37.25,37.06,36.87,36.68,36.49,36.3,36.11,35.92,35.73,35.54,35.25,34.87,34.49,34.2,33.92,33.63,33.35,33.06,32.77,32.49,32.2,31.92,31.73,31.63,31.54,31.44,31.34,31.25,31.15,31.06,30.96,30.87,30.87,30.87,30.87,30.87,30.87,30.87,30.77,30.77,30.77,30.77,30.77,30.77,30.77,30.77,30.77,30.77,30.87,30.96,31.06,31.15,31.25,31.34,31.44,31.54,31.63,31.73,31.82,31.92,32.01,32.11,32.2,32.3,32.39,32.49,32.68,32.87,33.06,33.25,33.44,33.63,33.82,34.01,34.3,34.58,34.87,35.16,35.44,35.82,36.2,36.58,36.97,37.35,37.82,38.3,38.68,39.06,39.44,39.92,40.4,40.87,41.35,41.82,42.3,42.78,43.25,43.73,44.21,44.68,45.16,45.64,46.11,46.59,47.06,47.45,47.83,48.21,48.59,48.97,49.35,49.83,50.21,50.59,50.88,51.16,51.45,51.73,52.02,52.3,52.59,52.78,52.97,53.26,53.54,53.73,53.92,54.21,54.5,54.78,55.07,55.35,55.64,55.83,56.02,56.21,56.4,56.59,56.78,56.97,57.07,57.26,57.45,57.64,57.83,58.02,58.21,58.31,58.4,58.4,58.4,58.4,58.31,58.31,58.31,58.4,58.5,58.59,58.69,58.78,58.88,58.97,58.97,58.97,58.97,58.97,58.97,58.97,58.97,58.97,58.97,58.97,58.97,58.97,58.97,58.88,58.78,58.69,58.59,58.5,58.31,58.12,57.93,57.74,57.54,57.35,57.16,57.07,56.97,56.88,56.69,56.5,56.31,56.12,55.92,55.73,55.45,55.16,54.97,54.78,54.5,54.21,53.92,53.64,53.35,53.07,52.88,52.69,52.5,52.3,52.11,51.92,51.73,51.64,51.45,51.26,51.07,50.88,50.68,50.49,50.3,50.11,50.02,49.92,49.73,49.45,49.07,48.68,48.11,47.54,46.97,46.4,45.83,45.25,44.68,44.11,43.54,42.97,42.4,41.82,41.25,40.68,40.01,39.35,38.68,38.01,37.35,36.68,36.11,35.54,34.97,34.39,33.82,33.35,32.77,32.2,31.54,30.87,30.2,29.53,28.87,28.2,27.53,26.96,26.39,25.82,25.25,24.68,24.1,23.53,22.96,22.39,21.82,21.25,20.67,20.1,19.53,19.05,18.58,18.1,17.63,17.15,16.67,16.2,15.72,15.24,14.77,14.29,13.81,13.34,12.86,12.39,11.91,11.43,10.96,10.48,10,9.62,9.34,9.05,8.77,8.57,8.38,8.19,8,7.81,7.62,7.43,7.24,7.05,6.86,6.67,6.48,6.29,6.1,6,5.91,5.81,5.72,5.62,5.53,5.43,5.34,5.24,5.14,5.05,4.95,4.95,4.95,5.05,5.14,5.24,5.34,5.43,5.53,5.62,5.72,5.81,5.91,6,6.1,6.19,6.29,6.38,6.48,6.57,6.67,6.76,6.86,6.95,6.95,6.95,6.95,6.95,6.95,6.95,6.95,6.95,7.05,7.15,7.24,7.34,7.43,7.53,7.62,7.72,7.81,8,8.19,8.38,8.57,8.77,8.96,9.15,9.34,9.53,9.72,9.91,10,10.19,10.38,10.58,10.77,10.96,11.15,11.34,11.53,11.72,11.91,12.1,12.29,12.48,12.67,12.86,13.05,13.24,13.43,13.62,13.81,14.01,14.2,14.39,14.58,14.77,14.96,15.15,15.34,15.53,15.72,15.91,16.1,16.29,16.48,16.67,16.86,17.05,17.24,17.43,17.63,17.82,18.01,18.2,18.39,18.58,18.77,18.96,19.15,19.34,19.53,19.72,19.91,20.01,20.1,20.2,20.29,20.39,20.48,20.58,20.67,20.77,20.77,20.77,20.77,20.77,20.77,20.77,20.77,20.77,20.77,20.77,20.77,20.86,20.86,20.86,20.86,20.86,20.86,20.86,20.86,20.77,20.67,20.58,20.48,20.39,20.29,20.2,20.1,20.01,19.82,19.72,19.72,19.72,19.72,19.72,19.82,20.01,20.2,20.39,20.58,20.77,20.86,21.06,21.25,21.44,21.63,21.82,22.01,22.2,22.39,22.58,22.77,22.96,23.15,23.34,23.53,23.72,23.91,24.1,24.39,24.68,24.96,25.25,25.53,25.82,26.1,26.39,26.68,26.96,27.25,27.53,27.82,28.11,28.39,28.68,28.96,29.25,29.53,29.82,30.11,30.39,30.68,30.96,31.25,31.54,31.82,32.2,32.58,32.96,33.35,33.73,34.11,34.49,34.97,35.44,35.92,36.39,36.87,37.35,37.82,38.3,38.78,39.35,39.82,40.21,40.59,40.97,41.35,41.63,41.82,42.02,42.21,42.4,42.59,42.87,43.06,43.25,43.44,43.63,43.83,44.02,44.21,44.4,44.59,44.78,44.97,45.25,45.64,46.02,46.4,46.78,47.06,47.16,47.26,47.35,47.45,47.45,47.35,47.26,47.16,47.06,46.97,46.87,46.68,46.49,46.3,46.11,45.92,45.73,45.54,45.35,45.16,44.97,44.78,44.59,44.4,44.21,44.02,43.83,43.54,43.16,42.78,42.4,42.02,41.63,41.25,40.87,40.49,40.11,39.73,39.35,38.97,38.59,38.2,37.82,37.44,37.06,36.68,36.3,35.92,35.54,35.16,34.77,34.39,34.01,33.63,33.25,32.77,32.3,31.82,31.34,30.87,30.39,29.92,29.44,28.96,28.49,28.01,27.53,26.96,26.3,25.63,24.96,24.29,23.72,23.25,22.77,22.29,21.82,21.44,21.15,20.86,20.58,20.29,20.01,19.72,19.53,19.34,19.15,18.96,18.77,18.58,18.39,18.2,18.01,17.82,17.63,17.34,16.96,16.58,16.2,15.82,15.43,15.15,14.86,14.58,14.29,14.01,13.72,13.43,13.15,12.86,12.58,12.29,12,11.72,11.43,11.15,10.86,10.58,10.29,10,9.72,9.43,9.15,8.86,8.57,8.38,8.29,8.19,8.19,8.19,8.19,8.19,8.19,8.19,8.19,8.19,8.19,8.19,8.19,8.19,8.19,8.29,8.48,8.67,8.86,9.05,9.24,9.43,9.62,9.91,10.19,10.48,10.77,11.05,11.34,11.62,11.91,12.19,12.48,12.77,13.05,13.34,13.62,13.91,14.2,14.48,14.77,15.05,15.43,15.91,16.39,16.86,17.34,17.82,18.29,18.77,19.25,19.72,20.2,20.67,21.15,21.63,22.1,22.58,23.06,23.53,24.01,24.49,24.96,25.44,25.91,26.39,26.87,27.34,27.82,28.3,28.77,29.25,29.63,29.92,30.2,30.49,30.77,31.06,31.34,31.63,31.92,32.2,32.49,32.77,33.06,33.35,33.63,33.92,34.11,34.2,34.3,34.39,34.49,34.58,34.68,34.77,34.77,34.77,34.77,34.77,34.68,34.49,34.3,34.11,33.92,33.73,33.54,33.44,33.44,33.44,33.44,33.44,33.44,33.44,33.44,33.44,33.35,33.15,32.96,32.77,32.58,32.39,32.2,32.01,31.73,31.44,31.15,30.87,30.58,30.3,30.01,29.73,29.44,29.15,28.87,28.58,28.3,28.01,27.72,27.44,27.15,26.87,26.58,26.3,26.01,25.53,25.06,24.58,24.1,23.66,23.63,23.66,23.76,23.93,24.17,24.47,24.84,25.27,25.76,26.3,26.91,27.56,28.27,29.02,29.81,30.64,31.5,32.39,33.31,34.25,35.21,36.18,37.16,38.13,39.11,40.08,41.04,41.98,42.9,43.79,44.65,45.48,46.28,47.02,47.73,48.38,48.99,49.53,50.02,50.45,50.82,51.12,51.36,51.53,51.63];
			
			fakeAngles = [1,4,2,4,4,2,6,1,6,6,1,2,4,2,4,1,1,2,4,4,4,1,4,1,2,4,1,6,4,2,2,4,2,1,2,2,4,4,1,2,4,2,2,2,4,2,6,1,1,2,4,2,4,1,1,6,2,4,1,2,2,2,4,2,1,6,4,4,1,6,4,1,4,4,6,2,2,4,2,1,4,2,2,4,4,2,1,1,4,4,2,6,4,4,6,2,1,1,1,1,4,4,4,1,4,4,6,2,4,2,1,1,1,1,2,4,4,1,4,4,1,2,4,4,4,4,4,1,2,1,2,1,4,2,4,2,4,2,2,1,2,6,1,4,4,1,2,2,2,6,6,4,4,4,1,2,1,2,1,6,4,2,4,1,1,4,2,2,1,2,2,1,4,4,2,2,1,4,2,4,4,2,6,4,4,2,1,1,1,4,1,1,2,4,4,2,2,4,1,1,1,1,4,4,2,2,4,4,1,2,4,4,6,2,2,2,4,4,4,1,4,1,6,2,1,4,2,2,1,4,6,2,1,2,4,6,6,4,1,4,2,4,2,2,1,1,4,2,4,4,6,1,2,2,4,2,4,1,1,1,1,4,4,4,2,2,1,1,4,2,2,2,2,4,4,1,1,4,1,2,4,4,4,1,4,6,4,2,2,2,4,6,4,1,2,4,4,2,6,4,4,2,1,2,2,1,6,1,1,4,4,4,4,4,4,1,2,2,2,2,2,1,4,4,1,2,1,4,2,4,4,1,1,1,1,4,6,4,2,2,4,4,1,4,4,2,1,1,4,6,1,2,2,2,2,1,4,2,4,4,2,2,6,1,2,4,1,4,1,4,2,2,2,4,1,2,4,6,4,4,2,6,2,4,6,6,1,4,4,4,4,2,1,2,4,2,4,2,2,4,2,2,2,1,2,4,2,1,4,2,2,2,2,2,2,4,4,2,2,4,4,4,1,2,6,4,4,2,1,4,6,4,4,2,6,4,4,2,6,1,6,2,4,1,4,2,1,4,4,4,2,4,6,4,2,1,1,2,2,6,6,2,1,2,2,1,2,4,2,4,4,1,6,1,4,2,6,1,1,2,1,4,1,1,1,2,2,1,4,1,2,4,1,4,4,2,2,4,2,1,2,4,6,2,1,1,1,4,4,4,4,6,1,1,4,6,4,4,6,2,2,2,4,2,4,2,1,2,4,4,4,2,1,6,2,4,2,2,2,1,2,2,4,6,4,2,1,4,1,1,6,6,1,1,4,1,4,1,4,6,6,1,2,1,2,4,4,6,2,4,2,2,2,1,4,4,1,2,1,4,2,2,1,2,4,4,6,4,1,1,1,2,1,4,4,4,4,4,2,2,6,1,4,4,2,6,2,2,4,4,4,2,2,2,2,2,1,6,4,1,1,4,4,4,2,1,6,2,1,4,1,1,4,4,4,2,1,4,2,4,1,2,1,6,2,4,2,4,6,4,4,2,4,1,4,2,1,4,2,2,2,2,2,6,1,1,2,4,4,4,2,4,1,4,1,2,1,1,4,4,2,1,4,4,1,6,2,2,1,6,1,4,2,2,4,4,2,1,2,1,2,2,6,4,1,4,1,4,6,2,2,4,2,1,2,2,2,6,2,2,4,1,1,1,4,4,4,4,2,2,2,1,4,4,4,1,4,4,2,1,4,2,1,4,1,4,2,2,4,2,4,2,4,4,4,2,4,2,4,2,6,2,2,1,4,2,4,2,2,2,1,1,1,6,4,2,4,1,2,4,4,6,4,4,1,2,2,4,2,1,1,1,6,4,2,4,4,1,2,2,2,4,2,2,4,1,6,4,1,1,1,1,4,2,2,4,4,6,6,6,4,1,4,2,4,2,4,1,6,2,2,2,2,2,4,4,4,4,4,2,2,1,4,1,4,4,1,4,4,1,4,2,4,4,1,2,4,1,1,1,4,1,4,4,2,6,6,2,2,4,2,2,2,4,4,6,1,1,2,4,4,2,1,4,4,1,2,4,1,1,4,4,2,2,4,2,1,2,4,4,2,2,4,4,1,1,2,2,2,4,4,4,4,1,1,2,6,1,2,2,4,2,4,4,2,4,2,2,6,2,4,4,1,1,1,2,2,6,2,4,2,6,2,4,1,4,2,2,1,6,4,4,1,4,1,6,1,4,4,2,4,1,2,2,2,4,1,2,4,1,6,2,4,4,1,4,1,1,1,4,4,4,2,2,1,2,2,6,2,1,2,2,4,4,2,4,1,2,4,1,1,1,4,1,1,4,4,4,4,1,1,1,6,4,1,1,4,4,2,4,2,4,6,2,4,2,2,4,1,1,4,6,1,2,1,2,2,1,4,4,2,4,1,2,2,2,1,6,6,4,2,4,4,2,4,2,4,4,2,2,4,1,4,4,2,2,2,2,2,4,2,1,2,2,2,4,2,1,1,4,1,4,1,2,1,1,4,2,2,2,4,2,2,1,6,4,2,4,1,2,1,2,6,4,4,2,4,1,4,4,4,2,2,1,4,1,4,4,1,2,4,1,1,4,2,1,1,4,4,4,2,4,4,1,2,2,4,2,2,1,4,4,2,1,1,2,4,4,4,2,4,2,1,1,4,2,4,4,1,4,2,4,2,2,2,2,2,1,1,2,4,2,2,4,2,1,2,4,4,1,1,6,4,1,1,2,2,2,6,1,2,4,4,1,4,4,2,2,2,2,1,1,2,2,2,4,1,4,1,4,4,1,1,2,2,4,4,1,2,1,1,1,4,4,2,4,4,1,2,2,4,2,2,2,2,2,1,2,2,1,4,1,1,2,2,4,4,2,4,2,4,2,4,4,2,2,4,1,2,4,1,1,1,2,1,2,2,6,2,2,4,4,2,2,1,1,1,6,2,4,4,4,4,4,2,1,4,4,6,4,4,1,1,2,4,1,1,4,1,4,2,4,1,2,4,1,6,2,2,2,4,4,1,4,4,2,4,1,4,2,2,6,4,2,2,4,6,4,1,1,2,4,4,4,4,4,4,4,2,6,4,1,2,4,6,4,6,6,2,2,6,4,1,2,4,2,1,1,2,4,2,1,4,4,4,4,1,4,2,2,1,4,1,6,1,2,2,1,4,6,6,4,1,2,4,4,2,4,4,2,1,4,2,2,1,1,2,2,4,1,4,6,1,4,1,4,6,4,2,4,2,2,2,4,6,1,4,1,6,1,1,4,4,4,2,1,2,4,4,6,4,4,4,4,4,1,2,2,6,6,4,1,1,1,1,4,2,4,2,1,6,2,1,1,1,1,4,2,2,2,1,1,2,2,1,1,4,4,4,1,1,6,4,4,4,6,1,4];
			fakeAngles = [1,4,2,4,4,2,6,1,6,6,1,2,4,2,4,1,1,2,4,4,4,1,4,1,2,4,1,6,4,2,2,4,2,1,2,2,4,4,1,2,4,2,2,2,4,2,6,1,1,2,4,2,4,1,1,6,2,4,1,2,2,2,4,2,1,6,4,4,1,6,4,1,4,4,6,2,2,4,2,1,4,2,2,4,4,2,1,1,4,4,2,6,4,4,6,2,1,1,1,1,4,4,4,1,4,4,6,2,4,2,1,1,1,1,2,4,4,1,4,4,1,2,4,4,4,4,4,1,2,1,2,1,4,2,4,2,4,2,2,1,2,6,1,4,4,1,2,2,2,6,6,4,4,4,1,2,1,2,1,6,4,2,4,1,1,4,2,2,1,2,2,1,4,4,2,2,1,4,2,4,4,2,6,4,4,2,1,1,1,4,1,1,2,4,4,2,2,4,1,1,1,1,4,4,2,2,4,4,1,2,4,4,6,2,2,2,4,4,4,1,4,1,6,2,1,4,2,2,1,4,6,2,1,2,4,6,6,4,1,4,2,4,2,2,1,1,4,2,4,4,6,1,2,2,4,2,4,1,1,1,1,4,4,4,2,2,1,1,4,2,2,2,2,4,4,1,1,4,1,2,4,4,4,1,4,6,4,2,2,2,4,6,4,1,2,4,4,2,6,4,4,2,1,2,2,1,6,1,1,4,4,4,4,4,4,1,2,2,2,2,2,1,4,4,1,2,1,4,2,4,4,1,1,1,1,4,6,4,2,2,4,4,1,4,4,2,1,1,4,6,1,2,2,2,2,1,4,2,4,4,2,2,6,1,2,4,1,4,1,4,2,2,2,4,1,2,4,6,4,4,2,6,2,4,6,6,1,4,4,4,4,2,1,2,4,2,4,2,2,4,2,2,2,1,2,4,2,1,4,2,2,2,2,2,2,4,4,2,2,4,4,4,1,2,6,4,4,2,1,4,6,4,4,2,6,4,4,2,6,1,6,2,4,1,4,2,1,4,4,4,2,4,6,4,2,1,1,2,2,6,6,2,1,2,2,1,2,4,2,4,4,1,6,1,4,2,6,1,1,2,1,4,1,1,1,2,2,1,4,1,2,4,1,4,4,2,2,4,2,1,2,4,6,2,1,1,1,4,4,4,4,6,1,1,4,6,4,4,6,2,2,2,4,2,4,2,1,2,4,4,4,2,1,6,2,4,2,2,2,1,2,2,4,6,4,2,1,4,1,1,6,6,1,1,4,1,4,1,4,6,6,1,2,1,2,4,4,6,2,4,2,2,2,1,4,4,1,2,1,4,2,2,1,2,4,4,6,4,1,1,1,2,1,4,4,4,4,4,2,2,6,1,4,4,2,6,2,2,4,4,4,2,2,2,2,2,1,6,4,1,1,4,4,4,2,1,6,2,1,4,1,1,4,4,4,2,1,4,2,4,1,2,1,6,2,4,2,4,6,4,4,2,4,1,4,2,1,4,2,2,2,2,2,6,1,1,2,4,4,4,2,4,1,4,1,2,1,1,4,4,2,1,4,4,1,6,2,2,1,6,1,4,2,2,4,4,2,1,2,1,2,2,6,4,1,4,1,4,6,2,2,4,2,1,2,2,2,6,2,2,4,1,1,1,4,4,4,4,2,2,2,1,4,4,4,1,4,4,2,1,4,2,1,4,1,4,2,2,4,2,4,2,4,4,4,2,4,2,4,2,6,2,2,1,4,2,4,2,2,2,1,1,1,6,4,2,4,1,2,4,4,6,4,4,1,2,2,4,2,1,1,1,6,4,2,4,4,1,2,2,2,4,2,2,4,1,6,4,1,1,1,1,4,2,2,4,4,6,6,6,4,1,4,2,4,2,4,1,6,2,2,2,2,2,4,4,4,4,4,2,2,1,4,1,4,4,1,4,4,1,4,2,4,4,1,2,4,1,1,1,4,1,4,4,2,6,6,2,2,4,2,2,2,4,4,6,1,1,2,4,4,2,1,4,4,1,2,4,1,1,4,4,2,2,4,2,1,2,4,4,2,2,4,4,1,1,2,2,2,4,4,4,4,1,1,2,6,1,2,2,4,2,4,4,2,4,2,2,6,2,4,4,1,1,1,2,2,6,2,4,2,6,2,4,1,4,2,2,1,6,4,4,1,4,1,6,1,4,4,2,4,1,2,2,2,4,1,2,4,1,6,2,4,4,1,4,1,1,1,4,4,4,2,2,1,2,2,6,2,1,2,2,4,4,2,4,1,2,4,1,1,1,4,1,1,4,4,4,4,1,1,1,6,4,1,1,4,4,2,4,2,4,6,2,4,2,2,4,1,1,4,6,1,2,1,2,2,1,4,4,2,4,1,2,2,2,1,6,6,4,2,4,4,2,4,2,4,4,2,2,4,1,4,4,2,2,2,2,2,4,2,1,2,2,2,4,2,1,1,4,1,4,1,2,1,1,4,2,2,2,4,2,2,1,6,4,2,4,1,2,1,2,6,4,4,2,4,1,4,4,4,2,2,1,4,1,4,4,1,2,4,1,1,4,2,1,1,4,4,4,2,4,4,1,2,2,4,2,2,1,4,4,2,1,1,2,4,4,4,2,4,2,1,1,4,2,4,4,1,4,2,4,2,2,2,2,2,1,1,2,4,2,2,4,2,1,2,4,4,1,1,6,4,1,1,2,2,2,6,1,2,4,4,1,4,4,2,2,2,2,1,1,2,2,2,4,1,4,1,4,4,1,1,2,2,4,4,1,2,1,1,1,4,4,2,4,4,1,2,2,4,2,2,2,2,2,1,2,2,1,4,1,1,2,2,4,4,2,4,2,4,2,4,4,2,2,4,1,2,4,1,1,1,2,1,2,2,6,2,2,4,4,2,2,1,1,1,6,2,4,4,4,4,4,2,1,4,4,6,4,4,1,1,2,4,1,1,4,1,4,2,4,1,2,4,1,6,2,2,2,4,4,1,4,4,2,4,1,4,2,2,6,4,2,2,4,6,4,1,1,2,4,4,4,4,4,4,4,2,6,4,1,2,4,6,4,6,6,2,2,6,4,1,2,4,2,1,1,2,4,2,1,4,4,4,4,1,4,2,2,1,4,1,6,1,2,2,1,4,6,6,4,1,2,4,4,2,4,4,2,1,4,2,2,1,1,2,2,4,1,4,6,1,4,1,4,6,4,2,4,2,2,2,4,6,1,4,1,6,1,1,4,4,4,2,1,2,4,4,6,4,4,4,4,4,1,2,2,6,6,4,1,1,1,1,4,2,4,2,1,6,2,1,1,1,1,4,2,2,2,1,1,2,2,1,1,4,4,4,1,1,6,4,4,4,6,1,4,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,4,2,4,4,2,6,1,6,6,1,6,1,6,6,1];
			fakeAngles = [3,4,2,4,4,2,6,3,6,6,3,2,4,2,4,3,3,2,4,4,4,3,4,3,2,4,3,6,4,2,2,4,2,3,2,2,4,4,3,2,4,2,2,2,4,2,6,3,3,2,4,2,4,3,3,6,2,4,3,2,2,2,4,2,3,6,4,4,3,6,4,3,4,4,6,2,2,4,2,3,4,2,2,4,4,2,3,3,4,4,2,6,4,4,6,2,3,3,3,3,4,4,4,3,4,4,6,2,4,2,3,3,3,3,2,4,4,3,4,4,3,2,4,4,4,4,4,3,2,3,2,3,4,2,4,2,4,2,2,3,2,6,3,4,4,3,2,2,2,6,6,4,4,4,3,2,3,2,3,6,4,2,4,3,3,4,2,2,3,2,2,3,4,4,2,2,3,4,2,4,4,2,6,4,4,2,3,3,3,4,3,3,2,4,4,2,2,4,3,3,3,3,4,4,2,2,4,4,3,2,4,4,6,2,2,2,4,4,4,3,4,3,6,2,3,4,2,2,3,4,6,2,3,2,4,6,6,4,3,4,2,4,2,2,3,3,4,2,4,4,6,3,2,2,4,2,4,3,3,3,3,4,4,4,2,2,3,3,4,2,2,2,2,4,4,3,3,4,3,2,4,4,4,3,4,6,4,2,2,2,4,6,4,3,2,4,4,2,6,4,4,2,3,2,2,3,6,3,3,4,4,4,4,4,4,3,2,2,2,2,2,3,4,4,3,2,3,4,2,4,4,3,3,3,3,4,6,4,2,2,4,4,3,4,4,2,3,3,4,6,3,2,2,2,2,3,4,2,4,4,2,2,6,3,2,4,3,4,3,4,2,2,2,4,3,2,4,6,4,4,2,6,2,4,6,6,3,4,4,4,4,2,3,2,4,2,4,2,2,4,2,2,2,3,2,4,2,3,4,2,2,2,2,2,2,4,4,2,2,4,4,4,3,2,6,4,4,2,3,4,6,4,4,2,6,4,4,2,6,3,6,2,4,3,4,2,3,4,4,4,2,4,6,4,2,3,3,2,2,6,6,2,3,2,2,3,2,4,2,4,4,3,6,3,4,2,6,3,3,2,3,4,3,3,3,2,2,3,4,3,2,4,3,4,4,2,2,4,2,3,2,4,6,2,3,3,3,4,4,4,4,6,3,3,4,6,4,4,6,2,2,2,4,2,4,2,3,2,4,4,4,2,3,6,2,4,2,2,2,3,2,2,4,6,4,2,3,4,3,3,6,6,3,3,4,3,4,3,4,6,6,3,2,3,2,4,4,6,2,4,2,2,2,3,4,4,3,2,3,4,2,2,3,2,4,4,6,4,3,3,3,2,3,4,4,4,4,4,2,2,6,3,4,4,2,6,2,2,4,4,4,2,2,2,2,2,3,6,4,3,3,4,4,4,2,3,6,2,3,4,3,3,4,4,4,2,3,4,2,4,3,2,3,6,2,4,2,4,6,4,4,2,4,3,4,2,3,4,2,2,2,2,2,6,3,3,2,4,4,4,2,4,3,4,3,2,3,3,4,4,2,3,4,4,3,6,2,2,3,6,3,4,2,2,4,4,2,3,2,3,2,2,6,4,3,4,3,4,6,2,2,4,2,3,2,2,2,6,2,2,4,3,3,3,4,4,4,4,2,2,2,3,4,4,4,3,4,4,2,3,4,2,3,4,3,4,2,2,4,2,4,2,4,4,4,2,4,2,4,2,6,2,2,3,4,2,4,2,2,2,3,3,3,6,4,2,4,3,2,4,4,6,4,4,3,2,2,4,2,3,3,3,6,4,2,4,4,3,2,2,2,4,2,2,4,3,6,4,3,3,3,3,4,2,2,4,4,6,6,6,4,3,4,2,4,2,4,3,6,2,2,2,2,2,4,4,4,4,4,2,2,3,4,3,4,4,3,4,4,3,4,2,4,4,3,2,4,3,3,3,4,3,4,4,2,6,6,2,2,4,2,2,2,4,4,6,3,3,2,4,4,2,3,4,4,3,2,4,3,3,4,4,2,2,4,2,3,2,4,4,2,2,4,4,3,3,2,2,2,4,4,4,4,3,3,2,6,3,2,2,4,2,4,4,2,4,2,2,6,2,4,4,3,3,3,2,2,6,2,4,2,6,2,4,3,4,2,2,3,6,4,4,3,4,3,6,3,4,4,2,4,3,2,2,2,4,3,2,4,3,6,2,4,4,3,4,3,3,3,4,4,4,2,2,3,2,2,6,2,3,2,2,4,4,2,4,3,2,4,3,3,3,4,3,3,4,4,4,4,3,3,3,6,4,3,3,4,4,2,4,2,4,6,2,4,2,2,4,3,3,4,6,3,2,3,2,2,3,4,4,2,4,3,2,2,2,3,6,6,4,2,4,4,2,4,2,4,4,2,2,4,3,4,4,2,2,2,2,2,4,2,3,2,2,2,4,2,3,3,4,3,4,3,2,3,3,4,2,2,2,4,2,2,3,6,4,2,4,3,2,3,2,6,4,4,2,4,3,4,4,4,2,2,3,4,3,4,4,3,2,4,3,3,4,2,3,3,4,4,4,2,4,4,3,2,2,4,2,2,3,4,4,2,3,3,2,4,4,4,2,4,2,3,3,4,2,4,4,3,4,2,4,2,2,2,2,2,3,3,2,4,2,2,4,2,3,2,4,4,3,3,6,4,3,3,2,2,2,6,3,2,4,4,3,4,4,2,2,2,2,3,3,2,2,2,4,3,4,3,4,4,3,3,2,2,4,4,3,2,3,3,3,4,4,2,4,4,3,2,2,4,2,2,2,2,2,3,2,2,3,4,3,3,2,2,4,4,2,4,2,4,2,4,4,2,2,4,3,2,4,3,3,3,2,3,2,2,6,2,2,4,4,2,2,3,3,3,6,2,4,4,4,4,4,2,3,4,4,6,4,4,3,3,2,4,3,3,4,3,4,2,4,3,2,4,3,6,2,2,2,4,4,3,4,4,2,4,3,4,2,2,6,4,2,2,4,6,4,3,3,2,4,4,4,4,4,4,4,2,6,4,3,2,4,6,4,6,6,2,2,6,4,3,2,4,2,3,3,2,4,2,3,4,4,4,4,3,4,2,2,3,4,3,6,3,2,2,3,4,6,6,4,3,2,4,4,2,4,4,2,3,4,2,2,3,3,2,2,4,3,4,6,3,4,3,4,6,4,2,4,2,2,2,4,6,3,4,3,6,3,3,4,4,4,2,3,2,4,4,6,4,4,4,4,4,3,2,2,6,6,4,3,3,3,3,4,2,4,2,3,6,2,3,3,3,3,4,2,2,2,3,3,2,2,3,3,4,4,4,3,3,6,4,4,4,6,3,4,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,4,2,4,4,2,6,3,6,6,3,6,3,6,6,3];
			fakeAngles = [5,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,4,1,1,2,5,4,5,5,5,5,5,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,2,5,5,2,5,5,5,5,2,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,1,5,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3];
			//alert(fakeAngles.length+" " +sleepState.length+" "+sleepState2.length+" "+sleepState3.length+" "+sleepState4.length+" "+sleepState5.length);
			allTimeAvgs = {
				totalScore: 81,
				states : [4.2*3600,3.67*3600,0.23*3600, 0],
				percents: [0,0,0, 0],
				toneTime: 0,
				daysOfData: 0,
				endDate: 0,
				rating: 4.3,
				msFromMidnight: msFromMidnight(1440562320000)
			};
			
			
			currentWeekAvgs = {
				totalScore: 0,
				states : [0,0,0],
				percents: [0,0,0],
				toneTime: 0,
				daysOfData: 0,
				endDate: 0,
				rating: 0,
				msFromMidnight: 0
			};
			
			currentMonthAvgs = {
				totalScore: 0,
				states : [0,0,0],
				percents: [0,0,0],
				toneTime: 0,
				daysOfData: 0,
				endDate: 0,
				rating: 0,
				msFromMidnight: 0
			};
			
			lastDay = {
				totalScore : 0,
				states : [0,0,0],
				percents: [0,0,0],
				toneTime: 0,
				daysOfData: 0,
				endDate: 0,
				rating: 0
			};
			
			//alert('before fakeDay');
			var today = new Date();
			var endWeek = new Date( today.getTime() + (7- today.getDay())*24*3600*1000).setHours(11,59,59,999);
			endWeek = new Date(endWeek);
			var endMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).setHours(23,59,59,999);
			endMonth = new Date(endMonth);
			var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			
			//alert(monthNames[endMonth.getMonth()]);
			var fakeDay = {
				totalScore : 85,
				rating : 3,
				states : lastSleepStates,
				percents : lastSleepSummary,
				angles : fakeAngles,
				tones : tones,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				scores : sleepState,
				time : today.getTime(),
				label : today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight( today.getTime() )
			};
			
			//alert('after fakeDay');
			
			var fakeWeek = {
				totalScore : 85,
				rating : 3,
				states : lastSleepStates,
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : today.getMonth()+1+"/"+today.getDate()+"-"+endWeek.getMonth()+1+"/"+endWeek.getDate(),
				endDate : endWeek.getTime(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight( today.getTime() )
			};
			
			//alert('after fakeWeek');
			
			var fakeMonth = {
				totalScore : 85,
				rating : 3,
				states : lastSleepStates,
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : monthNames[endMonth.getMonth()],
				endDate :  endMonth.getTime(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight( today.getTime() )
			};
			
			//alert('here - in loadPlots(), after setting fake data');
			
			// Need fake data to array of day objects...
			dayData = [{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState),
				percents : lastSleepSummary,
				angles : fakeAngles,
				tones : tones,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				scores : sleepState,
				time : 1440562320000 + 30*60*1000 - 5*24*3600*1000,
				label : today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000)
			},{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState2),
				percents : lastSleepSummary,
				angles : fakeAngles,
				tones : tones,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				scores : sleepState2,
				time : 1440562320000 + 30*60*1000 - 4*24*3600*1000,
				label : today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 + 20*60*1000)
			},{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState3),
				percents : lastSleepSummary,
				angles : fakeAngles,
				tones : tones,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				scores : sleepState3,
				time : 1440562320000 + 30*60*1000 - 3*24*3600*1000,
				label : today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 - 10*60*1000)
			},{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState4),
				percents : lastSleepSummary,
				angles : fakeAngles,
				tones : tones,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				scores : sleepState4,
				time : 1440562320000 + 30*60*1000 - 2*24*3600*1000,
				label : today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000)
			},{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState3),
				percents : lastSleepSummary,
				angles : fakeAngles,
				tones : tones,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				scores : sleepState3,
				time : 1440562320000 + 30*60*1000 - 1*24*3600*1000,
				label : today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 + 30*60*1000)
			},{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState),
				percents : lastSleepSummary,
				angles : fakeAngles,
				tones : tones,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				scores : sleepState,
				time : 1440562320000 + 30*60*1000,
				label : today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 + 30*60*1000)
			},{
				totalScore : 80,
				rating : 3,
				//states : stateCount(sleepState2),
				states : stateCount(sleepState),
				percents : lastSleepSummary,
				angles : fakeAngles,
				tones : tones,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				//scores : sleepState2,
				scores : sleepState,
				time : 1440562320000 + 30*60*1000 + 1*24*3600*1000,
				label : today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 + 30*60*1000),
				timesAwoken: 1
			}];
			
			weekData = [{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState4),
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : today.getMonth()+1+"/"+today.getDate()+"-"+endWeek.getMonth()+1+"/"+endWeek.getDate(),
				endDate : new Date(2015,7,5,23,59,59,999).getTime(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 + 35*60*1000)
			},{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState2),
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : today.getMonth()+1+"/"+today.getDate()+"-"+endWeek.getMonth()+1+"/"+endWeek.getDate(),
				endDate : new Date(2015,7,12,23,59,59,999).getTime(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 - 6*60*1000)
			},{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState),
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : today.getMonth()+1+"/"+today.getDate()+"-"+endWeek.getMonth()+1+"/"+endWeek.getDate(),
				endDate : new Date(2015,7,19,23,59,59,999).getTime(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 - 15*60*1000)
			},{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState3),
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : today.getMonth()+1+"/"+today.getDate()+"-"+endWeek.getMonth()+1+"/"+endWeek.getDate(),
				endDate : new Date(2015,7,26,23,59,59,999).getTime(),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 + 23*60*1000)
			}];

			
			monthData = [{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState3),
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : monthNames[endMonth.getMonth()],
				endDate :  endMonth.setMonth(5),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000)
			} ,{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState),
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : monthNames[endMonth.getMonth()],
				endDate :  endMonth.setMonth(6),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 - 34*60*1000)
			} ,{
				totalScore : 85,
				rating : 3,
				states : stateCount(sleepState4),
				percents : lastSleepSummary,
				toneTime : arraySum(tones)/100*secondsPerReading ,
				label : monthNames[endMonth.getMonth()],
				endDate :  endMonth.setMonth(7),
				timeArr : [],
				scoresAlt : [],
				scoresAlt2 : [],
				msFromMidnight : msFromMidnight(1440562320000 + 12*60*1000)
			} ];
			
			// add base time to fake time array
			for ( i = 0 ; i < fakeTimeArray.length; i++){
				fakeTimeArray[i] *= (3600*1000);
				fakeTimeArray[i] += dayData[dayData.length - 1].time;
			}
			
			// Modify the dates of the days
			var blahDate = fakeDay.time;
			var number = 1;
			//alert("fakeDay.time: "+fakeDay.time);
			
			for( i = dayData.length - 2 ; i > 0 ; i--){
				//blahDate = blahDate - 24*3600*1000;
				//dummyDay = dayData[i];
				//dummyDay.time = blahDate;
				//dayData[0].time = blahDate;
				//alert(dayData[0].time+" "+dayData[1].time+" "+dayData[2].time+" "+dayData[3].time+" "+dayData[4].time);
			}
			//alert(dayData[0].time+" "+dayData[1].time+" "+dayData[2].time+" "+dayData[3].time+" "+dayData[4].time);
			
			//weekData = [fakeWeek,fakeWeek,fakeWeek,fakeWeek,fakeWeek,fakeWeek];
			//monthData = [fakeMonth,fakeMonth,fakeMonth];
			// weekData = [[23625],[4215],[495],["8/10-8/16"]];
			// monthData = [[23625],[4215],[495],["Aug"]];
			
			//alert('after setting fake data');
			updateLastSleepPie(lastSleepSummary);
			updateLastSleepPie(stateCount(sleepState));
			//alert('after updateLastSleepPie');
			updateTrends2(getTrendsData(dayData));
			//alert('after updateTrends2');
			updateOrientation(fakeAngles, 1433218260000, sleepState);
			//alert('after updateOrientation');
			updateSleepLab(sleepState, tones, dayData[dayData.length-1].time,sleepState,fakeTimeArray,fakeRem,[]);
			//alert('after updateSleepLab');
			/* updateStats(75, lastSleepSummary); */
			updateTrendsTable(getPast7Avgs(dayData));
			updateLastSleepTable(dayData[dayData.length-1]);
			updateSleepLabTable(dayData[dayData.length-1]);
			
			//setTimeout(function(){alert('no local storage');},500);
			otherButtons = $('#weekly, #monthly, #alltime');
			otherButtons.removeClass("current");
			dailyBtn = $('#daily');
			dailyBtn.addClass("current");
			
		}
		
		// HIDE SPLASHSCREEN HERE!!!!!!!!!!!!!!!!!!!
			//alert('popup 16');
			setTimeout(function(){
				navigator.splashscreen.hide();
				splashHidden = true;
				if (openTutorialPopup && bluetoothEnabled){
					//alert('in load plots, opening tutorial popup');
					$('#tutorialPopup').popup('open');
					openTutorialPopup = false;
				}else if(!bluetoothEnabled){
					$('#bluetoothPopup').popup('open');
				}
				
			},300);
			
			
			$('.ui-popup').popup('close');
			
			
			
			//$.mobile.loading('hide');
			//$('#changingPopup').popup('close');
			$('#head').addClass('noDisplay');
			$('#orientationBtn').removeClass('current');
			$('#scoreBtn').addClass('current');
			
			$('.avgScore,.avgRating,.avgBreakdown,.statlabel').addClass('noDisplay');
			
			
			//alert('at end of load plots');
			
}

function loadLabels(){
	labelDeep = $.t('lastsleep.legend.legend1');
	labelLight = $.t('lastsleep.legend.legend2');
	labelAwake = $.t('lastsleep.legend.legend3');
	labelLeft = $.t('plot.left'),
	labelUp = $.t('plot.up'),
	labelRight = $.t('plot.right'),
	labelOtherOrientations = $.t('plot.other'),
	labelSleepLevel = $.t('sleeplab.title.sleeplevel'),
	labelHeadOrientation = $.t('sleeplab.title.headorientation'),
	labelL7sleeps = $.t('trends.title.sleeps'),
	labelL7weeks = $.t('trends.title.weeks'),
	labelL7months = $.t('trends.title.months'),
	labelAllTime = $.t('trends.title.alltime'),
	labelAvgL7sleeps = $.t('trends.table.title.sleeps'),
	labelAvgL7weeks = $.t('trends.table.title.weeks'),
	labelAvgL7months = $.t('trends.table.title.months'),
	labelAvgAllTime = $.t('trends.table.title.alltime'),
	labelHours = $.t('plot.hours'), 
	labelMins = $.t('plot.minutes'), 
	labelMin = $.t('plot.minute'), 
	labelConnect = $.t('settings.btn.connect'),
	labelDisconnect = $.t('settings.btn.disconnect'),
	labelConnecting = $.t('settings.btn.connecting'),
	labelConnected = $.t('settings.btn.connected'),
	labelProcessing = $.t('loading.processing'),
	labelDisconnecting = $.t('loading.disconnecting'),
	labelStarting = $.t('loading.starting'),
	labelRetrieving = $.t('loading.retrieving'),
	labelStartSleep = $.t('footer.start'),
	labelEndSleep = $.t('footer.end'),
	labelTime = $.t('formatting.time'),
	labelTimeAlt = $.t('formatting.timeAlt'),
	labelWeekly = $.t('formatting.weekly'),
	labelDaily = $.t('formatting.daily'),
	labelYear = $.t('formatting.year'),
	labelDisconnectMessage = $.t('settings.message.disconnect'),
	labelConnectMessage = $.t('settings.message.connect'),
	labelSelectRating = $.t('popup.rating.description'),
	labelRatingError = $.t('popup.rating.error'),
	labelEnglish = $.t('help.language.en'),
	labelChinese = $.t('help.language.zh'),
	labelCurrentLanguage = $.t('help.language.this'),
	labelMonth = [$.t('formatting.monthly.month1'),$.t('formatting.monthly.month2'),$.t('formatting.monthly.month3'),$.t('formatting.monthly.month4'),$.t('formatting.monthly.month5'),$.t('formatting.monthly.month6'),$.t('formatting.monthly.month7'),$.t('formatting.monthly.month8'),$.t('formatting.monthly.month9'),$.t('formatting.monthly.month10'),$.t('formatting.monthly.month11'),$.t('formatting.monthly.month12')],
	/* -- New tutorial labels -- */
	labelTut1Title = $.t('tutorial.welcome.title'),
	labelTut1P = $.t('tutorial.welcome.p'),
	labelTut1Setup = $.t('tutorial.welcome.button.setup'),
	labelTut1Later = $.t('tutorial.welcome.button.later'),
	labelTut2Title = $.t('tutorial.connect.title'),
	labelTut2P1 = $.t('tutorial.connect.p1'),
	labelTut2P2 = $.t('tutorial.connect.p2'),
	labelTut2P3 = $.t('tutorial.connect.p3'),
	labelTut3Title = $.t('tutorial.puton.title'),
	labelTut3P1 = $.t('tutorial.puton.p1'),
	labelTut3P2 = $.t('tutorial.puton.p2'),
	labelTut3P3 = $.t('tutorial.puton.p3'),
	labelNext = $.t('tutorial.puton.next'),
	labelTut4Title = $.t('tutorial.signalstrength.title'),
	labelTut4P1 = $.t('tutorial.signalstrength.p1'),
	labelTut4P2 = $.t('tutorial.signalstrength.p2'),
	labelTut4P3 = $.t('tutorial.signalstrength.p3'),
	labelTut4GoodMessage = $.t('tutorial.signalstrength.goodsig'),
	labelTut4BadMessage = $.t('tutorial.signalstrength.badsig'),
	labelTut4BadMessage2 = $.t('tutorial.signalstrength.badsig2'),
	labelBad = $.t('tutorial.signalstrength.bad'),
	labelOkay = $.t('tutorial.signalstrength.okay'),
	labelGood = $.t('tutorial.signalstrength.good'),
	labelVeryGood = $.t('tutorial.signalstrength.verygood'),
	labelTut5Title = $.t('tutorial.volume.title'),
	labelTut5P1 = $.t('tutorial.volume.p1'),
	labelTut5P2 = $.t('tutorial.volume.p2'),
	labelTut5P3 = $.t('tutorial.volume.p3'),
	labelTut6Title = $.t('tutorial.orientation.title'),
	labelTut6P1 = $.t('tutorial.orientation.p1'),
	labelTut6P2 = $.t('tutorial.orientation.p2'),
	labelTut7Title = $.t('tutorial.track.title'),
	labelTut7P1 = $.t('tutorial.track.p1'),
	labelTut7P2 = $.t('tutorial.track.p2'),
	labelTut8Title = $.t('tutorial.finish.title'),
	labelTut8P = $.t('tutorial.finish.p'),
	labelFinish = $.t('tutorial.finish.finish'),
	labelStartImg = $.t('tutorial.track.startimg'),
	labelEndImg = $.t('tutorial.track.endimg'),
	labelOn = $.t('settings.on'),
	labelOff = $.t('settings.off'),
	labelTemporal = $.t('popup.alarm.temporal'),
	labelStanding = $.t('plot.standing'),
	labelDown = $.t('plot.down'),
	labelHeadstand = $.t('plot.headstand'),
	labelAlarmError = $.t('popup.alarm.error'),
	labelAlarmReminder = $.t('popup.alarm.reminder'),
	labelPowerOnImg = $.t('tutorial.connect.img'),
	labelSpeakerPositionImg = $.t('tutorial.volume.img'),
	labelSensorDiagramImg = $.t('tutorial.puton.img'),
	labelDataCheck = $.t('popup.datacheck.description2'),
	labelBack = $.t('tutorial.connect.back'),
	labelWithinNorm = $.t('lastsleep.withinnorm'),
	labelEarlier = $.t('lastsleep.earlier'),
	labelLater = $.t('lastsleep.later'),
	labelRem = $.t('sleeplab.rem'),
	labelNoEEG = $.t('lastsleep.legend.legend4'),
	labelQualitySleepScore = $.t('lastsleep.scorelabel'),
	labelPoorEEG = $.t('lastsleep.pooreeg');
	
	}


function diff(data) {
    var ddata = [];
    for (var i = 0; i < data.length - 1; i++) {
         ddata[i] = data[i+1] - data[i];
    }
    ddata[data.length - 1] = 0;
    return ddata;
}

function diff2(numArray){
    var arrayDiff = [];
    for (i = 0; i<numArray.length-1;i++){
        arrayDiff[i] = numArray[i+1]-numArray[i];
    }
    return arrayDiff;
}

function getSign(point) {
    //console.log("Point :" + point);
    var sign = [];
    for (var i = 0; i < point.length; i++) {
        if (point[i] < 0) {
            sign[i] = -1;
        } else if (point[i] === 0) {
            sign[i] = 0;
        } else {
            sign[i] = 1;
        }
    }
    return sign;
}

function findEquals(data, equalTo) {
    //console.log("Data : " + data);
    var foundIndex = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i] == equalTo) {
            foundIndex.push(i);
        }
    }
    return foundIndex;
}

function findLessThan(data, lessThan) {
    var foundIndex = [];
    for (i = 0; i < data.length; i++) {
        if (data[i] < lessThan) {
            foundIndex.push(i);
        }
    }
    return foundIndex;
}

function findGreaterThan(data, greaterThan) {
    var foundIndex = [];
    for (i = 0; i < data.length; i++) {
        if (data[i] > greaterThan) {
            foundIndex.push(i);
        }
    }
    return foundIndex;
}

function findWithinRange(data, point, range){
    var count = 0;
    //console.log("Point : " + point);
    //console.log("Data : " + data);
    for (var j = 0; j < data.length; j++){
        //console.log("Within Range Distance : " + Math.abs(point-data[i]));
        if (Math.abs(point-data[j]) < range) {
            count++;
        } else{}
    }
    return count;
}
            
function findPeaks(data, minDistance) {
	alert('data length in findPeaks: '+data.length);
  var pointDiff = diff(data);

  var diffSign = getSign(pointDiff);
  //console.log("DiffSign : " + diffSign);
  var flatSpots = findEquals(diffSign, 0);
  for (var i = 1; i < flatSpots.length; i++) {
    if (diffSign[flatSpots[i] - 1] == 1) {
      diffSign[flatSpots[i]] = 1;
    } else {
      diffSign[flatSpots[i]] = -1;
    }
  }
  var ddiff = diff(diffSign);
  //console.log("ddiff : " + ddiff);
  var peakIdx = findEquals(ddiff, -2);
  for (i = 0; i < peakIdx.length; i++) {
    peakIdx[i] = peakIdx[i] + 1;
  }
  var peakMag = [];
  for (var i = 0; i < peakIdx.length; i++) {
    peakMag.push(data[peakIdx[i]]);
  }

  //console.log("Peak mag (before removing) : " + peakMag);
  //console.log("Peaks Sorted : " + peakMag.sort());
  /*var test = sortArrays(peakIdx, peakMag);
   var testIdx = test[0];
   var testMag = test[1];*/
  //console.log(" Peak Mag (Sorted) : " + testMag);
  //console.log(" Peak Idx (sorted) : " + testIdx);

  //--------Remove peaks too close to beginning of data --------------//
  var peakMinIdx = 180; // ~ 45 minutes
  while (peakIdx[0] < peakMinIdx) {
    peakIdx.shift();
    peakMag.shift();
  }

  //--------Remove peaks too close to end of data --------------//
  var peakMaxIdx = data.length - 100; // ~ 45 minutes
  while (peakIdx[peakIdx.length - 1] > peakMaxIdx) {
    peakIdx.pop();
    peakMag.pop();
  }
  //  console.log("Find Peaks Loop - peakIdx :" + peakIdx);
  //console.log("Find Peaks Loop - peakMag :" + peakMag);
  //console.log("peak index : " + peakIdx);
 // console.log("peakMag : " + peakMag);
  // ------------------Sort Peaks (Highest to Lowest)---------------//
  //console.log("Peak Idx : " + peakIdx);
  var sortedData = sortArrays(peakIdx, peakMag);
  //console.log("Sorted Data : " + sortedData);
  var sortedIdx = sortedData[0];
  var sortedMag = sortedData[1];
  
  
  //console.log("Sorted Indices : " + sortedIdx);
  //console.log("Sorted Peaks : " + sortedMag);
  //console.log("Peak Index 2 : " + peakIdx);
  //console.log("Data Length : " + data.length);
  //--------Remove peaks too close together--------------------------//
  var peakToKeep = sortedIdx[0];
  //console.log("Peak to Keep : " + peakToKeep);
  var peakIdxFinal = [sortedIdx[0]];
  //console.log("Peak Idx Final : " + peakIdxFinal);
  var peaksFinal = [sortedMag[0]];


  //var count = findWithinRange(peakIdxFinal,sortedIdx[1],minDistance);
  // console.log("Count : " + count);
  // console.log("Range : " + minDistance);
  for (var i = 1; i < sortedIdx.length; i++) {
    //console.log("Index in Filter : " + i);
    //console.log("Sorted Index : " + sortedIdx[i]);
    var count = findWithinRange(peakIdxFinal, sortedIdx[i], minDistance);
    //console.log("Count In Filter : " + count);
    if (count === 0) {
      peakIdxFinal.push(sortedIdx[i]);
      peaksFinal.push(sortedMag[i]);
    } else {}
  }
  //console.log("Final Peaks : " + peaksFinal);
  //console.log("Final Indx : " + peakIdxFinal);
  var sortedFinalData = sortArrays(peaksFinal, peakIdxFinal);
  var sortedFinalIdx = sortedFinalData[1];
  var sortedFinalMag = sortedFinalData[0];
  sortedFinalMag.reverse();
  sortedFinalIdx.reverse();
  var peakStuff = [sortedFinalIdx, sortedFinalMag];
  //console.log("Peaks Final : " + peaksFinal);
  return peakStuff;
}

function linspace(dataStart,dataEnd,points){
    var interval = (dataEnd-dataStart)/(points-1);
    var value = [dataStart];
    
    for (i = 1;i < points;i++){
        value[i] = value[i-1] + interval;
    }
    return value;
}

function sortArrays(indices, sortedValue) {
  var list = [];
  for (var j = 0; j < indices.length; j++) {
    list.push({
      'indices': indices[j],
      'sortedValue': sortedValue[j]
    });
  }
  //console.log(list);
  list.sort(function(a, b) {
    return ((a.sortedValue > b.sortedValue) ? -1 : ((a.sortedValue == b.sortedValue) ? 0 : 1));
    //Sort could be modified to, for example, sort on the age 
    // if the name is the same.
  });
  //console.log(list);
  var indices2 = [];
  var sortedValue2 = [];
  for (var k = 0; k < list.length; k++) {
    indices2.push(list[k].indices);
    sortedValue2.push(list[k].sortedValue);
  }
  //alert("Addresses: "+JSON.stringify(addresses) + "RSSI: "+JSON.stringify(rssis));
  //console.log("Indices :" + indices);

  return [indices2, sortedValue2];
}

    function windowSum(window, data) {
        var newData = [];
        for (i = 0; i < data.length; i++) {
            var lindex = i - window; //Left index
            var rindex = i + window; //Right index
            if (i - window < 1) lindex = 1; //If left index <1, left index is set =1
            if (i + window > data.length - 1) rindex = data.length - 1; //If right index > # of data points, right index set = (# of data points)
            newData[i] = data.slice(lindex, rindex + 1).reduce(function (pv, cv) {
                return pv + cv;
            }, 0);
        }
        return newData;
    }    
	
	function loadiScroll () {
		myScroll = new IScroll('#wrapper', {
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapSpeed: 400,
			keyBindings: true,
			click: true,
			bounce:false
		});
		

		myScroll.on("scrollEnd",function(){
			//alert(myScroll.currentPage['pageX']);
			var currentPage = myScroll.currentPage.pageX;
			switch (currentPage){
				case 0:
					$('.ui-navbar .ui-btn').removeClass('currentBtn');
					$('#lastSleepBtn').addClass('currentBtn');
				break;
				case 1:
					$('.ui-navbar .ui-btn').removeClass('currentBtn');
					$('#sleepLabBtn').addClass('currentBtn');
				break;
				case 2:
					$('.ui-navbar .ui-btn').removeClass('currentBtn');
					$('#trendsBtn').addClass('currentBtn');
				break;
				case 3:
					$('.ui-navbar .ui-btn').removeClass('currentBtn');
					$('#settingsBtn').addClass('currentBtn');
				break;
			}
		});
		
		$('.ui-header .ui-navbar .ui-btn').on("touchstart",function(){
			$('.ui-header .ui-navbar .ui-btn').removeClass('currentBtn');
			$(this).addClass("currentBtn");
		}).on("touchend",function(){
			//$(this).removeClass("currentBtn");
		});
		
		$('#lastSleepBtn').on('touchend',function(){
			myScroll.goToPage(0,0);
		});
		
		$('#sleepLabBtn').on('touchend',function(){
			myScroll.goToPage(1,0);
		});
		
		$('#trendsBtn').on('touchend',function(){
			myScroll.goToPage(2,0);
		});
		
		$('#settingsBtn').on('touchend',function(){
			myScroll.goToPage(3,0);
		});
		
	}
	
	function resize(){
		// Resize based on device size (maybe put into a single function?)
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		//alert(windowWidth+" "+windowHeight);
		//alert( "before" +$('.ui-header').height());
		//$('.ui-header').height(windowHeight*.3);
		//$('.ui-header .ui-btn').css('font-size', windowHeight*.03+"px" );
		//alert( $('.ui-header').height());
		var headerHeight = $('.ui-header').height();
		var footerHeight = $('#home .ui-footer').height();
		//alert(windowHeight+" "+headerHeight+" "+footerHeight);
		$('#viewport,#wrapper, .slide, .content ').height(windowHeight - headerHeight - footerHeight).width(windowWidth);
		$('#scroller').height(windowHeight - headerHeight - footerHeight).width(4*windowWidth);
		//$('.ui-header .ui-btn').css('font-size', windowHeight*0.025+"px");
		var mainPieHeight = $('#main-pie').height();
		//alert("mph"+mainPieHeight);
		var mainPieWidth = $('#main-pie').width();
		$('.whiteStripe').width(mainPieHeight*0.55);
		$('.pieLabel').height( mainPieHeight*0.8).width(mainPieHeight*0.8).css('margin-left', -mainPieHeight*0.4);
		//alert($('.pieLabel').height());
		$('#lsTrend').css('font-size', mainPieHeight*0.35+"px" );
		$('#lsLabel').css('font-size', mainPieHeight*0.07+"px" );
		$('#lsLabel').css('font-size', mainPieHeight*0.065+"px" );
		$('#legend').css('font-size', mainPieHeight*0.065+"px" ); // doesn't work with No EEG in there... ugh
		$('#legend').css('font-size', mainPieHeight*0.045+"px" );
		$('#legend').css('font-size', (windowWidth - mainPieHeight)*1.1/12+"px" );
		$('#lsDate').css('font-size', mainPieHeight*0.07+"px" );
		$('#stat1data, #stat2data').css('font-size', mainPieWidth*0.15+"px" ); // *.20
		$('.statTitle').css('font-size', mainPieWidth*0.04+"px" ); // *.07
		$('.statlabel').width(mainPieHeight*0.60).height(mainPieHeight*0.60).css('top', ($('#trendsTitleContainer').height() + 0.25*$('#trends-day').height()) +"px");
		$('.statlabel').width(mainPieHeight*0.60).height(mainPieHeight*0.60).css('top', ($('#trendsTitleContainer').height() + 0.27*$('#trends-day').height()) +"px");
		$('#stat1label').css('margin-left', - (mainPieHeight*0.3 - 13)+"px");
		$('#stat2label').css('margin-right', -(mainPieHeight*0.3 - 13)+"px");
		
		// Algorithm Preference Popup
		var navbarheight = $('.ui-header .ui-navbar').height();
		var sleeplabheight = ( $(window).height() - $('.ui-header').height() )/2;
		$('#instructions').height(navbarheight);
		$('#plotSpacer').height(sleeplabheight);
		$('#remainder').height( windowHeight - headerHeight - sleeplabheight);
		
		// Settings Page
		var h3Size = windowHeight*0.030;
		console.log(h3Size);
		$('#settings.slide h3, #languageBtn').css('font-size',h3Size);
		
		var h1Size = windowHeight*0.030;
		$('#settings.slide h1').css('font-size',h1Size);
		
		var h5Size = windowHeight*0.03;
		$('#settings.slide h5').css('font-size',h5Size);
		
		//var circleWidth = $('h1#cBtn').css('font-size');
		var circleWidth = $('#connectBtn2').height()*1.3;
		console.log(circleWidth);
		$('#connectCircle').width(circleWidth).height(circleWidth);
		
		
		$('#lsTable').css('font-size', windowHeight*0.025);
		$('#sleepLabTable .table-cell .value, #sleepLabTable .table-cell .label, #trendsTableContainer .table-cell .label, #trendsTableContainer .table-cell .value').css('font-size', windowHeight*0.025);
		$('#sleepLabTable .table-cell .label').css('margin-bottom', windowHeight*0.015);
		var slHeight = $('#line').height() + $('#subnav2').height() + $('#lineTitleH3').outerHeight();
		var headerOuterHeight = $('.ui-header').height();
		console.log(windowHeight+" "+headerOuterHeight+" "+footerHeight+" "+slHeight + " "+$('#line').height() + " " + $('#subnav2').height() + " "+ $('#lineTitleH3').outerHeight());
		$('#slTableContainer, #trendsTableContainer').height(windowHeight - headerOuterHeight - footerHeight - slHeight);
		$('.trendTitleTable').css('font-size',windowHeight*0.030);

		
		// For new settings page
		$('#settings .ui-btn.clear').css('font-size',windowWidth/20+"px");
		
		
		// For new All-Time Avgs Trends
		
		
		$('.avgScore, .avgRating, .avgBreakdown').css('font-size',mainPieWidth*0.04+"px");
		
		var avgScoreWidth = $('.avgScore').width();
		var avgRatingWidth = $('.avgRating').width();
		var avgBreakdownWidth = $('.avgBreakdown').width();
		$('.avgScore').css('left',(2.27*windowWidth - 0.5*avgScoreWidth)+"px");
		$('.avgRating').css('right',(1.26*windowWidth - 0.5*avgRatingWidth)+"px");
		$('.avgBreakdown').css('left',(2.5*windowWidth - 0.5*avgBreakdownWidth)+"px");
		$('.avgScore, .avgRating').css('top',($('#trendsTitleContainer').height() + 0.00*$('#trends-day').height() + 0.19*$('#trends-day').height() - 0.09*$('#trends-day').width() - 0.02*mainPieWidth) +"px");
		
		
		
		
		//$('.avgBreakdown').css('top',($('#trendsTitleContainer').height() + .38*$('#trends-day').height() + .18*$('#trends-day').width() + 0.02*mainPieWidth) +"px");
		$('.avgBreakdown').css('top',($('#trendsTitleContainer').height() + 0.73*$('#trends-day').height()) +"px");
	
	}
	
	function msFromMidnight(d){
		var f = new Date(d);
		var e = new Date(d);
		var ms = e - f.setHours(0,0,0,0);
		//alert(ms);
		if (ms < 12*3600*1000){
			ms += 24*3600*1000;
		}
		
		//alert(ms);
		return ms;
	}
	
	function updateSignalStrengthColor(val){
		
		/* if (val < 16){
			$('#sigContainer').removeClass().addClass('stage12'); // BEST
		}else if(val < 32){
			$('#sigContainer').removeClass().addClass('stage11');
		}else if(val < 48){
			$('#sigContainer').removeClass().addClass('stage10');
		}else if(val < 64){
			$('#sigContainer').removeClass().addClass('stage9');
		}else if(val < 80){
			$('#sigContainer').removeClass().addClass('stage8');
		}else if(val < 96){
			$('#sigContainer').removeClass().addClass('stage7');
		}else if(val < 112){
			$('#sigContainer').removeClass().addClass('stage6');
		}else if(val < 128){
			$('#sigContainer').removeClass().addClass('stage5');
		}else if(val < 144){
			$('#sigContainer').removeClass().addClass('stage4');
		}else if(val < 160){
			$('#sigContainer').removeClass().addClass('stage2');
		}else if(val < 176){
			$('#sigContainer').removeClass().addClass('stage5'); // WORST
		}else{
			$('#sigContainer').removeClass();
		} */
		
		if (val < 51){
			// $('#sigContainer').removeClass().addClass('stage12');
			// $('#signalStrengthCircle').html('Good');
			$('.sigContainer').addClass('off');
			$('#sigContainer3').removeClass('off');
			$('#signalTip').html(labelTut4GoodMessage);
		}else if (val < 81){
			// $('#sigContainer').removeClass().addClass('stage6');
			// $('#signalStrengthCircle').html('Okay');
			$('.sigContainer').addClass('off');
			$('#sigContainer2').removeClass('off');
			$('#signalTip').html(labelTut4GoodMessage);
		}else{
			// $('#sigContainer').removeClass();
			// $('#signalStrengthCircle').html('Bad');
			$('.sigContainer').addClass('off');
			$('#sigContainer1').removeClass('off');
			$('#signalTip').html(labelTut4BadMessage+"<br><br>"+labelTut4BadMessage2);
		}
		
		//val = parseInt(100-map(val,0,191,0,100));
		//$('#signalStrengthCircle').html(val);
	}

	
	function resizeTutorial(){
		var windowWidth = $(window).width(), windowHeight = $(window).height();
		$('#tutorial-content h1').css('font-size',windowHeight/20+'px');
		$('#tutorial-content h3').css('font-size',windowHeight/30+'px');
		//$('#tutorial-content p').css('font-size',windowHeight/34+'px');
		$('#tutorial-content p').css('font-size',windowHeight/36+'px');
	}

	
	function loadHomePage(){
		resize();
		if (!homeSetUp){
			//alert('in homeSetUp conditional');

			loadiScroll(); 		// iScroll Stuff
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			homeSetUp = true;
		}else{
			//alert('in other side of conditional');
		}
		
		
		if (localStorage.currentLanguage){
			currentLanguage = localStorage.currentLanguage;
		}else{
			localStorage.currentLanguage = "en";
			currentLanguage = "en";
		}
		
		
		// Setup i18n 
		
		var options ={   
		   lng: currentLanguage ,  
		   resGetPath: 'locales/__lng__/__ns__.json'
		};

		// Initial Translation
		i18n.init(options, function() {
			$("html").i18n(); //.navbar, #lastsleep, #sleeplab, #trends
			//alert('here');
			//Grab values for dynamically loaded content (i.e. plot labels, loading widgets, etc.);
			if (currentLanguage == "zh"){
				$('*').addClass('fontWeightNormal');  
			}else{
				$('*').removeClass('fontWeightNormal');  
			}
			loadLabels();
			
			
			$('#selectedLanguage').html(labelCurrentLanguage);
			if (localStorage.alarmTime){
				updateAlarmDisplay(retrieveAlarm(parseInt(localStorage.alarmTime)));
			}else{
				updateAlarmDisplay(retrieveAlarm(7*3600*1000));
			}
			if (dataStored === "true"){
				$('#sleepName').html(labelEndSleep).addClass('alternative');
			}else{
				$('#sleepName').html(labelStartSleep);
			}
			
			// Pull graph data from localStorage and update plots
			loadPlots();
			var date = new Date(dayData[dayData.length -1].time);
			var replacementObj = {
				"%d%": date.getDate(),
				"%m%": (date.getMonth()+1),
				"%y%": date.getFullYear()
			};
			var str = labelYear;
			str = str.replace(/%\w+%/g, function(all) {
				return replacementObj[all] || all;
			});
			var newLabel = str;
			//alert(newLabel);
			$('#lsDate,#labDate').html(newLabel);
			//navigator.splashscreen.hide();
		
				   
		});
		
		//$('.ui-popup').popup('close');
		
		//loadPlots();
		
		//alert('after i18n');
		
		//alert(i18n.t("lastsleep.legend.legend1"));

		// Change Translation on Button Click
		$('#chBtn').on('click',function(){
			toLanguage = "zh";
			currentLanguage = "zh";
			localStorage.currentLanguage = currentLanguage;
			$('#languageHelp').popup('close');
			console.log('here');
			
		
		});
		
		$('#enBtn').on('click',function(){
			toLanguage = "en";
			currentLanguage = "en";
			localStorage.currentLanguage = currentLanguage;
			$('#languageHelp').popup('close');
			console.log('here');

		});

		$('#languageHelp').on('popupafterclose',function(){
			//$('#loadingPopup img').addClass('noDisplay');
			//$('#loadingPopup').popup('open');
			
			if (toLanguage){
				$('#changingPopup').popup('open');
				options ={ 
				   lng: toLanguage ,  
				   resGetPath: 'locales/__lng__/__ns__.json'
				};
				
				i18n.init(options, function(t) {
					$("html").i18n();
					if (toLanguage == "zh"){
						setTimeout(function(){
							$('*').addClass('fontWeightNormal');  
						},100);
					}else{
						$('*').removeClass('fontWeightNormal');  
					}
					//Grab values for dynamically loaded content (i.e. plot labels, loading widgets, etc.);
					loadLabels();
					
					
					//get replacement obj
					
					var date = new Date(dayData[dayData.length -1].time);
					var replacementObj = {
						"%d%": date.getDate(),
						"%m%": (date.getMonth()+1),
						"%y%": date.getFullYear()
					};
					var str = labelYear;
					str = str.replace(/%\w+%/g, function(all) {
						return replacementObj[all] || all;
					});
					var newLabel = str;
					//alert(newLabel);
					$('#lsDate,#labDate').html(newLabel);
					$('#selectedLanguage').html(labelCurrentLanguage);
					if (  $('#lsTrend').html() === '?' ) {
						$('#lsLabel').html(labelPoorEEG);
					}else{
						$('#lsLabel').html(labelQualitySleepScore);
					}
					
					if (dataStored === "true"){
						$('#sleepName').html(labelEndSleep);
					}else{
						$('#sleepName').html(labelStartSleep);
					}
					
					if (localStorage.alarmTime){
						//alert('in here');
						updateAlarmDisplay(retrieveAlarm(parseInt(localStorage.alarmTime)));
					}else{
						updateAlarmDisplay(retrieveAlarm(7*3600*1000));
					}
					// Pull graph data from localStorage and update plots
					loadPlots();
					toLanguage = "";
				});
			}
		});
		
		
		
		// Set Highcharts colors and date format
		Highcharts.setOptions({
			//colors: [DEEP/GREEN, LIGHT/YELLOW, AWAKE/RED, DARKBLUE , TAN, LIGHTBLUE, LIGHTGRAY]
			//colors: ['#77B03C', '#FBE372', '#DB4B4E', '#33495d', '#d6e7c5', '#63a2c5', '#CCCCCC'],
			//colors: [DEEP/Dark Blue, LIGHT/Light blue, AWAKE/Yellow, DARKBLUE , TAN, LIGHTBLUE, LIGHTGRAY]
			colors: ['#33495d', '#63a2c5', '#FBE372', '#33495d', '#d6e7c5', '#63a2c5', '#A0A0A0 '],
			global:{
				useUTC: false,
			}
		});
				
		Highcharts.dateFormats = {
			// H: function (timestamp) {
				// var date = new Date(timestamp);
				// var hours = date.getHours();
				// if (hours === 12){
					// return 12;
				// }else if (hours === 0){
					// return 12;
				// }else{
					// return (hours)%12;
				// }
			// }
		};
		
		//$('.ui-popup').enhanceWithin().popup({positionTo: "window"});
		
		//alert('end of pagecreate');
		
		var volumeRange = $('#volumeControl');
		volumeRange.on("change mousemove", function(e){ // removed mousemove handler
			
			if (volumeSetDisabled){ // used to check for: volumeRange.prop("disabled")
			
			}else{
				//alert('swipe off');
				// disableSwipe();
				// var newVal = - (volumeRange.val() - 140);
				
				var newVal = volumeUnmap2(volumeRange.val());
				//alert(newVal);
				
				if (newVal !== currentVolume){
					var now = new Date().getTime();
					if ( now - volumeUpdateTime > 100){
						setVolCmd(newVal);
						volumeUpdateTime = now;
					}
				}else{
				} 
				
				/* var newVal = volumeUnmap(volumeRange.val());
				
				if (newVal !== currentVolume){
					var now = new Date().getTime();
					if ( now - volumeUpdateTime > 100){
						setVolCmd(newVal);
						volumeUpdateTime = now;
					}
				}else{
				} */
			}
		});
		
		var balanceRange = $('#volumeBalance');
		balanceRange.on("change mousemove", function(e){ // removed mousemove handler
			//alert('volumeBalance change event fired');
			
			if (volumeSetDisabled ){ // used to check for: balanceRange.prop("disabled")
			
			}else{
				
				// disableSwipe();
				var balVal = parseInt(balanceRange.val());	
				if (balVal < 0){
					balVal += 256;
				}
				//alert("New Balance: "+ balVal + ", Current Balance: "+ currentBalance);
				if (balVal != currentBalance){
					var now = new Date().getTime();
					if ( now - balanceUpdateTime > 100){
						setBalCmd(balVal);
						balanceUpdateTime = now;
					}
					
				}else{
				}
			}
		});
			
			
		//alert('end of loadHomePage()');
	}

	function msFromMidnightUnshifted(d){
		var f = new Date(d);
		var e = new Date(d);
		var ms = e - f.setHours(0,0,0,0);		
		return ms;
	}
	function getMSfromNow(alarmMS){
		var now = new Date().getTime();
		return (alarmMS - now);
	}
	
	function correctAlarmTime(date){
		var now = new Date();
		var alarm = new Date(date);
		alarm.setFullYear(now.getFullYear(),now.getMonth(),now.getDate());
		now = now.getTime();
		var correctedAlarm = new Date(alarm);
		correctedAlarm.setDate(new Date(now).getDate());
		var correctedAlarmMS = correctedAlarm.getTime();
		if (correctedAlarmMS < now){
			correctedAlarmMS += 24*3600*1000;
		}
		
		return correctedAlarmMS;
		//correctedAlarm = new Date(correctedAlarmMS);
		//return [(correctedAlarmMS - now), msFromMidnight(correctedAlarmMS)];
	}
	
	function getTemporalFromNow(date){
		var now = new Date();
		var alarm = new Date(date);
		alarm.setFullYear(now.getFullYear(),now.getMonth(),now.getDate());
		var correctedAlarm = new Date(alarm);
		correctedAlarm.setDate(new Date(now).getDate());
		
		var hoursFromNow = correctedAlarm.getHours() - now.getHours();
		if (hoursFromNow < 0){
			hoursFromNow += 24;
		}
		var minutesFromNow = correctedAlarm.getMinutes() - now.getMinutes();
		if (minutesFromNow < 0){
			minutesFromNow += 60;
			hoursFromNow -= 1;
			if (hoursFromNow < 0){
				hoursFromNow += 24;
			}
			
		}
		
		//return "Set alarm for: "+hoursFromNow +" hrs "+ minutesFromNow +" mins from now";
		return [hoursFromNow, minutesFromNow];
	}
	
	function retrieveAlarm(alarmMSfromMidnight){
		//alert('beginning of retrieveAlarm'+ typeof alarmMSfromMidnight);
		var now = new Date();
		var base;
		if (msFromMidnightUnshifted(now.getTime()) < alarmMSfromMidnight){ // if we haven't hit the relative time yet today, we add the relative to midnight today (which has already happened)
			base = now.setHours(0,0,0,0); 
		}else{
			base = now.setHours(24,0,0,0);
		}
		//alert('before creating alarmTime ');
		//alert(base+alarmMSfromMidnight);
		var alarmTime = new Date(base + alarmMSfromMidnight);
		//alert('end of retrieveAlarm');
		return alarmTime.getTime(); // this will get sent to msFromNow   for sending to BLE device
	}
	
	function updateAlarmDisplay(alarmMS){
		var alarmDate = new Date(alarmMS);
		var alarmHour = alarmDate.getHours();
		var alarmAMPM = "AM";
		if (alarmHour === 0){
			alarmHour = 12;
		}else if(alarmHour > 12){
			alarmHour -=12;
			alarmAMPM = "PM";
		}
		var alarmMinute = alarmDate.getMinutes();
		if (alarmMinute < 10){
			alarmMinute = "0"+alarmMinute;
		}
		
		var replacementObj = {
			"%H%":alarmDate.getHours(), // 24 hr
			"%M%":alarmMinute,
			"%h%":alarmHour, // 12 hr
			"%P%":alarmAMPM
		};
		
		var str = labelTimeAlt;
		
		str = str.replace(/%\w+%/g, function(all) {
			return replacementObj[all] || all;
		});
		
		$('#alarmTime').html(str);
		//alert(alarmHour+":"+alarmMinute+" "+alarmAMPM);
		//$('#alarmTime, #alarmOnOff').addClass('on');
		$('.ui-datebox-container input').prop('readonly','true');
	}

