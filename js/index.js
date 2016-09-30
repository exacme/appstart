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
var address,
	btnPressed,
	foundDevices = [],
	foundRssi = [],
	deviceToTry = 0,
	addressTried,
	syncEndTime,
	platform,
//	deviceSetup = false,
	getaccflag = false,
	packetCounter,
	expectedCount = 0,
	accelX = [],
	accelY = [],
	accelZ = [],
	accountsDB,
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

	labelHours = "hrs", 
	labelMins = "mins", 
	labelMin = "min", 
	labelConnect = "connect",
	labelDisconnect = "disconnect",
	labelStart = "start",
	labelStop = "stop",
	labelConnecting = "connecting",
	labelConnected = "connected",
	labelDisconnecting = "disconnecting",
	labelStarting = "starting",
	labelRetrieving = "retrieving",
	labelStartSleep = "Start Sleep",
	labelTime = "%l<br>%p",
	labelTimeAlt = "%h%:%M% %P%",
	labelWeekly = "%m1%/%d1%-<br>%m2%/%d2%",
	labelDaily = "%m%/%d%",
	labelYear = "%m%/%d%/%y%",
	labelDisconnectMessage = "You're connected. To disconnect, press the button below",
	labelConnectMessage = "To access volume controls, connect with the button below",
	labelEnglish = "English | English",
	labelChinese = "中文 | Chinese",
	labelCurrentLanguage = "English",
	labelMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	/*-ADD IN NEW LABELS (FOR TUTORIAL, ETC) HERE-*/

	accelInterval,
	toLanguage = "",
	yesConfirmHat = false,
	yesReconnect = false,
	connectTimeout,
	notEnoughData = false,
	disconnecting = false,
	homeSetUp = false,

	startRecordingClicked = false,
	globalAlarmTime = 86400000,
	currentLanguage = "en",
	storedDataLength = 0,

	bluetoothEnabled = false,
	splashHidden = false,
	
	loggedinflag = false,
	loggedinaccount,
	loggedinfirstname,
	loggedinlastname,
	loggedinname,
	yesloginflag = false,

	noaccountyet = false,
	yesaddplayerflag = false,
	flagselectednewplayer = false,
	flagexistuserid = false,
	flagcreateid=false,
	selectedPlayer,
	selectedfirst, 
	selectedlast,
	playerfirst, 
	playerlast,
	nametodelete,	
	currentplayername,
	currentplayeruserid,	
	
	deletefirst, 
	deletelast,

	stopjumpTime,
	startjumpTime,
	startjumpTimeflag = false,
	
	jumptotaltime = 0,
	jumpcalerie = 0,
	jumpcounts = 0 ,
	thistimeheight = 0,
	totalheightest = 0,
	jumpcategory= 0,
    jumpcomments = 'none',
	samp_time = 0.04;

	yesStartnewdata = false,
	yesSavedataflag = false,
	flagdatanotsave = false,

	playerlist=[]
	
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

        // document.addEventListener('deviceready', this.onDeviceReady, false);
		// document.addEventListener("resume", onResume, false);
		// document.addEventListener("pause", onPause, false);
		$(document).on('pagebeforeload',function(event){
			//alert('before page load ');
			//MobileAccessibility.getTextZoom(getTextZoomCallback);
		});
		
		$(document).on('pagebeforecreate',function(event){
			//alert('before page create ');
			//MobileAccessibility.getTextZoom(getTextZoomCallback);
		});
		console.log(navigator.userAgent);
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
			//alert('on device');
			document.addEventListener("deviceready", this.onDeviceReady, false);
		}else if (navigator.userAgent.match(/(Chrome|Mozilla)/)){
			//alert('on browser');
			this.onDeviceReady();
		}else   {
			//alert('on browser else');
			this.onDeviceReady();
		}
    },
// deviceready Event Handler	
	
    onDeviceReady: function() {
		$.mobile.hashListeningEnabled = false;

		if (typeof MobileAccessibility !== "undefined"){
			MobileAccessibility.setTextZoom(100,setTextZoomCallback);
		}
		
		//navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
		
		if (typeof device !== "undefined"){
			platform = device.platform;
			if (device.platform == "iOS"){
				StatusBar.backgroundColorByHexString("#33495D");
			}
		}else{
			platform = "Android";
		}
		// -- ENABLE BACKGROUND MODE --//
		//cordova.plugins.backgroundMode.enable();
		
		 // alert('Device Ready');
		if (typeof jQuery === 'undefined') {  
			alert('jQuery has not been loaded!');  
		}			
		
		$(document).on('pagecontainershow',function(event, ui){
			console.log("in  show "+ui.toPage[0].id);
			if (ui.toPage[0].id === "home"){
				console.log('before home load');
				//MobileAccessibility.getTextZoom(getTextZoomCallback);				
				loadHomePage();
				$('#forgetDevice').removeClass('noDisplay');	
			}else{
				$('.ui-popup').popup('close');
			}
		}); 		
			
		if ( !localStorage.firstinsert || localStorage.firstinsert==='false' ) {
			localStorage.setItem("firstinsert", "true");
			noaccountyet = true;
		//	alert('localStorage '+ localStorage.firstinsert);
		}
/*		if ( !localStorage.loggedinflag) {
			localStorage.setItem("loggedinflag", "false");
			//alert('localStorage set to false 1');
		}else if (localStorage.loggedinflag ==="true") {
			loggedinaccount = localStorage.loggedinaccount;
			loggedinfirstname = localStorage.loggedinfirstname;
			loggedinlastname = localStorage.loggedinlastname;	
			loggedinname = loggedinfirstname +" "+loggedinlastname;
			loggedinflag = JSON.parse(localStorage.loggedinflag);	
			//alert('localStorage set to true');
		}else{
			localStorage.setItem("loggedinflag", "false");
			//alert('localStorage set to false else??');
		}*/
		
		if(localStorage.loggedinflag ==="true"){
			loggedinflag = true;
			loggedinaccount = localStorage.loggedinaccount;
			loggedinfirstname=localStorage.loggedinfirstname;
			loggedinlastname=localStorage.loggedinlastname;		
			loggedinname = loggedinfirstname +" "+loggedinlastname;
			document.getElementById("LoginPopupBtn").innerHTML = "LOGOUT";
			document.getElementById("LoginPopupBtn").style.color = "white";
			document.getElementById("LoginPopupBtn").style.backgroundColor= "transparent";
			document.getElementById("LoginPopupBtn").style.border = "transparent"; 		
			
		}else{ //not defined; 	
			localStorage.setItem("loggedinflag", "false");
			loggedinflag = false;
			document.getElementById("LoginPopupBtn").innerHTML = "LOGIN";
			document.getElementById("LoginPopupBtn").style.color = "white";
			document.getElementById("LoginPopupBtn").style.backgroundColor= "transparent";
			document.getElementById("LoginPopupBtn").style.border = "transparent";  		
		}
		
		if(localStorage.playerlist){
			playerlist = JSON.parse(localStorage.getItem('playerlist'));
			console.log(playerlist);  // Should be something like [Object array]		
		}		
		
	// Instantiate popups
		$('#continuesavePopup,#CreateIDPopup,#chooseplayerPopup,#startnewcessionPopup,#stopjumpPopup,#savedataPopup,#disonnectingPopup,#deleteconfirmPopup,#deleteplayerPopup,#addplayerPopup,#listingPopup,#LoginPopup').enhanceWithin().popup({positionTo: "window"});
		$('#forceReconnectPopup,#reconnectPopup, #confirmHatPopup, #connectPopup, #timeoutPopup, #noDevicesPopup, #forgetPopup, #startPopup, #endPopup, #noSavedPopup, #bluetoothPopup, #loadingPopup, #startingPopup,#connectingPopup, #disconnectingPopup,#errorPopup').enhanceWithin().popup({positionTo: "window"});
		
		//database
		if (platform === "Android"){
			accountsDB = window.sqlitePlugin.openDatabase({ name: 'playerdb.db', location: 'default' }, function (accountsDB) { // 
				// Here, you might create or open the table.
				accountsDB.transaction(function (tx) {
					// ...create player account table; 
					tx.executeSql('CREATE TABLE IF NOT EXISTS playeraccounts (firstname, lastname, userID, createpassword)'); //,address1,address2,city,state,zipcode,country,age,weight,gender,email,createpassword
					// ...create player list table; 
					tx.executeSql('CREATE TABLE IF NOT EXISTS playlist (serialnumber, firstname, lastname)'); //,address1,address2,city,state,zipcode,country,age,weight,gender,email,createpassword
					tx.executeSql('CREATE TABLE IF NOT EXISTS historydataTable (userID,gamedatetime,totaltime,totalcalorie,totaljumps,totalheight,categoryrate,comments)'); //data table; 
									
				}, function (error) {
					//console.log('transaction error: ' + error.message);
					alert("create table error");
				}, function () {
					//console.log('transaction ok');			
				//	alert("created table success");
				});	
				
			}, function (error) {
				//console.log('Open database ERROR: ' + JSON.stringify(error));
				alert("open database error.");
			});				
		}else if(platform === "iOS"){
			accountsDB = window.openDatabase("playerdb.db", "1.01", "player_account",' ');
			
			setTimeout(function(){
				accountsDB.transaction(function (tx) {
					// ...create player account table; 
					tx.executeSql('CREATE TABLE IF NOT EXISTS playeraccounts (firstname, lastname, userID, createpassword)'); //,address1,address2,city,state,zipcode,country,age,weight,gender,email,createpassword
					// ...create player list table; 
					tx.executeSql('CREATE TABLE IF NOT EXISTS playlist (serialnumber, firstname, lastname)'); //,address1,address2,city,state,zipcode,country,age,weight,gender,email,createpassword
					tx.executeSql('CREATE TABLE IF NOT EXISTS historydataTable (userID,gamedatetime,totaltime,totalcalorie,totaljumps,totalheight,categoryrate,comments)'); //data table; 
									
				}, function (error) {
					console.log('transaction error: ' + error.message);
					alert('transaction error: ' + error.message);
				}, function () {
					console.log('transaction ok');			
					alert("created table success");
				});	
			},100);			
		}else{ //other platform; 
			
		}

		
//click on page button; 
//////////////////////
		$("#manageplayerBtn").on('click', function(){ 
			$('#playerlistview').html(''); //clear current display list for new display; 
			var len = playerlist.length,i; 
			for (i = 0; i < len; i++){
				$('#playerlistview').append( '<li>'+playerlist[i]+'</li>' );
			}
		});	
		
		$("#playgameBtn").on('click', function(){ 
			$('#playerselect').html(''); //clear current display list for new display;
			$('#playerselect').append( '<option value="0" selected="selected">Choose a player</option>' );
			var len = playerlist.length,j=0,i; 
			for (i = 0; i < len; i++){
				j=i+1;
				$('#playerselect').append( '<option value="'+j+'">'+playerlist[i]+'</option>' );
			}
		});	
		
		$('#loginBtn').on("click",function(){
			//alert('click for yes confirm');
			yesloginflag = true;
			$('#LoginPopup').popup('close');
		});		
					
		$('#LoginPopupBtn').on('click',function(){
			
			if(loggedinflag === false){
				$('#LoginPopup').popup('open');
			//	alert('not login  '+loggedinflag);
			}
			else{
				loggedinaccount = null;
				loggedinfirstname = null;
				loggedinlastname = null;	
				loggedinflag = false;
				localStorage.loggedinflag = "false";				
				localStorage.loggedinaccount = null;
				localStorage.loggedinfirstname = null;
				localStorage.loggedinlastname = null;
				
				document.getElementById("LoginPopupBtn").innerHTML = "LOGIN";
				document.getElementById("LoginPopupBtn").style.color = "white";
				document.getElementById("LoginPopupBtn").style.backgroundColor= "transparent";
				document.getElementById("LoginPopupBtn").style.border = "transparent"; 
			//	alert('logged in, need to log out  '+loggedinflag);				
			}				
		})
		$('#LoginPopup').on('popupafterclose',function(){
			if(yesloginflag === true){
				yesloginflag = false;
				loggedinflag===false;
				var logsuccessflag;
				var loginid = document.getElementById("loginuserid").value;
				var loginpw = document.getElementById("loginpassword").value;
				setTimeout(function(){
					if(!loginid || !loginpw){
						alert("please input valid user ID or password");
						logsuccessflag = false;
					//	$('#LoginPopup').popup('close');	
						$('#LoginPopup').popup('open');
						return;					
					}
				},100);
				SQLitefinishflag = false;
				accountsDB.transaction(function (tx) {
					var query = "SELECT firstname, lastname, userID, createpassword FROM playeraccounts WHERE userID =? AND createpassword=?";
					tx.executeSql(query, [loginid,loginpw], function (tx, resultSet) {

						var len = resultSet.rows.length;
						console.log("found userid: "+len);
						if (len === 0 ){					
							alert("UserID or PW not match; reinput;");						
						}
						else{							
							loggedinfirstname = resultSet.rows.item(0).firstname;
							loggedinlastname = resultSet.rows.item(0).lastname;
							loggedinname = loggedinfirstname+" "+loggedinlastname;
							console.log("user "+loggedinname+" logged in");
							loggedinaccount = loginid;							
							localStorage.loggedinaccount = loginid;
							localStorage.loggedinflag = "true";
							loggedinflag = true;
							localStorage.loggedinfirstname = loggedinfirstname;
							localStorage.loggedinlastname = loggedinlastname;							
						//	lableloginid = loginid.text();
							document.getElementById("LoginPopupBtn").innerHTML = "LOGOUT";							
							
							$('#LoginPopup').popup('close');
							$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");	
						}	
					}, function (error) {
						console.log('find error: ' + error.message);
					});	
				}); 
				
				setTimeout(function(){
						$('.ui-popup').popup('close');

					if(loggedinflag===false){
						console.log("Login false");
						$('#LoginPopup').popup('open');return;
					}else{						
						console.log("Login success and add user step;");
						var a = playerlist.indexOf(loggedinname);
						if(a<0){//loggin user not in playerlist
							playerlist.push(loggedinname);
							console.log('login player added to playerlist');
						}else{
							console.log("Login Player is in playerlist "+loggedinname);
						}
					}			
				},100);
			} //if(yesloginflag === true) 
			
		}); 		
		
/////////////////////////
		$('#playerselect').on('change', function() {
		//	if(flagdatanotsave === true){
		//		$('#startnewcessionPopup').popup('open');
		//	}else{
				selectedPlayer = $(this).val();
				currentplayername = $('option:selected',this).text();
				var substr = currentplayername.split(" ");
				playerfirst = substr[0];
				playerlast = substr[1];

				console.log ("The selected user Name is:"+currentplayername);
	/*			jumptotaltime = 0;
				jumpcalerie = 0;
				jumpcounts = 0 ;
				thistimeheight = 0;
				totalheightest = 0;
				jumpcategory= 0;
				jumpcomments = 'none';
				$('#bouncetime').html(jumptotaltime.toFixed(1));
				$('#bouncecount').html(jumpcounts);
				$('#energy').html(jumpcalerie.toFixed(1));
				$('#height').html(thistimeheight.toFixed(1));
				$('#heightsum').html(totalheightest.toFixed(1));*/
				if(selectedPlayer !==0){
					flagselectednewplayer = true;
				}else{
					flagselectednewplayer = false;
				} 	
					
		//	}
        });

		$("#addplayerBtn").on('click', function(){
			$('#addplayerPopup').popup('open');
		});	
		$('#notaddplayer').on("click",function(){
			$('#addplayerPopup').popup('close');
			yesaddplayerflag = false;
		});
		
		$('#yesaddplayer').on("click",function(){
			//alert('click for yes confirm');
			yesaddplayerflag = true;
			$('#addplayerPopup').popup('close');
			//alert("will add");
		});	

		$('#addplayerPopup').on('popupafterclose',function(){
			if(yesaddplayerflag ===true){
				console.log("playerlist : "+playerlist);	
				var str1 = document.getElementById("addfirstn").value;
				var str2 = document.getElementById("addlastn").value;
				var addfirstname=str1.trim(); //remove extra space from both end of names; 
				var addlastname=str2.trim();	
				var addfullname =  addfirstname+" "+addlastname;
				var a = playerlist.indexOf(addfullname);
				if(a < 0){//loggin user not in playerlist
				
					playerlist.push(addfullname);
					localStorage.setItem('playerlist', JSON.stringify(playerlist));			
					console.log('playerlist after add last person: '+playerlist);
					var len = playerlist.length;
					len=len + 1; 
					$('#playerlistview').append( '<li>'+addfullname+'</li>' );// insert success and diplay this name; 			
					console.log("playerlist : "+playerlist);					
				}	
				else{
					alert('player is in playerlist, please input a new name');
				}
			}else{
				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");	
			}
		});	
///		//delete player; 
		$("#deleteplayerBtn").on('click', function(){
			$('#deleteplayerPopup').popup('open');
		});	
		$('#notdeleteplayer').on("click",function(){
			$('#deleteplayerPopup').popup('close');
			yesdeleteplayerflag = false;
		});		
		$('#deleteselect').on('change', function() {
			selectedPlayer = $(this).val();	
			nametodelete  = $('option:selected',this).text();
			var substr = nametodelete.split(" ");

			deletefirst = substr[0];
			deletelast = substr[1];			
        //    alert ("The selected option is " + selectedPlayer);
			console.log("The selected name is:"+deletefirst+" "+deletelast);
        });		
		$('#notdeleteplayer').on("click",function(){
			$('#deleteplayerPopup').popup('close');
			yesdeleteplayerflag = false;
		});		
		
		$('#yesdeleteplayer').on("click",function(){
			yesdeleteplayerflag = true;
			$('#deleteplayerPopup').popup('close');
		});			
		$('#deleteplayerPopup').on('popupafteropen',function(){ 
			$('#deleteselect').html('');
			$('#deleteselect').append( '<option value="0" selected="selected">Choose a player</option>' );
			console.log("display delete list?  " + playerlist);
			var len = playerlist.length,j; 
			for (i = 0; i < len; i++){
				j=i+1;
				$('#deleteselect').append( '<option value="'+j+'">'+playerlist[i]+'</option>' );
			}
		});		

		$('#deleteplayerPopup').on('popupafterclose',function(){
			if(yesdeleteplayerflag ===true){
				if(nametodelete === "Choose a player"){
					alert('please choose a player name');
					return;
				}else{
					var a = playerlist.indexOf(nametodelete);
					var removed = playerlist.splice(a, 1);					
					localStorage.setItem('playerlist', JSON.stringify(playerlist));			
					console.log('playerlist after delete last person: '+playerlist);
					$('#playerlistview').html(''); //clear current display list for new display; 
					var len = playerlist.length;
					for (i = 0; i < len; i++){
						$('#playerlistview').append( '<li>'+playerlist[i]+'</li>' );
					}
				}								
			}
		});				

		$('#notcreateaccountBtn').on("click",function(){
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");	
		});	
		$('#createaccountBtn').on('click',function(){
			var accfirstname = document.getElementById("FirstName").value;
			var acclastname = document.getElementById("LastName").value;
			var accuserID = document.getElementById("Userid").value;
			var accpassword = document.getElementById("createpassword").value;
			if(!accfirstname || !acclastname || !accuserID || !accpassword){
				alert("please input valid name and ID");
				return;					
			}else{
				accountsDB.transaction(function (tx) {
					var query = "SELECT firstname, lastname, userID, createpassword FROM playeraccounts WHERE userID = ?";
					tx.executeSql(query, [accuserID], function (tx, resultSet) {
				//		console.log("len  "+resultSet.rows.length);

						var len = resultSet.rows.length;
						if (len !== 0 ){					
							console.log("find user id "+accuserID+ "; Please choose a new ID");
							alert("find user id "+accuserID+ "; Please choose a new ID");
						}else{
							addaccount(accfirstname, acclastname, accuserID, accpassword);
							$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");		
							console.log("user account added successfully");
						}	
				//		console.log("query finished;");
					}, function (error) {
						console.log('find error: ' + error.message);
					});	
				}); 				
			}				
						
		});		
		
		$('#CreateplayerIDBtn').on('click',function(){	
			flagcreateid = true;	
			console.log("Create: "+flagcreateid);			
			$('#CreateIDPopup').popup('close');
		});
		$('#CreateIDPopup').on('popupafterclose',function(){
			if(flagcreateid === true){
				var cid = document.getElementById("createID").value;
				var passw = document.getElementById("createpw").value;
				console.log("Create: "+cid+" "+passw);
				if(!cid || !passw){
					alert("Create: please input valid user ID or password");
					$('#CreateIDPopup').popup('open');	
					return;
				}else{
					accountsDB.transaction(function (tx) {
						var query = "SELECT firstname, lastname, userID, createpassword FROM playeraccounts WHERE userID = ?";
						tx.executeSql(query, [cid], function (tx, resultSet) {
							var len = resultSet.rows.length;
							if (len !== 0 ){					
								console.log("find user id "+cid+ "; Please choose a new ID");
							}else{
								console.log("create user id "+cid);
								addaccount(playerfirst, playerlast, cid, passw);
								currentplayeruserid = cid;
						//		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");		
<<<<<<< HEAD
								console.log("user account added successfully");							
=======
								console.log("user account added successfully");	
								$('#continuesavePopup').popup('open');									
>>>>>>> origin/master
							}	
						}, function (error) {
							console.log('find error: ' + error.message);
						});	
					});
				}
				flagcreateid=false;		
<<<<<<< HEAD
				$('#continuesavePopup').popup('open');				
=======
							
>>>>>>> origin/master
			}
		});	

		
		$('#closehelp').on('click',function(){
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#home");
		});	
	
		$('#noReconnect').on("click",function(){
			yesReconnect = false;
			bluetoothle.close(closeSuccess, closeFail, {"address":address});
			setTimeout(function(){
				('#connectBtn').html(labelConnect);
			}, 300);
			console.log("close reconnect??error:");			
			$("#reconnectPopup").popup();			
			$("#reconnectPopup").popup('close');
		});
		
		$('#noConnect').on("click",function(){
			$('#connectPopup').popup('close');
		});
		
		$('#savedataBtn').on("click",function(){
			console.log('Is still get acc data: '+getaccflag);
			if(getaccflag === true){
				$('#stopjumpPopup').popup('open');
			}else{
				$('#savedataPopup').popup('open');
			}			
		});	
		$('#returnBtn').on("click",function(){
			$('#stopjumpPopup').popup('close');
		});	
		$('#returnBtnchoose').on("click",function(){
			$('#chooseplayerPopup').popup('close');
		});			
		
		$('#yesSavedata').on("click",function(){
			//alert('click for yes confirm');
			yesSavedataflag = true;
			$('#savedataPopup').popup();
			$('#savedataPopup').popup('close');
		});		
		$('#noSavedata').on("touchend",function(){
			//alert('click for no confirm');
			yesSavedataflag = false;
			$('#savedataPopup').popup();
			$('#savedataPopup').popup('close');		
		});		
		
		$('#savedataPopup').on('popupafterclose',function(){
			console.log('save data popup after close');
			if (yesSavedataflag === true){	
			
				if(currentplayername !== undefined){
					console.log('currentplayername defined: '+currentplayername);
				}else{	
					console.log('currentplayername is undefined: '+currentplayername);				
					$('#chooseplayerPopup').popup();
					$("#chooseplayerPopup").popup('open');					
				}
				if(currentplayeruserid !== undefined){
					console.log('currentplayeruserid defined: '+currentplayeruserid);
					flagexistuserid =true; 
				}else{
					console.log('current ID is undefined: '+currentplayeruserid);	
					flagexistuserid =false; 
				}				
				console.log('flag of user exists: '+flagexistuserid);
				if(flagexistuserid ===false){
					$('#CreateIDPopup').popup();
					$('#CreateIDPopup').popup('open');
				}else{
					var d = new Date();
					var syncTime = d.getTime();				
					//insert data; 
					accountsDB.transaction(function (tx) {
						var query = "INSERT INTO historydataTable (userID,gamedatetime,totaltime,totalcalorie,totaljumps,totalheight,categoryrate,comments) VALUES (?,?,?,?,?,?,?,?)";
					//	alert("to add user");
						tx.executeSql(query, [currentplayeruserid, syncTime, jumptotaltime,jumpcalerie,jumpcounts,totalheightest,jumpcategory,jumpcomments], 
						function(tx, res) {
							jumptotaltime = 0;
							jumpcalerie = 0;
							jumpcounts = 0 ;
							totalheightest = 0;
							thistimeheight = 0;
							jumpcategory= 0;
							jumpcomments = 'none';
							$('#bouncetime').html(jumptotaltime.toFixed(1));
							$('#bouncecount').html(jumpcounts);
							$('#energy').html(jumpcalerie.toFixed(1));
							$('#height').html(thistimeheight.toFixed(1));
							$('#heightsum').html(totalheightest.toFixed(1));						
							sendClearDataCommand(); //clear data after save; 
							console.log('Save Data to history data table and clear data'); 
							flagdatanotsave = false;
						},
						function(tx, error) {
							console.log('INSERT error: ' + error.message);
						});
					}, function(error) {
						console.log('transaction error: ' + error.message);
					}, function() {
						console.log('tranction OK');
					});	
					
					console.log("check data"); //check data; 
					setTimeout(function(){
						accountsDB.transaction(function (tx) {
							tx.executeSql('SELECT * FROM historydataTable', [], function (tx, results) {
							var len = results.rows.length, i;
							console.log("user data save number: "+len); //check data; 
							for (i = 0; i < len; i++){
								console.log("user data: "+results.rows.item(i).userID);						
							}
							});
						});
					}, 300);					
				}							
			}else{
				$('#startnewcessionPopup').popup('open');			
			}
			
			
		});		

		$('#continuesaveBtn').on('click',function(){
					$('#continuesavePopup').popup('close');
					var d = new Date();
					var syncTime = d.getTime();				
					//insert data; 
					accountsDB.transaction(function (tx) {
						var query = "INSERT INTO historydataTable (userID,gamedatetime,totaltime,totalcalorie,totaljumps,totalheight,categoryrate,comments) VALUES (?,?,?,?,?,?,?,?)";
					//	alert("to add user");
						tx.executeSql(query, [currentplayeruserid, syncTime, jumptotaltime,jumpcalerie,jumpcounts,totalheightest,jumpcategory,jumpcomments], 
						function(tx, res) {
							jumptotaltime = 0;
							jumpcalerie = 0;
							jumpcounts = 0 ;
							totalheightest = 0;
							thistimeheight = 0;
							jumpcategory= 0;
							jumpcomments = 'none';
							$('#bouncetime').html(jumptotaltime.toFixed(1));
							$('#bouncecount').html(jumpcounts);
							$('#energy').html(jumpcalerie.toFixed(1));
							$('#height').html(thistimeheight.toFixed(1));
							$('#heightsum').html(totalheightest.toFixed(1));						
							sendClearDataCommand(); //clear data after save; 
							console.log('Save Data to history data table and clear data'); 
							flagdatanotsave = false;
						},
						function(tx, error) {
							console.log('INSERT error: ' + error.message);
						});
					}, function(error) {
						console.log('transaction error: ' + error.message);
					}, function() {
						console.log('tranction OK');
					});	
					
					console.log("check data"); //check data; 
					setTimeout(function(){
						accountsDB.transaction(function (tx) {
							tx.executeSql('SELECT * FROM historydataTable', [], function (tx, results) {
							var len = results.rows.length, i;
							console.log("user data save number: "+len); //check data; 
							for (i = 0; i < len; i++){
								console.log("user data: "+results.rows.item(i).userID);						
							}
							});
						});
					}, 300);					
			
		});				
		
		$('#yesStartnewdata').on("click",function(){
			//alert('click for yes confirm');
			yesStartnewdata = true;
			$('#startnewcessionPopup').popup();
			$('#startnewcessionPopup').popup('close');
		});		
		$('#noStartnewdata').on("touchend",function(){
			//alert('click for no confirm');
			yesStartnewdata = false;
			$('#startnewcessionPopup').popup();
			$('#startnewcessionPopup').popup('close');		
		});	
		$('#startnewcessionPopup').on('popupafterclose',function(){
			//alert('in confirm after close');
			if (yesStartnewdata === true){					
				jumptotaltime = 0;
				jumpcalerie = 0;
				jumpcounts = 0 ;
				thistimeheight = 0;
				totalheightest = 0;
				jumpcategory= 0;
				jumpcomments = 'none';
				$('#bouncetime').html(jumptotaltime.toFixed(1));
				$('#bouncecount').html(jumpcounts);
				$('#energy').html(jumpcalerie.toFixed(1));
				$('#height').html(thistimeheight.toFixed(1));
				$('#heightsum').html(totalheightest.toFixed(1));				
				sendClearDataCommand();	// clear data after give up save;		
			}
		});	
		
		$('#yesConfirmHat').on("click",function(){
			//alert('click for yes confirm');
			yesConfirmHat = true;
			$('#confirmHatPopup').popup();
			$('#confirmHatPopup').popup('close');
		});	
		$('#noConfirmHat').on("touchend",function(){
			//alert('click for no confirm');
			yesConfirmHat = false;
			disconnecting = false;
			forgettingDevice = false;
			$('#confirmHatPopup').popup();
			$('#confirmHatPopup').popup('close');			
		});	
		$('#confirmHatPopup').on('popupafterclose',function(){
			//alert('in confirm after close');
			if (yesConfirmHat === true){
				$("#connectBtn").html(labelDisconnect);
				$('#connectCircle').css('background','radial-gradient(lightblue,blue)');
				$('#forgetDevice').removeClass('noDisplay');
	
				address = addressTried;
				localStorage.address = address; 
				forgettingDevice = false; 
				console.log('confirmbutton: before first subscribe;');
				bluetoothle.subscribe(subSuccess, subFail, {"address":address,"service":serviceUuid,"characteristic":charUuid, "isNotification":true });	 			
			}else{
				clearTimeout(connectTimeout);
				$('#connectingPopup').popup('open');
				bluetoothle.close(closeSuccess,closeFail, {"address": address});
				setTimeout(function(){
						$('.ui-popup').popup('close');
				},100);
				$("#connectBtn").html(labelConnect);
			}
		});
		
		$('#confirmHatPopup').on('popupafteropen',function(){
			//alert('after open');
		});	

		$('#startBtn').on("click",function(){
			if(connected === false){
				setTimeout(function(){
					$('#connectPopup').popup();
					$('#connectPopup').popup('open');
				},100);
			}
			else{
					if(getaccflag === false){						
						getaccflag = true;
						$("#startBtn").html(labelStop);  // only for test; 
						if(flagselectednewplayer === true){							
							flagdatanotsave =true; 
							jumptotaltime = 0;
							jumpcalerie = 0;
							jumpcounts = 0 ;
							thistimeheight = 0;
							totalheightest = 0;
							jumpcategory= 0;
							jumpcomments = 'none';
							$('#bouncetime').html(jumptotaltime.toFixed(1));
							$('#bouncecount').html(jumpcounts);
							$('#energy').html(jumpcalerie.toFixed(1));
							$('#height').html(thistimeheight.toFixed(1));
							$('#heightsum').html(totalheightest.toFixed(1));
							flagselectednewplayer = false; 
							sendClearDataCommand(); //clear data of last player; 	
				
						} 	

						setTimeout(function(){
							$('.ui-popup').popup('close');
						},300);
						
						accelInterval = setInterval(function(){
							getAccel();
							getaccTimeout = setTimeout(function(){
								accConnectionLost();
							}, 3000);	
							
						},500);				
					}else{
						getaccflag = false;					
						clearInterval(accelInterval);
						if(getaccTimeout){clearTimeout(getaccTimeout);}
						$("#startBtn").html(labelStart);  // only for test; 
						setTimeout(function(){
							$('.ui-popup').popup('close');
						},100);				
					}						
			}

		});
		
		$('#closeTimeout').on("click",function(){
			//alert('here - before closing timeoutPopup');
			$('#timeoutPopup').popup('close');
		});
		
		$('#timeoutPopup').on('popupafterclose',function(){
			
			//alert('we get to timeoutPopup after close right?');
			var activePage = $('body').pagecontainer('getActivePage').prop('id');
			if (activePage === "tutorialTest"){				
				setTimeout(function(){
					$('#forceReconnectPopup').popup('open');
				},100);
			}
		});		
			
		$('#closeNoDevices').on("click",function(){
			$('#noDevicesPopup').popup();
			$('#noDevicesPopup').popup('close');
			var activePage = $('body').pagecontainer('getActivePage').prop('id');
			/* if (activePage === "tutorialTest"){
				setTimeout(function(){
					$('#forceReconnectPopup').popup('open');
				},100);
			} */
		});	

		$('#forgetDevice').on("click",function(){
			
			if (address){
				$('#forgetPopup').popup();
				$('#forgetPopup').popup('open');
			}else{
				$('#noSavedPopup').popup();
				$('#noSavedPopup').popup('open');
			}
		});
		
		
		$('#yesForget').on('click',function(){
			forgettingDevice = true;
			$('#forgetPopup').popup();
			$('#forgetPopup').popup('close');
			bluetoothle.isConnected(isConnectedSuccess, isConnectedFail,{"address":address});// can only be called successfully IF ADDRESS IS KNOWN!!!
		});
		
		$('#noForget').on('click',function(){
			$('#forgetPopup').popup();
			$('#forgetPopup').popup('close');
		});

		
		// On page buttons
		$('#createaccountBtn').on('touchstart',function(){
		//	alert("blah");
			$(this).addClass('hover');
		});
		
		$('#createaccountBtn').on('touchend',function(){
		//	alert("blah 2");
			$(this).removeClass('hover');
		});			
		
		
		$('#loginBtn').on('touchstart',function(){
			//alert("blah");
			$(this).addClass('hover');
		});
		
		$('#loginBtn').on('touchend',function(){
			//alert("blah 2");
			$(this).removeClass('hover');
		});	
			
		$('#connectBtn').on('touchstart',function(){
			//alert("blah");
			$(this).addClass('hover');
		});
		
		$('#connectBtn').on('touchend',function(){
			//alert("blah 2");
			$(this).removeClass('hover');
		});	
		$('#CreateplayerIDBtn').on('touchstart',function(){
			//alert("blah");
			$(this).addClass('hover');
		});
		
		$('#CreateplayerIDBtn').on('touchend',function(){
			//alert("blah 2");
			$(this).removeClass('hover');
		});			
		
		$('#startBtn').on('touchstart',function(){
			//alert("blah");
			$(this).addClass('hover');
		});
		
		$('#startBtn').on('touchend',function(){
			//alert("blah 2");
			$(this).removeClass('hover');
		});	
		$('#savedataBtn').on('touchstart',function(){
			//alert("blah");
			$(this).addClass('hover');
		});
		
		$('#savedataBtn').on('touchend',function(){
			//alert("blah 2");
			$(this).removeClass('hover');
		});	
		
		$('#closeBluetooth').on('click',function(){
			$('#bluetoothPopup').popup();
			$('#bluetoothPopup').popup('close');
		});	
		$('#closelogin').on('click',function(){
			$('LoginPopup').popup();
			$('#LoginPopup').popup('close');
		});	
		$('#closeError').on('touchend',function(){
			$('#errorPopup').popup('close');
		});
		if (typeof bluetoothle !== "undefined"){
		//	alert('bluetoothle is defined');
			bluetoothle.initialize(initSuccess, /* initFail ,*/{"request":true,"statusReceiver":true});
		
		}else{
			alert('bluetoothle undefined');
		}
		
	//	bluetoothle.initialize(initSuccess, initFail,{"request":true,"statusReceiver":true});	
		
		//alert('bluetooth initia');
    }, // onDeviceReady end tag
};
// functions

function initSuccess(data) {
	if (data.status === "enabled"){
		bluetoothEnabled = true;
	}
	
	bluetoothle.hasPermission(hasPermissionSuccess);
	if (noaccountyet === true ){
		addaccount("Yi", "Liang", "Reed","12");
		addaccount("douya", "L", "Jorie","12");
		addaccount("Kaixin", "Liang", "Kadee","12");
		addaccount("Hongli", "Yang", "Alice","12");
		alert("created 4 accounts");
		noaccountyet = false;
	}	
	
				
	//alert("init success");
	if (localStorage.address){
		//alert(localStorage.address);
		address = localStorage.address;
	//	deviceSetup = true;  //device exists;
		$('#forgetDevice').removeClass('noDisplay');
	}else{
		$('#forgetDevice').addClass('noDisplay');
	}
	
	$(document).off("click","#connectBtn,#yesConnect");
	$('.ui-popup').popup();
	$('.ui-popup').popup('close');
	
	// Handle click of CONNECT BUTTON: scans for device, connects, discovers services+characteristics, subscribes, the writes confirm command
	$(document).on("click","#connectBtn,#yesConnect",function(){
		if (address){//disconnect if connected; 	
			//	console.log('has connected before:'+address);	
				bluetoothle.isConnected(isConnectedSuccess, isConnectedFail, {"address":address}); 
				console.log('has connected before:'+address);
				 // can only be called successfully IF ADDRESS IS KNOWN!!!
				connectTimeout = setTimeout(function(){
					checkConnection();
				}, 3000);
				setTimeout(function(){
					$('.ui-popup').popup();
					$('.ui-popup').popup('close');
				},100);	
			
		}else{ // scan for connection if no device connected (saved) before 
				setTimeout(function(){
					$('.ui-popup').popup('close');
				},100);			
				setTimeout(function(){
					$('#connectingPopup').popup('open');
				},100);	
				bluetoothle.startScan(scanSuccess, scanFail,{});
		}	
	});	
} // initSuccess - End Bracket

function getAccel(){
	currentWrite = "Get Accel";
	// Write getAccel command
	var hexArray = ["AA","AA","03","58","20","00",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("writing get accel command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "service":serviceUuid, "characteristic":charUuid,"type":"noResponse"});
	// Set flag in subscribeSuccess (data.status === "subscribedResult")
}

function sendConfirmationCommand(){
	currentWrite = "confirm connection";
	// Write BLE confirm command
	var hexArray = ["AA","AA","03","9A","10","01",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	//alert('before writing confirm');
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "service":serviceUuid, "characteristic":charUuid,"type":"noResponse"});
}

function sendGetHeaderCommand(){
	//alert('before requesting data header');
	currentWrite = "Get header";
	// Write getAccel command
	var hexArray = ["AA","AA","03","93","20","00",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("writing get accel command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "service":serviceUuid, "characteristic":charUuid,"type":"noResponse"});
	// Set flag in subscribeSuccess (data.status === "subscribedResult")
}
		
function sendEraseDataCommand(){
	currentWrite = "erase data";
	// Write getAccel command
	var hexArray = ["AA","AA","03","96","20","00",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	// alert("writing get accel command");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "service":serviceUuid, "characteristic":charUuid,"type":"noResponse"});
	// Set flag in subscribeSuccess (data.status === "subscribedResult")
}
function sendClearDataCommand(){  // BLE_DATA_ERASE  0x96; 
	currentWrite = "clear data in memory";  // not in EEPROM; 
 	// Write  command
	var hexArray = ["AA","AA","03","96","10","00",""];  // set 0x10;
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	console.log("Clear Data Command ");
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "service":serviceUuid, "characteristic":charUuid,"type":"noResponse"});
}

function sendGetConfirmation(){
	currentWrite = "get confirmation";
	// Write BLE confirm command
	var hexArray = ["AA","AA","03","9A","20","00",""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	//alert('before writing confirm');
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "service":serviceUuid, "characteristic":charUuid,"type":"noResponse"});
}
// Success Callbacks
        
function scanSuccess(data){
	//alert('scan success');
	if (data.status == "scanResult"){
		if (foundDevices.indexOf(data.address) < 0 && data.name === desiredName/* "SSV1_00000" */){
			
			foundDevices.push(data.address);	
			foundRssi.push(data.rssi);			
			console.log(JSON.stringify(foundDevices));
			address = data.address;
		}else{
			console.log('No devices found');
		}
	}else if(data.status === "scanStarted"){
		//alert('scan started');
		setTimeout(function(){
			scanOver();
			//bluetoothle.stopScan(stopSuccess,stopFail)
		},3000);
	}
	
}

function scanOver(){
	//alert("here");
	 //alert("Before connecting - Addresses: "+JSON.stringify(foundDevices) + "RSSI: "+JSON.stringify(foundRssi));
	var blah = sortArrays(foundDevices, foundRssi);
	foundDevices = blah[0];
	foundRssi = blah[1];
	// alert("After - Addresses: "+JSON.stringify(foundDevices) + "RSSI: "+JSON.stringify(foundRssi));
	bluetoothle.stopScan(stopSuccess,stopFail);
}

function stopSuccess(data){
//	alert('hit stop success');
	//console.log("Stop Success "+foundDevices[deviceToTry]);
	connectRecursive(deviceToTry);	
}
    
var connectRecursive = function(n){
	//alert("in recursive function: "+n+" "+foundDevices.length);
	if (n < foundDevices.length){
		address = foundDevices[n];
		console.log("connectRecursive: "+address);
		bluetoothle.connect(connectSuccess,connectFail,{"address":address});
	}else{
		console.log('No Devices to try');
		//notEnoughData = true;
		setTimeout(function(){
			//$.mobile.loading('hide');
			alert('recursive no device to try ');
			$('.ui-popup').popup();
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
				$('#noDevicesPopup').popup();
				$('#noDevicesPopup').popup('open');
			},200);
		},400);
	}
}
	
function connectSuccess(data){
	addressTried = data.address;
	console.log('connect success:'+charUuid+" "+serviceUuid);
	if (data.status === "connected"){
			connected = true;
			console.log('connectsuccess: connected');
			platform = device.platform;
			clearTimeout(connectTimeout);
			if (platform == "iOS"){
				//alert('start getting services');
				bluetoothle.services(servSuccess,servFail,{ "address": address,"services": [] });
			}else if (platform == "Android"){
			console.log(' connectSuccess before calling isDiscovered');
				bluetoothle.isDiscovered(isDiscoveredSuccess, isDiscoveredError,  {"address":address});
				//bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
			}else{
			// Unsupported Platform
			}		
		//	("#connectBtn").html(labelDisconnect);			
		
	}else if(data.status === "disconnected"){
		console.log('connectsuccess: disconnected');
	//	$('#settingsMessage').html(labelConnectMessage);
	//	$('#connectCircle').css('background','radial-gradient(#333,black)');
		connected = false;
		accidentalDisconnect = true;
		clearInterval(accelInterval);
		clearInterval(connectTimeout);
		setTimeout(function(){
			$("#reconnectPopup").popup();
			$("#reconnectPopup").popup("open");
		},600);
	}
}

function isDiscoveredSuccess(data){
			connected = true;
			console.log("isDiscovered: "+JSON.stringify(data));
			if (data === null){
				console.log("isDiscovered success:  null  ");
				sendConfirmationCommand();
				setTimeout(function(){				
					bluetoothle.subscribe(subSuccess, subFail, {"address":address,"service":serviceUuid,"characteristic":charUuid, "isNotification":true });
				},300);
			}else if (data.isDiscovered === false){
				console.log('isDiscovered:  false ');
				bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
			}else{
				console.log('isDiscovered:  true; ');
				sendConfirmationCommand();
				setTimeout(function(){				
					bluetoothle.subscribe(subSuccess, subFail, {"address":address,"service":serviceUuid,"characteristic":charUuid, "isNotification":true });
				},300);

			}
}

function servSuccess(data){
	//$('#syncreturn').append("<p>Service Success: "+JSON.stringify(data)+"</p>");
	//alert("service success");
	bluetoothle.characteristics(charSuccess,charFail,{"address":address,"service":serviceUuid,"characteristicUuids":[]});
}

        
function charSuccess(data){
	//$('#syncreturn').append("<p>Characteristic Success: "+data.status+"</p>");
	//alert("char success 1");
	sendConfirmationCommand();
	//alert("char success 2");
/*	if (deviceSetup){
		setTimeout(function(){				
			bluetoothle.subscribe(subSuccess, subFail, {"address":address,"service":serviceUuid,"characteristic":charUuid, "isNotification":true });
		},300);
	}else{*/
		//alert('before opening confirm popup');
		$('.ui-popup').popup();
		$('.ui-popup').popup('close');
		setTimeout(function(){
			$('#confirmHatPopup').popup();
			$('#confirmHatPopup').popup('open');
		},100);
	//}
	
}
 
function discoverSuccess(data){
	//alert(JSON.stringify(data));
	//$('#syncreturn').append(JSON.stringify(data));
	//alert("services: "+serviceUuid+" chars: "+charUuid);
	//bluetoothle.subscribe(subSuccess, subFail, {"address":address,"service":serviceUuid,"characteristic":charUuid, "isNotification":true });
	sendConfirmationCommand();
	console.log("discover success, send confirmation command");
	
/*	if (deviceSetup){
		setTimeout(function(){				
			bluetoothle.subscribe(subSuccess, subFail, {"address":address,"service":serviceUuid,"characteristic":charUuid, "isNotification":true });
			console.log("deviceSetup: discover success, to subscribe");
		},300);
	}else{*/

	
		$('.ui-popup').popup();
		$('.ui-popup').popup('close');
		console.log('ui-popup close in discover sucess');
		setTimeout(function(){	
			$('#confirmHatPopup').popup();
			$('#confirmHatPopup').popup('open');
			console.log('open confirm popup');
		},50);	 			
//	}	
} 
 
        
function closeSuccess(data){
	console.log("in close success "+JSON.stringify(data));
	
	//	$('#connectCircle').css('background','radial-gradient(#333,black)');
	//("#connectBtn").html(labelConnect);

	connected = false;

	setTimeout(function(){
		//alert('We get here right?');
		//$.mobile.loading('hide');
		//$('.ui-popup').popup('close');
		if (forgettingDevice){
		//	$('.ui-popup').popup('close');
			console.log('forgetting device:1 '+localStorage.address);
			address = null;
			localStorage.removeItem('address');
			foundDevices = [];
			foundRssi = [];
			forgettingDevice = false;
			console.log('forgetting device:2 '+localStorage.address);
			$('#forgetDevice').addClass('noDisplay');

		//	deviceSetup=false;
			dataStored = "false";
			localStorage.dataStored = "false";
			toggleNSbtn(dataStored);
			console.log('forgetting device:3 '+localStorage.dataStored);
			getaccflag = false;
			clearTimeout(accelInterval);
			clearTimeout(connectTimeout);	
			clearTimeout(getaccTimeout);				
			
		}/*else if(disconnecting){
			disconnecting = false;
			//alert('popup 14');
			$('.ui-popup').popup('close');
		}else if(reconnect){
			//alert('before reconnect');
			bluetoothle.connect(connectSuccess, connectFail, {"address": address});
		}*/
		else{
			//('#connectBtn').html(labelConnect);
			getaccflag = false;
			clearTimeout(accelInterval);
			clearTimeout(connectTimeout);	
			clearTimeout(getaccTimeout);			
		}
		
		/*$('#connectingPopup').html(labelConnecting);
		
		if (deviceSetup){
			foundDevices = [];
			foundRssi = [];

		}else{ // close unwanted bluetooth devices if there are mutiple device to connect and move to next one; 
			//$('#syncreturn').append("<p>Close Success"+deviceToTry+"</p>");
				console.log('increment deviceToTry');
				yesConfirmHat = "blah";
				deviceToTry++;				
				connectRecursive(deviceToTry);
	//	}*/
		
	},300);		
}

		
function writeSuccess(data){
	//$('#syncreturn').append("<p>Write Success- "+JSON.stringify(data)+"</p>");
}
        
function readDescSuccess(){
	console.log("Read Descriptor Success");
}


                
function subSuccess(data){
	//alert("subscribe success");
	
	if (data.status == "subscribed"){
		//sendConfirmationCommand();
		
	//	sendGetConfirmation();
		

		clearTimeout(connectTimeout);
	//	alert('after clearing connection timeout');
		connected = true;
		reconnect = false;
		afterForcedDisconnect = false;
		accidentalDisconnect = false;
		neverConnected = false;
		//$.mobile.loading('show', {text:labelConnected,textVisible: true, theme:'b'});
		setTimeout(function(){
			$('.ui-popup').popup('close');
		},100);
		console.log("subscribed");

	// ----------------- SUBSCRIBED RESULT ------------------------//
	}else if(data.status == "subscribedResult"){
		clearTimeout(getaccTimeout);
		var returnedBytes = bluetoothle.encodedStringToBytes(data.value);
		//alert("received: "+JSON.stringify(returnedBytes));
		
		console.log("subscribed results");
		// -- Received version number --//
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 /* && returnedBytes[2] == 3 */ && returnedBytes[3] == 153 && returnedBytes[4] == 48){
			// returnedBytes[5] is A, returnedBytes[6] is B if version number is A.B
			//alert(JSON.stringify(returnedBytes));
		}
		
		// -- Received accel data -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 88 && returnedBytes[4] == 48){
			
			//alert("received signal strength of: "+returnedBytes[4]);
			var xArray = [returnedBytes[5], returnedBytes[6]]; // count of jumps; 
			var yArray = [returnedBytes[7], returnedBytes[8]]; // jump period, by counts, this one should mutiply samp_time;
			var zArray = [returnedBytes[9], returnedBytes[10]]; // This is the peak of x-axis data of each jump;
			var dataX = pack(xArray); // jump count
			var dataY = pack(yArray);  // each period by timer; 25counts is 1s: 25*0.04 = 1; 
			var dataZ = pack(zArray);
			//$('#placeholder').html(dataX+" "+dataY+" "+dataZ);
			if(dataX !== jumpcounts && dataX !==0){//data is new; 
				if(dataX ===1){
					var d = new Date();
					startjumpTime = d.getTime();
					console.log('Start Jump Time: '+startjumpTime);
				}
				jumpcounts =  dataX;
				jumptotaltime = jumptotaltime + dataY * samp_time;
				thistimeheight = dataZ/1000; 
				totalheightest = totalheightest + thistimeheight;  //test data; 
				jumpcalerie = jumpcalerie + dataY*samp_time*dataZ/1000;
				jumpcategory= 1;
				jumpcomments = 'full';			
			}
			$('#bouncetime').html(jumptotaltime.toFixed(1));
			$('#bouncecount').html(jumpcounts);
			$('#energy').html(jumpcalerie.toFixed(1));
			$('#height').html(thistimeheight.toFixed(1));
			$('#heightsum').html(totalheightest.toFixed(1));							
		}
	
		// -- Received response for isRecording -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 149 && returnedBytes[4] == 48){
			//alert("Is Recording: "+ JSON.stringify(returnedBytes));					
		}
		
		// -- Received erase command echo -- //
		if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 150 && returnedBytes[4] == 48){
			//alert("Erasing Echo: "+ JSON.stringify(returnedBytes));	

			//---- Now that data is erased, we can disconnect. Data is still stored in globalData variable though! ----//

		}
		
		if (returnedBytes[3] === 0x9A){
			console.log('received confirmation' + returnedBytes[4] + " " + returnedBytes[5] + " " + returnedBytes[6]);
		}		
	}
	//
}
        
function readSuccess(data){

}


function isConnectedSuccess(data){
	console.log("isConnectedSuccess: "+JSON.stringify(data));
	var blah;	
	if (platform === "iOS"){
		// alert(" data.isConnected : "+data.isConnected);
		
		if (data.isConnected === true){ // connected to previously-connected device; hits if you have have connected before or are connected now. on iOS returns false when connected/true when not... on Android works as expected  
			
			
			if (forgettingDevice){
				console.log("isConnectedSuccess:forgetdevice "+JSON.stringify(data));
				$('#disconnectingPopup').popup();
				$('#disconnectingPopup').popup('open');
				if(getaccflag ===true){
					getaccflag = false;				
					clearTimeout(connectTimeout);
					clearInterval(accelInterval);
					$("#startBtn").html(labelStart);  // only for test; 
					setTimeout(function(){
						$('.ui-popup').popup('close');
					},100);					
				}	
				$('#forgetDevice').addClass('noDisplay');				
				bluetoothle.disconnect(disconnectSuccess,disconnectFail, {"address":address});	
				$("#connectBtn").html(labelConnect); 
			}else{
				if(getaccflag ===true){
					getaccflag = false;				
					clearTimeout(connectTimeout);
					clearInterval(accelInterval);
					$("#startBtn").html(labelStart);  // only for test; 
					setTimeout(function(){
						$('.ui-popup').popup('close');
					},100);					
				}
				console.log("isConnectedSuccess: normal disconnect "+JSON.stringify(data));
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});	
				$("#connectBtn").html(labelConnect); 
			}
		}else if (data.isConnected === false){ // not connected to a previously-connected device

			if (forgettingDevice){
				//alert('forget device 3');
				$('#forgetDevice').addClass('noDisplay');
				console.log('address = null in isConnected - not connected to a previous connected device');
				address = null;
				localStorage.removItem('address');
				foundDevices = [];
				foundRssi = [];				
				forgettingDevice = false;
			//	deviceSetup = false;
				dataStored = "false";
				localStorage.dataStored = "false";
				toggleNSbtn(dataStored);
				$('#forgetDevice').addClass('noDisplay');	
				$("#connectBtn").html(labelConnect);
			}else{
				console.log('else in isConnected under iOS not connected');
				$('#connectingPopup').popup();
				$('#connectingPopup').popup('open');
				// alert("prompt to connect = false");
				bluetoothle.connect(connectSuccess, connectFail, {"address": address});
					
			}
		}
	}else if (platform === "Android"){
		if (data.isConnected === true){ // connected to previously-connected device; hits if you have have connected before or are connected now. on iOS returns false when connected/true when not... on Android works as expected  
		
			if (forgettingDevice){
				console.log("isConnectedSuccess:forgetdevice "+JSON.stringify(data));
				$('#disonnectingPopup').popup('open');
				if(getaccflag ===true){
					getaccflag = false;				
					clearTimeout(connectTimeout);
					clearInterval(accelInterval);
					$("#startBtn").html(labelStart);  // only for test; 
					setTimeout(function(){
						$('.ui-popup').popup('close');
					},100);					
				}				
				bluetoothle.close(closeSuccess,closeFail, {"address": address});
				$('#forgetDevice').addClass('noDisplay');				
				$("#connectBtn").html(labelConnect); 
			}else{
				console.log("isConnectedSuccess: normal disconnect "+JSON.stringify(data));
				$('#disonnectingPopup').popup('open');
				if(getaccflag ===true){
					getaccflag = false;				
					clearTimeout(connectTimeout);
					clearInterval(accelInterval);
					$("#startBtn").html(labelStart);  // only for test; 
					setTimeout(function(){
						$('.ui-popup').popup('close');
					},100);					
				}
				bluetoothle.close(closeSuccess,closeFail, {"address": address});	
				
				$("#connectBtn").html(labelConnect); 
			}			
			
		}else if (data.isConnected === false){ // not connected to a previously-connected device
			
			if (forgettingDevice){
				console.log('isConnected : false forget device 7?');
				$('#forgetDevice').addClass('noDisplay');
				//alert('address = null in isConnected - not connected to a previous connected device');
				address = null;
				localStorage.removeItem('address');
				foundDevices = [];
				foundRssi = [];				
				forgettingDevice = false;
				connected = false;
			//	deviceSetup = false;
				dataStored = "false";
				localStorage.dataStored = "false";
				toggleNSbtn(dataStored);
				$("#connectBtn").html(labelConnect); 
			}
			else{
				console.log("here means lost connect from MCU, should reconnect")
				$('#connectingPopup').popup();
				$('#connectingPopup').popup('open');
				bluetoothle.connect(connectSuccess, connectFail, {"address": address});					
			}
				
		}
	}else{
		console.log('isConnectedSuccess:we get here dont we?');
	}
}
        
function disconnectSuccess(data){
	//$('#syncreturn').append("<p>Disconnect Success</p>");
	console.log("in disconnect success");
	if (data.status == "disconnected"){
		console.log("disconnect success");
		bluetoothle.close(closeSuccess, closeFail,{ "address": address});		
	}
}		
/////////////////////////////////////////////////////////////
//Failure Callbacks
/////////////////////////////////////////////////////////////   

function isConnectedFail(e){
	if (e.error === "neverConnected"){ // hits if you haven't been connected to the device since opening the app
		if (forgettingDevice){
			console.log("never connected forgetDevice:"+JSON.stringify(e));
			address = null;
			localStorage.removeItem('address');
			forgettingDevice = false;
		//	deviceSetup = false;
			connected = false;
			dataStored = "false";
			localStorage.dataStored = "false";
			toggleNSbtn(dataStored);
			$('#forgetDevice').addClass('noDisplay');
			$("#connectBtn").html(labelConnect);
		}else{
			console.log("isConnected Fail else:"+JSON.stringify(e));
			connected = false; 
			bluetoothle.connect(connectSuccess, connectFail, {"address": address});
			// alert("prompt to connect = false");
		//	setTimeout(function(){
		//		('#reconnectPopup').popup('open');
		//	},600);			 
		}
		
	}
}

    
function initFail(e){
	//alert('init fail');
	bluetoothEnabled = false;
	//alert('Init fail. Is bluetooth enabled?');
	//$('#sleepBtn, #connectBtn2,#volumeBtn, .tutorialReturn, #alarmBtn, #alarmOnOff').off('click');
	//--- Fallback click handlers for bluetooth disabled ---//
	//$("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
	//$('#connectCircle').css('background','radial-gradient(#333,black)');
	//$('#volumeControl').slider('disable').slider('refresh');
	//$('#volumeBalance').slider('disable').slider('refresh');
	
	$(document).off("click","#connectBtn, #yesConnect").on("click","#connectBtn, #yesConnect",function(){
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
	console.log('in connectFail?' + e.error);
	if (e.error === 'isNotDisconnected'){
		//alert('Connect failed: '+JSON.stringify(e));
	}else if(e.error === "connect"){
		//alert('disconnected in connect fail');
	
			connected = false;
			accidentalDisconnect = true;
			needCurrentVolume = true;
			//alert("Uh oh. We were disconnected!");
			//$.mobile.loading('hide');
			$('.ui-popup').popup('close');
			setTimeout(function(){
				$("#reconnectPopup").popup();
				$("#reconnectPopup").popup("open");
			},600);
	}else{

		errorCode = '0003';
		$('#errorCode').html(errorCode);
		$('#errorPopup').popup('open');
	}
}        
        
        
function servFail(e){

	errorCode = '0004';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}



function charFail(e){

	errorCode = '0005';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}



function disconnectFail(e){
	errorCode = '0006';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}



function writeFail(e){
	console.log("Write Fail " +JSON.stringify(e)+" "+currentWrite+" "+sigStrengthInterval);
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
//	alert("Subscribe Fail:"+JSON.stringify(e));
	
	if (e.error !== "isDisconnected"){
		errorCode = '0011';
		$('#errorCode').html(errorCode);
		$('#errorPopup').popup('open');
	}
}

function closeFail(e){
	if (e.error !== "isNotDisconnected"){
		console.log("Close Fail: " + JSON.stringify(e));
		errorCode = '0012';
	//	$('#errorCode').html(errorCode);
	//	$('#errorPopup').popup('open');
	}
}

function isDiscoveredError(e){
	//alert('isDiscovered fail: '+ JSON.stringify(e));
	errorCode = '0013';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
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

function unpack(intSize) {
	var numBytes = Math.ceil((Math.log(intSize)/Math.log(2) + 1)/8);
	var bytes = [];
	for (i = numBytes-1; i >= 0; i--){
		bytes[i] = intSize & (255);
		intSize >> 8;
	}	
	return bytes();
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
	var writeArray2 = new Array();
	for ( i = 0; i < hexArray.length; i++){
		writeArray2[i] = parseInt(hexArray[i],16);
	}
	writeArray2[writeArray2.length-1] = getChecksum(writeArray2.slice(3,3+writeArray2[2]));
	// alert("Decimal byte array: "+JSON.stringify(writeArray2));
	//alert(writeArray2);
	writeArray2 = new Uint8Array(writeArray2);
	return writeArray2;
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
		
function volumeUnmap(slider){
			var chip = Math.floor(-9*slider/10 + 140);
			return chip;
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
	if (hour == 0){
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
	if (hour == 0){
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


function changeState(newState){
	var hexArray = ["AA","AA","03","24","10",newState.toString(),""];
	var writeArray = hexToUint8(hexArray);
	var writeString = bluetoothle.bytesToEncodedString(writeArray);
	bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "service":serviceUuid, "characteristic":charUuid,"type":"noResponse"});
}



function checkConnection(){
	if (!connected){
		console.log('in check connection()');
		//$.mobile.loading('hide');
		//alert('popup 10');
		$('.ui-popup').popup('close');
		
		//$("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
		//$('#settingsMessage').html(labelConnectMessage);
		//$('#connectCircle').css('background','radial-gradient(#333,black)');

		forgettingDevice = false;
		disconnecting = false;
		$("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
		$('#settingsMessage').html(labelConnectMessage);
		$('#connectCircle').css('background','radial-gradient(#333,black)');
		bluetoothle.close(closeSuccess,closeFail, {"address": address});
	//	setTimeout(function(){
	//		$('#timeoutPopup').popup('open');
	//	},100);
	}else{
		connected = true;
	}
}

function accConnectionLost(){
		connected = false;
		console.log('MCU lost bluetooth, reconnect');
		$('.ui-popup').popup('close');
		forgettingDevice = false;
		disconnecting = false;
		$("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
		bluetoothle.close(closeSuccess,closeFail, {"address": address});
}


function toggleNSbtn(data){
	// alert("dataStored: "+data+" "+typeof(data));
	if (data === "true"){
		// alert("data = true");
		$('#sleepIcon').removeClass('fa-plus').addClass('fa-arrow-up');
	//	$('#sleepName').html(labelEndSleep);
		$('#sleepBtn').addClass('alternative');
	}else{
		// alert("data = false");
		$('#sleepIcon').removeClass('fa-arrow-up').addClass('fa-plus');
	//	$('#sleepName').html(labelStartSleep);
		$('#sleepBtn').removeClass('alternative');
	}
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
	//	navigator.splashscreen.show();
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

function map(value, fromLow , fromHigh, toLow, toHigh){
	return (toHigh-toLow)*(value-fromLow)/(fromHigh-fromLow)+toLow;
}
    
function getMaxOfArray(numArray) {
	return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
	return Math.min.apply(null, numArray);
}

function loadLabels(){

	labelHours = $.t('plot.hours'), 
	labelMins = $.t('plot.minutes'), 
	labelMin = $.t('plot.minute'), 
	labelConnect = $.t('settings.btn.connect'),
	labelDisconnect = $.t('settings.btn.disconnect'),
	labelStart = $.t('settings.btn.start'),
	labelStop = $.t('settings.btn.stop'),
	labelConnecting = $.t('settings.btn.connecting'),
	labelConnected = $.t('settings.btn.connected'),
	labelDisconnecting = $.t('loading.disconnecting'),
	labelStarting = $.t('loading.starting'),
	labelRetrieving = $.t('loading.retrieving'),
	labelStartSleep = $.t('footer.start'),
	labelTime = $.t('formatting.time'),
	labelTimeAlt = $.t('formatting.timeAlt'),
	labelWeekly = $.t('formatting.weekly'),
	labelDaily = $.t('formatting.daily'),
	labelYear = $.t('formatting.year'),
	labelDisconnectMessage = $.t('settings.message.disconnect'),
	labelConnectMessage = $.t('settings.message.connect'),
	labelEnglish = $.t('help.language.en'),
	labelChinese = $.t('help.language.zh'),
	labelCurrentLanguage = $.t('help.language.this')
	labelMonth = [$.t('formatting.monthly.month1'),$.t('formatting.monthly.month2'),$.t('formatting.monthly.month3'),$.t('formatting.monthly.month4'),$.t('formatting.monthly.month5'),$.t('formatting.monthly.month6'),$.t('formatting.monthly.month7'),$.t('formatting.monthly.month8'),$.t('formatting.monthly.month9'),$.t('formatting.monthly.month10'),$.t('formatting.monthly.month11'),$.t('formatting.monthly.month12')];
	/* -- New tutorial labels -- */

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
        } else if (point[i] == 0) {
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
	//alert('in findPeaks'+data+" "+minDistance);
    var pointDiff = diff(data);
    //console.log("Point difference :" + pointDiff);
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
	
	//alert('after ddiff');
	
    //console.log("ddiff : " + ddiff);
    var peakIdx = findEquals(ddiff, -2);
    for (i = 0; i<peakIdx.length; i++){
        peakIdx[i] = peakIdx[i] + 1;
    }
    //console.log("peak index : " + peakIdx);
    var peakMag = []
    for (var i = 0; i < peakIdx.length; i++) {
        peakMag.push(data[peakIdx[i]])
    }
	
    
    //--------Remove peaks too close to beginning of data --------------//
    var peakMinIdx = 180; // ~ 45 minutes
    while (peakIdx[0] < peakMinIdx) {
        peakIdx.shift();
        peakMag.shift();
    }
        //--------Remove peaks too close to end of data --------------//
    var peakMaxIdx = data.length - 100; // ~ 45 minutes
    while (peakIdx[peakIdx.length-1] > peakMaxIdx) {
        peakIdx.pop();
        peakMag.pop();
    }
    // ------------------Sort Peaks (Highest to Lowest)---------------//
    //console.log("Peak Idx : " + peakIdx);
    var sortedData = sortArrays(peakIdx,peakMag);
    var sortedIdx = sortedData[0];
    var sortedMag = sortedData[1];
    //console.log("Sorted Indices : " + sortedIdx);
    //console.log("Sorted Peaks : " + sortedMag);
    //console.log("Data Length : " + data.length);
    //--------Remove peaks too close together--------------------------//
    var peakToKeep = peakIdx[0];
    var peakIdxFinal = [peakIdx[0]];
    var peaksFinal = [peakMag[0]];
    
   // alert('after peaksFinal');
	
    //var count = findWithinRange(peakIdxFinal,sortedIdx[1],minDistance);
   // console.log("Count : " + count);
   // console.log("Range : " + minDistance);
    for (var i = 1; i < sortedIdx.length; i++) {
        //console.log("Index in Filter : " + i);
        //console.log("Sorted Index : " + sortedIdx[i]);
        var count = findWithinRange(peakIdxFinal,sortedIdx[i],minDistance);
        //console.log("Count In Filter : " + count);
        if (count == 0){
            peakIdxFinal.push(sortedIdx[i]);
            peaksFinal.push(sortedMag[i]);
        } 
        else{
        }
    }
    //console.log("Final Peaks : " + peaksFinal);
    //console.log("Final Indx : " + peakIdxFinal);
    var sortedFinalData = sortArrays(peaksFinal,peakIdxFinal);
    var sortedFinalIdx = sortedFinalData[1];
    var sortedFinalMag = sortedFinalData[0];
    sortedFinalMag.reverse();
    sortedFinalIdx.reverse();
    var peakStuff = [sortedFinalIdx, sortedFinalMag];
    //console.log("Peaks Final : " + peaksFinal);
	//alert('at end of findPeaks()');
    return peakStuff;
}



function sortArrays(indices, sortedValue) {
  var list = [];
  for (var j = 0; j < indices.length; j+=1) {
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
  for (var k = 0; k < list.length; k+=1) {
    indices2.push(list[k].indices);
    sortedValue2.push(list[k].sortedValue);
  }
  //alert("Addresses: "+JSON.stringify(addresses) + "RSSI: "+JSON.stringify(rssis));
  //console.log("Indices :" + indices);

  return [indices2, sortedValue2];
}


function loadHomePage(){
		// Resize based on device size (maybe put into a single function?)
//		var windowHeight = $(window).height();
//		var windowWidth = $(window).width();
		//alert(windowWidth+" "+windowHeight);
		//alert( "before" +$('.ui-header').height());
		//$('.ui-header').height(windowHeight*.3);
		//$('.ui-header .ui-btn').css('font-size', windowHeight*.03+"px" );
		//alert( $('.ui-header').height());
//		var headerHeight = $('.ui-header').height();
//		var footerHeight = $('#home .ui-footer').height();
		//alert(windowHeight+" "+headerHeight+" "+footerHeight);
		
		setTimeout(function(){
			navigator.splashscreen.hide();
			splashHidden = true;
			if(!bluetoothEnabled){
				$('#bluetoothPopup').popup('open');
			}
			
		},300);
}

// SQLite database operation functions; 
function addaccount(first, last, accid, pw ){ //,address1,address2,city,state,zipcode,country,age,weight,gender,email,createpassword) {
	//insert data; 
    accountsDB.transaction(function (tx) {
        var query = "INSERT INTO playeraccounts (firstname, lastname, userID,createpassword) VALUES (?,?,?,?)";
	//	alert("to add user");
        tx.executeSql(query, [first, last, accid,pw], function(tx, res) {
	//		alert("add user success");
        },
        function(tx, error) {
            alert('INSERT error: ' + error.message);
        });
    }, function(error) {
        alert('transaction error: ' + error.message);
    }, function() {
      //  alert('transaction ok');
    });
}

function findaccount(accid){ //,address1,address2,city,state,zipcode,country,age,weight,gender,email,createpassword) {

    accountsDB.transaction(function (tx) {
        var query = "SELECT firstname, lastname, userID,createpassword FROM playeraccounts WHERE firstname = ? AND lastname=?";
	//	var query = "SELECT firstname, lastname, userID,createpassword FROM playeraccounts WHERE userID <> ?"; //not equals to;
	//	alert("to add user");
        tx.executeSql(query, [accid], function(tx, res) {
	//		alert("add user success");
        },
        function(tx, error) {
            alert('INSERT error: ' + error.message);
        });
    }, function(error) {
        alert('transaction error: ' + error.message);
    }, function() {
      //  alert('transaction ok');
    });
}

function readData( ){ //real all data in database; 
	accountsDB.transaction(function(tx) { //find players; 
		tx.executeSql('SELECT * FROM playlist', [], function (tx, results) {
			var len = results.rows.length, i;
			$("#rowCount").append(len);
			for (i = 0; i < len; i++){
			alert("<tr><td>"+results.rows.item(i).firstname+"</td><td>"+results.rows.item(i).lastname+"</td><td>"+results.rows.item(i).userID+"</td></tr>");
			}
		}, null);
	});
}

function removeaccount(accuserID) {

    accountsDB.transaction(function (tx) {

        var query = "DELETE FROM playeraccounts WHERE userID = ?";

        tx.executeSql(query, [accuserID], 
		function (tx, res) {
            console.log("removeId: " + res.insertId);
            console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
            console.log('DELETE error: ' + error.message);
        });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function updateaccount(first, id) {
    // UPDATE Cars SET Name='Skoda Octavia' WHERE Id=3;
    accountsDB.transaction(function (tx) {
        var query = "UPDATE playeraccounts SET firstname = ? WHERE userID = ?";

        tx.executeSql(query, [first, id], 
		function(tx, res) {
            console.log("insertId: " + res.insertId);
            console.log("rowsAffected: " + res.rowsAffected);
        },
        function(tx, error) {
            console.log('UPDATE error: ' + error.message);
        });
    }, function(error) {
        console.log('transaction error: ' + error.message);
    }, function() {
        console.log('transaction ok');
    });
}

function closeDB() {
    accountsDB.close(function () {
        console.log("DB closed!");
    }, function (error) {
        console.log("Error closing DB:" + error.message);
    });
}

function hasPermissionSuccess(data){
	//alert(JSON.stringify(data));
	if(data.hasPermission){
		bluetoothle.isLocationEnabled(isLocationEnabledSuccess, isLocationEnabledError);
	}else{
		bluetoothle.requestPermission(requestPermissionSuccess, requestPermissionError);
	}
}

function isLocationEnabledSuccess(data){
	//alert(JSON.stringify(data));
}

function requestPermissionSuccess(data){
	//alert(JSON.stringify(data));
	if (data.requestPermission){
		bluetoothle.isLocationEnabled(isLocationEnabledSuccess, isLocationEnabledError);
	}
}

function isLocationEnabledError(data){
	errorCode = '0014';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}

function requestPermissionError(data){
	errorCode = '0015';
	$('#errorCode').html(errorCode);
	$('#errorPopup').popup('open');
}		
		
function setTextZoomCallback(textZoom) {
	//alert('WebView text should be scaled ' + textZoom + '%')
	//loadHomePage();
}

function getTextZoomCallback(textZoom) {
	//alert('Current text zoom = ' + textZoom + '%');
	if (textZoom !== 100){
		MobileAccessibility.setTextZoom(100, setTextZoomCallback);
	}else{
		//loadHomePage();
	}
	
}
		
function geolocationSuccess(position) {
	var timestampDate = new Date(position.timestamp);
	var currentDate = new Date();
	alert("timestamp: " + position.timestamp + " " + currentDate.getTime() + " String date: " + timestampDate.toString() + " " + currentDate.toString() + " " + JSON.stringify(position));
	//loadHomePage();
}
		
function geolocationError(error) {
	alert(JSON.stringify(error));
	//loadHomePage();
}
