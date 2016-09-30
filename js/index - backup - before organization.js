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
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		//alert('Device Ready');
		if (typeof jQuery == 'undefined') {  
			alert('jQuery has not been loaded!');  
		}	
		
        var writeString;
        var address;
        var serviceUuid;
        var charUuid;
        var returnString;
        var completeData;
        var scoreData = [];
        var bwData = [];
        var toneData = [];
        var state;
		var btnPressed;
		var dataBuffer = new Array();
		var syncData;
		var foundDevices = [];
		var deviceToTry = 0;
		var correctConnection = false;
		var startScanTime;
		var addressTried;
		var syncStartTime;
		var syncEndTime;
		var platform;
		var deviceSetup = false;
		var packetCounter;
		var expectedCount;
		var accelX = [];
		var accelY = [];
		var accelZ = [];
		var desiredName = "SSV1_00000";
		var needCurrentVolume = true;
		//desiredName = "Jesse";
		serviceUuid = "ffe0";
		//serviceUuid = "abcd";
        charUuid = "ffe1";
		
		
		$( document ).on( "pagecreate", "#settings", function( event ) {
			var volumeRange = $('#volumeControl');
			volumeRange.on("change mousemove", function(){
				var newVal = - (volumeRange.val() - 140);
				setVolCmd(newVal);
			});
			
			
			
			// var startBtn = $('#startBtn');
			// startBtn.click(sendStartCommand);
			
		}); 
	
		
		
		var lastSleepSummary = [25, 55, 20];
		
		var pieData ={
		"gui": {
			"context-menu": {
				"button": {
					"visible": false
				},
					"gear": {
					"visible": false
				}
			}
		},
        "graphset": [
        { 
			"background-color": "none",
			"type":"pie",
			"offset-x": "-5px",
			
			"series": [
				{"text":"Deep","values":[lastSleepSummary[0]], "background-color":"#77B03C"},{"text":"Light","values":[lastSleepSummary[1]], "background-color":"#FBE372"},{"text":"Awake","values":[lastSleepSummary[2]], "background-color":"#DB4B4E"},{"values":[33]}
			],
			"plot":{
				"shadow":false,
				"slice":60,
				"ref-angle": 135,
				"value-box":{
					"visible": 0
				},
				"detach": false
			},
			"plotarea":{
				"margin-top": 0
			},
			"labels":[{
				"text": "",
				"x":"50%",
				"y":"50%",
				"font-size":"100%",
				"anchor":"c",				
			
			}],
			"label":{
				"visible":"false"
			},
			
			
		}]
		
		};
		
		var barData = {
		
		"gui": {
			"context-menu": {
				"button": {
					"visible": false
				},
					"gear": {
					"visible": false
				}
			}
		},
		"graphset":[
		{
			"background-color": "none",
			"type":"hbar",
			"stacked":true,
			"series":[
				{"values":[lastSleepSummary[0]],"background-color":"#77B03C"},{"values":[lastSleepSummary[1]],"background-color":"#FBE372"},{"values":[lastSleepSummary[2]],"background-color":"#DB4B4E"}
			],
			"scale-x":{
				"line-width":0,
				"tick":{
					"visible":false
				},
				"item":{
					"visible":false
				},
				"guide":{
					"visible":false
				}
			},
			"scale-y":{
				"line-width":0,
				"tick":{
					"visible":false
				},
				"guide":{
					"visible":false
				},
				"item":{
					"visible":false
				}
			},
			"plot":{
				"bar-width": "25px"
			},
			"plotarea":{
				"margin-bottom": 45,
			},
			"gear": {
                "visible": false
            }
		
		}]};
		
		var trendData = {
		"gui": {
			"context-menu": {
				"button": {
					"visible": false
				},
					"gear": {
					"visible": false
				}
			}
		},
		"graphset":[
		{
			"background-color": "none",
			"type":"bar",
			"stacked":true,
			"stacked-type":"normal",
			"series": [
				{"stack":1,"values":[25,35,42,10,4,20,35],"background-color":"#77B03C"},{"stack":1,"values":[55,20,12,68,90,50,60],"background-color":"#FBE372"},{"stack":1,"values":[20,54,32,45,93,20,30],"background-color":"#DB4B4E"}
			],
			"scale-y":{
				"values": "0:200:10",
				"line-width":0,
				"tick":{
					"visible":false
				},
				"guide":{
					"visible":false
				},
				"item":{
					"visible":false
				}
			},
			"scale-x":{
				"values": ["3/22","3/23","3/24","3/25","3/26","3/27","3/28"],
				"guide":{
					"visible":false
				}
			},
			"plotarea":{
				"margin-left": 20,
				"margin-top": 10,
				"margin-right":20,
				"margin-bottom": 45
			}
		}]};
		
		var sleepState = [99.97,100,99.97,99.87,99.71,99.49,99.21,98.86,98.46,97.99,97.46,96.88,96.23,95.53,94.78,93.98,93.12,92.22,91.26,90.26,89.22,88.14,87.02,85.86,84.66,83.44,82.19,80.9,79.6,78.27,76.93,75.57,74.2,72.81,71.42,70.03,68.63,67.24,65.85,64.46,63.09,61.73,60.38,59.06,57.75,56.47,55.22,53.99,52.8,51.64,50.52,49.44,48.39,47.4,46.44,45.54,44.68,43.88,43.12,42.43,41.78,41.2,40.67,40.2,39.8,39.45,39.17,38.94,38.79,38.69,38.66,37.8,36.93,36.07,35.21,34.35,33.49,32.63,31.76,30.9,30.04,29.18,28.32,27.45,26.59,25.73,24.87,24.01,23.15,22.41,21.67,21.05,20.44,19.82,19.21,18.59,17.97,17.36,16.74,16.13,15.51,14.9,14.28,13.79,13.42,13.05,12.68,12.31,11.94,11.57,11.2,10.83,10.46,10.1,9.73,9.36,8.99,8.62,8.25,7.88,7.51,7.14,6.77,6.4,6.03,5.66,5.29,5.05,4.92,4.92,5.05,5.29,5.54,5.91,6.4,6.89,7.39,7.88,8.37,8.99,9.6,10.22,10.96,11.82,12.68,13.54,14.4,15.27,16.13,16.99,17.85,18.71,19.58,20.44,21.3,22.16,23.02,23.88,24.75,25.61,26.47,27.33,28.19,29.06,29.92,30.78,31.64,32.5,33.36,34.23,35.09,35.95,36.81,37.67,38.54,39.4,40.26,41.12,41.98,42.84,43.71,44.57,45.43,46.29,47.15,48.02,48.88,49.74,50.6,51.46,52.32,53.19,54.05,54.91,55.77,56.63,57.5,58.36,59.22,60.08,60.82,61.44,61.93,62.3,62.54,62.79,62.91,62.91,62.91,62.91,62.91,62.91,62.91,63.04,63.16,63.28,63.4,63.53,63.65,63.77,63.9,64.02,64.14,64.27,64.39,64.51,64.64,64.76,64.76,64.64,64.39,64.02,63.53,63.04,62.42,61.68,60.94,60.2,59.47,58.73,57.99,57.25,56.51,55.77,55.03,54.29,53.56,52.82,52.08,51.34,50.6,49.86,49.12,48.38,47.65,46.91,46.17,45.43,44.69,43.95,43.21,42.48,41.74,41,40.26,39.52,38.78,38.04,37.3,36.57,35.83,35.09,34.35,33.61,32.87,32.13,31.39,30.66,29.92,29.18,28.44,27.7,26.96,26.22,25.49,24.75,23.88,23.02,22.16,21.3,20.44,19.58,18.71,17.85,17.11,16.37,15.64,14.9,14.16,13.42,12.68,12.07,11.57,11.2,10.96,10.83,10.71,10.71,10.83,10.96,11.08,11.2,11.33,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.45,11.33,11.2,11.08,10.96,10.83,10.71,10.59,10.46,10.34,10.22,10.1,9.97,9.85,9.73,9.6,9.48,9.36,9.23,9.11,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.86,8.74,8.62,8.5,8.37,8.25,8.13,8,7.88,7.76,7.63,7.51,7.39,7.26,7.14,7.02,6.89,6.77,6.65,6.53,6.4,6.28,6.16,6.03,5.91,5.79,5.66,5.54,5.42,5.29,5.17,5.05,4.92,4.8,4.68,4.56,4.43,4.31,4.19,4.06,3.94,3.82,3.69,3.57,3.45,3.32,3.2,3.08,2.95,2.83,2.71,2.59,2.46,2.34,2.22,2.09,1.97,1.85,1.72,1.6,1.48,1.35,1.23,1.11,0.98,0.86,0.74,0.62,0.49,0.37,0.25,0.25,0.37,0.62,0.86,1.11,1.35,1.6,1.85,2.09,2.34,2.59,2.83,3.08,3.32,3.57,3.82,4.06,4.31,4.56,4.8,5.05,5.29,5.54,5.79,6.03,6.4,6.89,7.39,7.88,8.37,8.86,9.36,9.85,10.34,10.83,11.33,11.82,12.31,12.8,13.3,13.79,14.28,14.77,15.27,15.76,16.25,16.74,17.24,17.73,18.22,18.71,19.21,19.7,20.19,20.68,21.18,21.67,22.16,22.65,23.15,23.64,24.13,24.62,25.12,25.61,26.1,26.59,27.09,27.58,28.19,28.81,29.42,30.04,30.53,30.9,31.27,31.64,32.01,32.38,32.75,33.12,33.49,33.86,34.23,34.6,34.97,35.46,36.07,36.69,37.3,37.92,38.54,39.15,39.77,40.38,41,41.61,42.23,42.72,43.09,43.46,43.71,43.83,43.95,44.08,44.2,44.32,44.44,44.57,44.69,44.81,44.94,45.06,45.18,45.31,45.43,45.55,45.68,45.8,45.92,46.05,46.17,46.29,46.41,46.54,46.66,46.66,46.54,46.41,46.29,46.17,46.05,45.92,45.8,45.68,45.55,45.43,45.31,45.18,45.06,44.94,44.81,44.57,44.32,44.08,43.83,43.58,43.34,43.09,42.84,42.6,42.35,42.11,41.86,41.61,41.37,41.12,40.87,40.63,40.26,39.77,39.27,38.78,38.29,37.8,37.3,36.81,36.32,35.83,35.33,34.72,34.1,33.49,32.87,32.38,32.01,31.64,31.27,30.9,30.53,30.16,29.79,29.42,29.06,28.69,28.32,27.95,27.45,26.84,26.22,25.61,24.99,24.38,23.76,23.15,22.53,21.91,21.3,20.68,20.19,19.82,19.58,19.45,19.33,19.21,19.08,18.96,18.84,18.71,18.59,18.47,18.34,18.22,18.1,17.97,17.85,17.73,17.61,17.48,17.36,17.24,17.11,16.99,16.87,16.74,16.62,16.5,16.37,16.25,16.13,16.01,15.88,15.76,15.64,15.51,15.39,15.27,15.14,15.02,14.9,14.77,14.65,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.53,14.65,14.9,15.14,15.39,15.64,15.88,16.13,16.37,16.62,16.87,17.24,17.73,18.22,18.71,19.08,19.33,19.58,19.82,20.07,20.31,20.56,20.81,21.05,21.3,21.55,21.79,22.04,22.28,22.53,22.78,23.02,23.27,23.52,23.76,24.01,24.25,24.5,24.75,24.99,25.24,25.49,25.73,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.85,25.98,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,26.1,25.98,25.73,25.49,25.24,25.12,25.12,25.12,25.12,25.12,25.12,25.12,25.12,25.24,25.36,25.49,25.61,25.73,25.85,25.98,26.1,26.22,26.35,26.47,26.59,26.72,26.84,26.96,27.09,27.21,27.33,27.45,27.58,27.7,27.82,27.95,28.07,28.19,28.32,28.44,28.56,28.69,28.81,28.93,29.06,29.06,28.93,28.81,28.69,28.56,28.44,28.32,28.19,28.07,27.95,27.82,27.7,27.58,27.45,27.33,27.21,27.09,26.96,26.84,26.72,26.59,26.47,26.35,26.22,26.1,25.98,25.85,25.73,25.49,25.24,25.12,24.99,24.87,24.75,24.62,24.62,24.62,24.62,24.62,24.62,24.62,24.5,24.38,24.25,24.13,24.01,23.88,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.76,23.64,23.52,23.39,23.27,23.15,23.02,22.9,22.78,22.65,22.53,22.41,22.28,22.16,22.04,21.91,21.79,21.67,21.55,21.42,21.3,21.18,21.05,20.93,20.81,20.81,20.93,21.05,21.18,21.3,21.42,21.55,21.67,21.91,22.28,22.65,23.02,23.39,23.76,24.13,24.38,24.62,24.87,25.12,25.36,25.61,25.85,26.1,26.35,26.59,26.84,27.09,27.33,27.45,27.58,27.7,27.82,27.95,28.07,28.19,28.32,28.44,28.56,28.69,28.81,28.93,29.06,29.18,29.3,29.42,29.55,29.67,29.79,29.92,30.16,30.41,30.66,30.9,31.15,31.39,31.64,31.76,31.89,32.01,32.13,32.26,32.38,32.5,32.63,32.75,32.87,33.12,33.36,33.61,33.86,34.1,34.35,34.6,34.72,34.72,34.72,34.72,34.72,34.72,34.84,34.97,35.09,35.21,35.33,35.46,35.58,35.7,35.83,35.95,36.07,36.2,36.32,36.44,36.57,36.69,36.81,36.93,37.06,37.18,37.3,37.43,37.43,37.3,37.18,37.06,36.93,36.81,36.69,36.57,36.44,36.32,36.2,36.07,35.95,35.95,35.95,35.95,35.95,36.07,36.2,36.32,36.44,36.57,36.69,36.81,36.93,37.06,37.18,37.3,37.55,37.8,38.04,38.29,38.54,38.78,39.03,39.27,39.52,39.77,39.89,40.01,40.14,40.26,40.38,40.38,40.38,40.38,40.38,40.38,40.38,40.38,40.38,40.26,40.14,40.01,39.89,39.77,39.64,39.52,39.4,39.27,39.15,39.03,38.9,38.78,38.66,38.54,38.29,38.04,37.8,37.55,37.3,37.06,36.81,36.69,36.69,36.69,36.69,36.69,36.69,36.57,36.44,36.32,36.2,36.07,35.95,35.83,35.58,35.46,35.33,35.21,34.97,34.72,34.47,34.23,33.98,33.73,33.49,33.24,33,32.75,32.5,32.26,32.01,31.76,31.52,31.27,31.03,30.78,30.53,30.29,30.04,29.79,29.55,29.3,28.93,28.56,28.32,28.07,27.7,27.33,26.96,26.59,26.22,25.85,25.49,25.12,24.75,24.38,24.01,23.64,23.27,22.9,22.53,22.16,21.79,21.42,21.05,20.68,20.31,20.07,19.82,19.58,19.33,19.08,18.84,18.59,18.34,18.1,17.85,17.61,17.36,17.11,16.99,16.87,16.74,16.62,16.5,16.37,16.25,16.13,15.88,15.64,15.39,15.14,14.9,14.65,14.4,14.16,13.91,13.67,13.42,13.17,12.93,12.68,12.43,12.31,12.19,12.07,11.94,11.82,11.7,11.57,11.45,11.33,11.2,11.08,10.96,10.96,10.83,10.71,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.59,10.71,10.83,10.96,11.08,11.2,11.33,11.45,11.57,11.7,11.82,11.94,12.07,12.31,12.56,12.93,13.3,13.67,14.04,14.4,14.77,15.14,15.51,15.88,16.25,16.62,16.99,17.36,17.73,18.1,18.47,18.84,19.21,19.58,19.94,20.31,20.68,21.05,21.42,21.79,22.16,22.53,22.78,23.02,23.27,23.52,23.76,24.01,24.25,24.5,24.75,24.99,25.24,25.49,25.73,26.1,26.47,26.84,27.21,27.7,28.19,28.69,29.18,29.67,30.16,30.66,31.15,31.64,32.13,32.63,33,33.36,33.73,34.1,34.35,34.6,34.84,35.09,35.46,35.83,36.2,36.57,36.93,37.3,37.67,38.04,38.29,38.54,38.66,38.78,38.9,39.03,39.15,39.27,39.4,39.52,39.64,39.77,39.89,40.01,40.14,40.26,40.26,40.26,40.38,40.51,40.63,40.75,41,41.24,41.61,41.98,42.35,42.72,42.97,43.21,43.34,43.46,43.58,43.71,43.83,43.95,44.08,44.2,44.32,44.44,44.57,44.69,44.81,44.94,45.06,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.18,45.31,45.43,45.55,45.68,45.31,44.94,44.58,44.57,44.58,44.61,44.67,44.74,44.84,44.95,45.09,45.25,45.42,45.61,45.82,46.05,46.29,46.54,46.81,47.09,47.38,47.68,47.98,48.3,48.62,48.94,49.26,49.59,49.91,50.23,50.55,50.86,51.17,51.47,51.76,52.04,52.3,52.56,52.8,53.02,53.23,53.43,53.6,53.76,53.89,54.01,54.11,54.18,54.24,54.27];
		var tones = [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100];
		var lineData = {
			"gui": {
				"context-menu": {
					"button": {
						"visible": false
					},
						"gear": {
						"visible": false
					}
				}
			},
			"graph":{
				
				"plotarea":{
					"background-color": "#FFFFFF"
				}
			},
			
			"graphset": [
				{
					"background-color": "none",
					"type": "mixed",
					/* "title": {
						"text": "LAST SLEEP",
						"background-color": "#FFFFFF",
						"font-size": "20px",
						"font-color": "black"
					}, */
					"plotarea":{
						"margin-top":"20px",
						"margin-left": "30px",
						"margin-right": "30px",
						"margin-bottom": "60px"
					},
					"legend":{
						"background-color":"none",
						"border-color":"gray",
						"border-width":0,
						"shadow":0,
						"toggle-action":"none",
						"layout": "horizontal",
						"x": "20%",
						"y": "75%"
						
					},
					"series": [
					{
					"text": "Tones On",
					"type":"bar",
					"values": tones,
					"background-color": "lightgray"
					},
					{
					"text": "Sleep Score",
					"type": "line",
					"values": sleepState,
					"line-color": "#77b03c",
					}
					
					],
					"scale-x":{
						//"values": lineRange,
						"min-value": 1426182523904,
						"step":20000,
						"transform":{
							"type":"date",
							"all": "%h:%i:%s <br> %A",
						}
					},
					"scale-y":{
						"values": "0:100:10",
						/* "label":{
							"text": "Score",
							"background-color": "#FFFFFF",
							"font-size": "20px",
							"font-color": "black"
						} */
					},
					"crosshair-x":{
						"plot-label":{
							"max-chars": 6
						},
						"trigger": "move"
					}
					
				
				}
			]
		};
		
	var stat1Data ={
		"gui": {
			"context-menu": {
				"button": {
					"visible": false
				},
					"gear": {
					"visible": false
				}
			}
		},
        "graphset": [
        { 
			"background-color": "none",
			"type":"pie",
			"offset-x": "-5px",
			
			"series": [
				{"text":"Deep","values":[lastSleepSummary[0]], "background-color":"#77B03C"},{"text":"Light","values":[lastSleepSummary[1]], "background-color":"#FBE372"},{"text":"Awake","values":[lastSleepSummary[2]], "background-color":"#DB4B4E"},{"values":[33]}
			],
			"plot":{
				"shadow":false,
				"slice": "80%",
				"ref-angle": 135,
				"value-box":{
					"visible": 0
				},
				"detach": false
			},
			"plotarea":{
				"margin-top": "0px",
				"margin-bottom":"10px",
			},
			"labels":[{
				"text": "",
				"x":"50%",
				"y":"50%",
				"font-size":"100%",
				"anchor":"c",				
			
			}],
			"label":{
				"visible":"false"
			},
			
			
		}]
		
		};
		
		var stat2Data ={
		"gui": {
			"context-menu": {
				"button": {
					"visible": false
				},
					"gear": {
					"visible": false
				}
			}
		},
        "graphset": [
        { 
			"background-color": "none",
			"type":"pie",
			"offset-x": "-5px",
			
			"series": [
				{"text":"Deep","values":[lastSleepSummary[0]], "background-color":"#77B03C"},{"text":"Light","values":[lastSleepSummary[1]], "background-color":"#FBE372"},{"text":"Awake","values":[lastSleepSummary[2]], "background-color":"#DB4B4E"},{"values":[33]}
			],
			"plot":{
				"shadow":false,
				"slice": "80%",
				"ref-angle": 135,
				"value-box":{
					"visible": 0
				},
				"detach": false
			},
			"plotarea":{
				"margin-top": "0px",
				"margin-bottom":"10px",
			},
			"labels":[{
				"text": "",
				"x":"50%",
				"y":"50%",
				"font-size":"100%",
				"anchor":"c",				
			
			}],
			"label":{
				"visible":"false"
			},
			
			
		}]
		
		};
		
		var width = $(window).width()*.8;
		//alert(width);
		zingchart.render({
			id:'main-pie',
			height: 200,
			width: 200,
			data: pieData
		});
		
		zingchart.render({
			id:'bar-side',
			height: 50,
			width: "100%",
			data: barData
		});
		
		zingchart.render({
			id:'trends-bar',
			height: 200,
			width: "100%",
			data: trendData
		});
		
		zingchart.render({
			id:'line',
			height: 200,
			width: "100%",
			data: lineData
		});
		
		zingchart.render({
			id:'stat1',
			height: 180,
			width: "100%",
			data: stat1Data
		});
		
		zingchart.render({
			id:'stat2',
			height: 180,
			width: "100%",
			data: stat2Data
		});
		
		localStorage.clear();
		// $('#syncreturn').append("<p>Device Ready</p>");
		bluetoothle.initialize(initSuccess, initFail,{"request":true,"statusReceiver":true});


/* 		// add images to canvas
		var tiltctx = $('#tiltCanvas')[0].getContext("2d");
		tiltctx.save();
		tiltctx.translate(75,75);
		tiltctx.rotate(90*Math.PI/180);
		var tiltImg = new Image;
		tiltImg.src = "img/head profile.png";
		tiltImg.onload = function(){
			tiltctx.drawImage(tiltImg, -75 , -75, 150, 150);
			tiltctx.restore();
		}
		
		var anglectx = $('#angleCanvas')[0].getContext("2d");
		anglectx.save();
		anglectx.translate(75,75);
		anglectx.rotate(180*Math.PI/180);
		
		var angleImg = new Image;
		angleImg.src = "img/head top view colored.png";
		angleImg.onload = function(){
			anglectx.drawImage(angleImg, -75, -75, 150, 150);
			anglectx.restore();
		}
		
		rotateImg(angleImg, anglectx, 45);
		
		function rotateImg (img, ctx, angle){
			ctx.save();
			ctx.translate(75,75);
			ctx.rotate(angle*Math.PI/180);
			ctx.drawImage(img, -75, -75, 150, 150);
			ctx.restore();
		} */
		
		
        function initSuccess() {
			//$('#syncreturn').append("<p>Init success</p>");
			//alert('init success');
			//alert(JSON.stringify(intToBytes(102400)));
			if (localStorage.address){
				//alert(localStorage.address);
				address = localStorage.address;
				deviceSetup = true;
				//bluetoothle.connect(connectSuccess,connectFail, {"address":address});
			}
			
			// $('.commandBtn').click(function(){  
				// state = this.id;
			// });
			
			// Handle click of CONNECT BUTTON: scans for device, connects, discovers services+characteristics, subscribes, the writes confirm command
			$("#connectBtn").on("vclick",function(){
				if (address){
					bluetoothle.isConnected(isConnectedCallback, {"address":address}); // can only be called successfully IF ADDRESS IS KNOWN!!!
				}else{
					//alert('no local storage');
					var d = new Date();
					syncStartTime = d.getTime();
					bluetoothle.startScan(scanSuccess, scanFail,null);

					setTimeout(function(){
				
						bluetoothle.stopScan(stopSuccess,stopFail)
					
					}
					, 1000);
				}
				// startScanTime = new Date();
				// bluetoothle.startScan(scanSuccess, scanFail,null);
				// setTimeout(function(){
					// bluetoothle.stopScan(stopSuccess,stopFail)
				// }, 1000);
			});
			
			// Handle click of buttons that write commands to hat: just writes command to hat
			
			$("#confirmBtn").click(function(){
				var hexArray = ["AA","AA","04","01","02","03","04",""];
				var writeArray = hexToUint8(hexArray);
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			});
			
			// CHECK FOR DATA
			var checkDataBtn = $('#checkDataBtn');
			checkDataBtn.on("vclick",sendCheckDataCommand);
			
			function sendCheckDataCommand(){
				var hexArray = ["AA","AA","03","94","20","00",""];
				var writeArray = hexToUint8(hexArray);
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			}	
			
			
			// START RECORDING DATA
			
			var startBtn = $('#startBtn');
			startBtn.on('vclick', sendStartCommand);
			
			function sendStartCommand(){
				accelX = [];
				accelY = [];
				accelZ = [];
				var d = new Date();
				var time = d.getTime();
				time = 0;
				var hexArray = ["AA","AA","0C","82","10"];
				hexArray = hexArray.concat(intToBytes(time,6), intToBytes(1*1000,4), [""]);
				var writeArray = hexToUint8(hexArray);
				//alert(JSON.stringify(writeArray)):
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				//alert(JSON.stringify(writeArray)+" "+time);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			}
			
			// END SLEEP AND FETCH DATA

			var endBtn = $('#endBtn');
			endBtn.on('vclick',sendEndCommand);
			
			function sendEndCommand(){
				var d = new Date();
				syncStartTime = d.getTime();
				var time = d.getTime();
				var hexArray = ["AA","AA","08","83","10"];
				hexArray = hexArray.concat(intToBytes(time,6), [""]);
				var writeArray = hexToUint8(hexArray);
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				//alert(JSON.stringify(writeArray)+" "+time);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			}
			
			// CHECK FOR STORED DATA
			$("#dataCheckBtn").click(function(){
				var hexArray = ["AA","AA","04","01","02","03","04",""];
				var writeArray = hexToUint8(hexArray);
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			});
			
			// FETCH STORED DATA
			$("#dataFetchBtn").click(function(){
				var hexArray = ["AA","AA","04","01","02","03","04",""];
				var writeArray = hexToUint8(hexArray);
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			});			
			
			
			// VOLUME UP
			$("#sleepVolUpBtn").on("vclick",sendVolUpCmd);
			
			var timeout;
			$("#sleepVolUpBtn").on("vmousedown",function(){
				timeout = setInterval(function(){
					sendVolUpCmd();
				},150);
			
			});
			
			$("#sleepVolUpBtn").on("vmouseup",function(){
				clearInterval(timeout);
			});
			
			// VOLUME DOWN
			$("#sleepVolDownBtn").on("vclick",sendVolDownCmd);
			
			var timeout2;
			$("#sleepVolDownBtn").on("vmousedown",function(){
				timeout2 = setInterval(function(){
					sendVolDownCmd();
				},150);
			
			});
			
			$("#sleepVolDownBtn").on("vmouseup",function(){
				clearInterval(timeout2);
			});
			
			
			// START TONES
			$("#toneStartBtn").click(function(){
				var hexArray = ["AA","AA","04","01","02","03","04",""];
				var writeArray = hexToUint8(hexArray);
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			});
			
			// STOP TONES
			$("#toneStopBtn").click(function(){
				var hexArray = ["AA","AA","04","01","02","03","04",""];
				var writeArray = hexToUint8(hexArray);
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			});
			
			// ERASE STORED DATA
			$("#eraseBtn").click(function(){
				var hexArray = ["AA","AA","04","01","02","03","04",""];
				var writeArray = hexToUint8(hexArray);
				var writeString = bluetoothle.bytesToEncodedString(writeArray);
				bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			});
			
			// DISCONNECT FROM HAT WITH COMMAND
			// $("#disconnectsBtn").click(function(){
				// var hexArray = ["AA","AA","04","01","02","03","04",""];
				// var writeArray = hexToUint8(hexArray);
				// var writeString = bluetoothle.bytesToEncodedString(writeArray);
				// bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			// });
			
			// DISCONNECT FROM HAT WITH PLUGIN
			$("#disconnectBtn").click(function(){
				console.log("disconnect btn clicked");
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});
			});
			
        }
        
        
		/* function getVolume(){
			// Write getVolume command
			alert("In getVolume");
			var hexArray = ["AA","AA","03","04","20","00",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			// Set flag in subscribeSuccess (data.status === "subscribedResult")
		} */
    
		function getAccel(){
			// Write getAccel command
			var hexArray = ["AA","AA","03","58","20","00",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
			// Set flag in subscribeSuccess (data.status === "subscribedResult")
		}
        // Success Callbacks
        
        function scanSuccess(data){
			
			if (data.status == "scanResult"){
				//console.log("New result: "+(new Date().getTime() - startScanTime.getTime()));
				/* if (data.name === "SSV1_00000" ){
					foundDevices.push(data.address);
					address = data.address;
					bluetoothle.stopScan(stopSuccess,stopFail);
				} */

					if (foundDevices.indexOf(data.address) < 0 && data.name === desiredName/* "SSV1_00000" */){
						//$('#syncreturn').append("<a class='device' data-address='"+data.address+"'>Scan success: "+data.name+" "+data.address+"</a><br>");
						foundDevices.push(data.address);	
						console.log(JSON.stringify(foundDevices));
						address = data.address;
						// bluetoothle.stopScan(stopSuccess,stopFail);
					}/* else if(foundDevices.length === 2){
						bluetoothle.stopScan(stopSuccess,stopFail);
					} */else{
						console.log('No devices found');
						//bluetoothle.stopScan(stopSuccess,stopFail);
					}
				
			}
            
        }
    
        function stopSuccess(data){
			// $('#syncreturn').append("<p>Stop scan success: "+data.status+" "+foundDevices.length+"</p>");
			console.log("Stop Success "+foundDevices[deviceToTry]);
			// deviceToTry++;
			// console.log(foundDevices[deviceToTry]);
			//console.log(JSON.stringify(foundDevices));
			//bluetoothle.connect(connectSuccess,connectFail,{"address":address});
			//address = foundDevices[deviceToTry];
			
			
			
			connectRecursive(deviceToTry);
			
        }
    
		var connectRecursive = function(n){
				console.log("in recursive function");
				if (n < foundDevices.length){
					address = foundDevices[n];
					bluetoothle.connect(connectSuccess,connectFail,{"address":address});
				}
			}
		
        function connectSuccess(data){
			addressTried = data.address;
			
			 if (data.status === "connected"){
			 // $('#syncreturn').append("<p>Connect success: "+data.status+"</p>");
			 
				//alert('Connected'+addressTried);
				
				if (deviceSetup){
					platform = device.platform;
					if (platform == "iOS"){
						bluetoothle.services(servSuccess,servFail,{ "address": address,"serviceUuids": [] });
					}else if (platform == "Android"){
						//$('#syncreturn').append("<p>Before discover</p>");
						bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
					}else{
					// Unsupported Platform
					}
				}else{
					correctConnection = confirm("Is the blue LED on your device lit up?");
					if (correctConnection){
						var d = new Date();
						syncStartTime = d.getTime();
						address = data.address;
						localStorage.address = address;
						deviceSetup = true;
						platform = device.platform;
						//alert(platform);
						if (platform == "iOS"){
							bluetoothle.services(servSuccess,servFail,{ "address": address,"serviceUuids": [] });
						}else if (platform == "Android"){
							//$('#syncreturn').append("<p>Before discover</p>");
							bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
						}else{
						// Unsupported Platform
						}
					}else{
						//alert('Disconnecting from device');
						bluetoothle.disconnect(disconnectSuccess, disconnectFail,{ "address": address});
					}
				}
			}else if(data.status === "disconnected"){
				alert("Uh oh. We were disconnected!");
				$('#volumeControl').slider('disable').slider('refresh');
				$('#checkDataBtn').addClass("ui-state-disabled");
				$('#startBtn').addClass("ui-state-disabled");
				$('#endBtn').addClass("ui-state-disabled");
				$("#connectBtn").removeClass("ui-state-disabled");
			}
        }
        
        function servSuccess(data){
			//$('#syncreturn').append("<p>Service Success: "+JSON.stringify(data)+"</p>");
			//alert("service success");
            bluetoothle.characteristics(charSuccess,charFail,{"address":address,"serviceUuid":serviceUuid,"characteristicUuids":[]});
        }

        
        function charSuccess(data){
			//$('#syncreturn').append("<p>Characteristic Success: "+data.status+"</p>");
			//alert("char success");
            bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
        }
        
        function disconnectSuccess(data){
			//$('#syncreturn').append("<p>Disconnect Success</p>");
			if (data.status == "disconnected"){
				if (deviceSetup){
				}else{
					bluetoothle.close(closeSuccess, closeFail,{ "address": address});
				}
				
			}
        }
        
		function closeSuccess(data){
			
			if (deviceSetup){
				foundDevices = new Array();
				//alert(data.status);
			}else{
				//$('#syncreturn').append("<p>Close Success"+deviceToTry+"</p>");
				deviceToTry++;				
				connectRecursive(deviceToTry);
			}
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
			bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
        }
                
        function subSuccess(data){
			//alert("subscribe success");
			if (data.status == "subscribed"){
				$('#volumeControl').slider('enable').slider('refresh');
				$('#checkDataBtn').removeClass("ui-state-disabled");
				$('#startBtn').removeClass("ui-state-disabled");
				$('#endBtn').removeClass("ui-state-disabled");
				$("#connectBtn").addClass("ui-state-disabled");
				
				getVolume();
				//getAccel();
				
				//var accelInt = setInterval(function(){getAccel()},50);  // Auto-grab acceleration values
				
				
				
				// var hexArray = ["AA","AA","04","01","02","03","04",""]; // Need to write confirm command or else be kicked off!
				// var writeArray = new Uint8Array(8);
				// for ( i = 0; i < hexArray.length; i++){
					// writeArray[i] = parseInt(hexArray[i],16);
				// }
				// writeArray = [112,112,187,187]; //Confirm connection command
				// var writeString = bluetoothle.bytesToEncodedString(writeArray);
				// bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
				
				//$('#syncreturn').append("<p>Subscribe Success: "+data.status+"</p>");
				
				/* switch (state){
					case "startBtn":
						var writeArray = new Uint8Array(1);
						writeArray[0] = 1;
						var writeString = bluetoothle.bytesToEncodedString(writeArray);
						bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
						//$('#syncreturn').append("<p>QC code sent</p>");
						break;
					case "endBtn":
						var writeArray = new Uint8Array(1);
						writeArray[0] = 2;
						var writeString = bluetoothle.bytesToEncodedString(writeArray);
						bluetoothle.write(writeSuccess, writeFail, {"address":address,"value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
						$('#syncreturn').append("<p>QC code sent</p>");
						break;
					case "qcBtn":
						var writeArray = new Uint8Array(1);
						writeArray[0] = 3;
						var writeString = bluetoothle.bytesToEncodedString(writeArray);
						bluetoothle.write(writeSuccess, writeFail, {"address":address,"value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
						$('#syncreturn').append("<p>QC code sent</p>");
						break;
				} */
			}else if(data.status == "subscribedResult"){
				var returnedBytes = bluetoothle.encodedStringToBytes(data.value);
				//$('#syncreturn').append("<p>Returned Bytes: "+JSON.stringify(returnedBytes)+"</p>");
				// alert("received: "+JSON.stringify(returnedBytes));
				// -- Received Signal Strength -- //
				if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 3 && returnedBytes[3] == 68){
					//alert("received signal strength of: "+returnedBytes[4]);
					var signalStrength = returnedBytes[5];
					$('#signalStrength').html(signalStrength);
					if (signalStrength < 25){
						$('#sigStrengthContainer').css('background',"#77b03c");
					}else if (signalStrength < 100){
						$('#sigStrengthContainer').css('background',"#fbe372");
					}else{
						$('#sigStrengthContainer').css('background',"#db4b4e");
					}
				}
				// -- Received volume level -- //
				if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 3 && returnedBytes[3] == 132 && returnedBytes[4] == 48){
					
					if (needCurrentVolume){
						
						//alert("received signal strength of: "+returnedBytes[4]);
						var volumeRaw = returnedBytes[5];
						var volumeMapped = volumeMap(volumeRaw);
						alert(volumeRaw+" "+volumeMapped);
						var volumeControl = $('#volumeControl');
						volumeControl.val(volumeMapped).slider("refresh");
						needCurrentVolume = false;
					}
					// $('#volumeLabel').html(volumeMapped);
					// $('#volumeBar').css('width',volumeMapped+'%');
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
					//alert(dataX+" "+dataY+" "+dataZ);
					$('#xLabel').html(dataX);
					$('#yLabel').html(dataY);
					$('#zLabel').html(dataZ);
					//alert("here");
					var headPosition = processAccelData(dataX,dataY,dataZ);
					//alert(headPosition);
					$('#angle').html(headPosition[0]);
					$('#tilt').html(headPosition[1]);
					updateOrientationPlots(headPosition);
				}
				
				// -- Received Sleep Data Header Packet -- //
				if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 130 && returnedBytes[4] == 48){
					var countArray = [returnedBytes[5], returnedBytes[6]]; //returnedBytes.slice(5,7);
					expectedCount = 0;
					packetCounter = packUnsigned(countArray);
					//if (expectedCount === packetCounter) {alert('correct header counter');};
				}
				
				// -- Received Sleep Data Stream Packet -- //
				if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[2] == 16){
					var countArray = [returnedBytes[3], returnedBytes[4]]; //returnedBytes.slice(3,5);
					packetCounter = packUnsigned(countArray);
					expectedCount++;
					if (expectedCount !== packetCounter){
						//alert('Did not receive packet '+expectedCount);
						//$('#syncreturn').append("<p>Didn't receive packet: Expected: "+expectedCount+", Received: "+packetCounter+"<p>");
						
					}else{
						//alert('Correct packet received');
						//$('#syncreturn').append("<p>Correct packet received: "+packetCounter+"<p>");
						accelX.push(pack([returnedBytes[6], returnedBytes[7] ]),pack([returnedBytes[13], returnedBytes[14] ]));
						accelY.push(pack([returnedBytes[8], returnedBytes[9] ]),pack([returnedBytes[15], returnedBytes[16] ]));
						accelZ.push(pack([returnedBytes[10], returnedBytes[11] ]),pack([returnedBytes[17], returnedBytes[18] ]));
					}
				}
				
				// -- Received Sleep Data Footer Packet -- //
				if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 131 && returnedBytes[4] == 48){
					//alert('received footer');
					$('#syncreturn').append("<p>Footer Received<p>");
					var countArray = [returnedBytes[5], returnedBytes[6]];//returnedBytes.slice(5,7);
					packetCounter = packUnsigned(countArray);
					expectedCount++;
					if (expectedCount !== packetCounter){
						alert('Did not receive packet '+expectedCount);
						$('#syncreturn').append("<p>Footer Counter WRONG. Packet Number: sent "+packetCounter+" expected "+expectedCount+"<p>");
					}else{
						var d = new Date();
						syncEndTime = d.getTime();
						alert("Sync Seconds :"+(syncEndTime - syncStartTime)/1000);
						alert(JSON.stringify(accelX));
						//alert('Footer contains correct packet! Sync complete!');
						$('#syncreturn').append("<p>Footer Counter Correct<p>");
						//alert(accelZ);
						processRawData(accelX, accelY, accelZ);
					}
					
				}
				
				// -- Received Data Check Result -- //
				if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 148 && returnedBytes[4] == 48){
					//alert(JSON.stringify(returnedBytes));	
					if (returnedBytes[5] ){
						alert("Data available for upload");
					}else {
						alert("No data available for upload");
					}
				}
				
				if (returnedBytes[0] == 170 && returnedBytes[1] == 170 && returnedBytes[3] == 130 && returnedBytes[4] == 48){
					alert("received start sleep command echo");					
				}
				
			}
			//
        }
        
		function readSuccess(data){

        }
		
        //Failure Callbacks
        
        function initFail(e){
			alert('Init fail. Is bluetooth enabled?');
        }
        
        
        
        function scanFail(e){
			alert('Scan failed: '+JSON.stringify(e));
        }
        
        
        
        function stopFail(e){
			alert('Stop failed: '+JSON.stringify(e));
        }
        
        
        
        function connectFail(e){
			alert('Connect failed: '+JSON.stringify(e));
        }
        
        
        
        function servFail(){
			alert('Service failed: '+JSON.stringify(e));
        }
        
        
        
        function charFail(){
			alert('Char failed: '+JSON.stringify(e));
        }
        
        
        
        function disconnectFail(){
            alert("Disconnect Fail: "+JSON.stringify(e));
        }
        
        
        
        function writeFail(e){
			alert("Write Fail " +JSON.stringify(e));
        }
        
        
        
        function readDescFail(e){
            alert("Read Descriptor Fail: "+JSON.stringify(e));
        }
        
        
        
        function discoverFail(e){
            alert("Discovery Fail: "+JSON.stringify(e));
			console.log("Discovery Fail: "+JSON.stringify(e));
        }
        
        function readFail(){
			alert("Read Fail"+JSON.stringify(e));
        }
        
        function subFail(e){
			alert("Subscribe Fail:"+JSON.stringify(e));
        }
        
		function closeFail(e){
			alert("Close Fail: " + JSON.stringify(e));
		}
		
		function pack(bytes) {
			var byteLen = bytes.length;
			for(var i = 0; i < byteLen; i += 2) {
				var char = bytes[i] << 8;
				if (bytes[i + 1])
					char |= bytes[i + 1];
			}
			if (char > Math.pow(2,8*byteLen-1)-1){
				char -= Math.pow(2,8*byteLen);
			}
			return char;
		}
		
		function packUnsigned(bytes) {
			var byteLen = bytes.length;
			for(var i = 0; i < byteLen; i += 2) {
				var char = bytes[i] << 8;
				if (bytes[i + 1])
					char |= bytes[i + 1];
			}
			return char;
		}
		
		function unpack(intSize) {
			/* var bytes = [];
			for(var i = 0; i < str.length; i++) {
				var char = str.charCodeAt(i);
		// You can combine both these calls into one,
		//    bytes.push(char >>> 8, char & 0xff);
				bytes.push(char >>> 8);
				bytes.push(char & 0xFF);
			}
			return bytes; */
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
			//alert(JSON.stringify(writeArray2));
			writeArray2 = new Uint8Array(writeArray2);
			return writeArray2;
		}
		
		
		function isConnectedCallback(data){
			//alert("in isConnectedCallback: "+JSON.stringify(data));
			if (data.error === "neverConnected"){ // hits if you haven't been connected to the device since opening the app
				//scan as usual...
				//alert("never connected");
				var d = new Date();
				syncStartTime = d.getTime();
				bluetoothle.startScan(scanSuccess, scanFail,null);

				setTimeout(function(){
			
					bluetoothle.stopScan(stopSuccess,stopFail)
				
				}
				, 1000);
			}
			if (platform === "iOS"){
				if (data.isConnected === false){ // hits if you have have connected before or are connected now. on iOS returns false when connected/true when not... on Android works as expected  
					//false => connected
					var d = new Date();
					syncStartTime = d.getTime();
					var writeArray = new Uint8Array(1);
					writeArray[0] = 1;
					var writeString = bluetoothle.bytesToEncodedString(writeArray);
					bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
				}else{
					//true => not connected to previously connected device
					bluetoothle.reconnect(connectSuccess, connectFail, {"address":address});
				}
			}else if (platform === "Android"){
				if (data.isConnected){ // hits if you have have connected before or are connected now. on iOS returns false when connected/true when not... on Android works as expected  
					//true => connected
					var d = new Date();
					syncStartTime = d.getTime();
					var writeArray = new Uint8Array(1);
					writeArray[0] = 1;
					var writeString = bluetoothle.bytesToEncodedString(writeArray);
					bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
				}else{
					//false => not connected to previously connected device
					bluetoothle.reconnect(connectSuccess, connectFail, {"address":address});
				}
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
		
		function volumeMap(data){
			var maxRaw = 140; // lowest volume
			var minRaw = 50; // highest volume
			
			var max = 100;
			var min = 0;
			
			var percent = 1-(data-minRaw)/(maxRaw-minRaw);
			 
			return Math.round(percent*(max-min)+min);
		}
		
		function sendVolUpCmd(){
			//$("#sleepVolUpBtn").off("vclick");
			//alert("vol up btn pressed");
			var hexArray = ["AA","AA","03","84","40","D1",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
			
		function setVolCmd(value){
			var hexValue = value.toString(16);
			var hexArray = ["AA","AA","03","84","10",hexValue,""];
			//alert(JSON.stringify(hexArray));
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function sendVolDownCmd(){
			//$("#sleepVolDownBtn").off("vclick");
			//alert("vol down btn pressed");
			var hexArray = ["AA","AA","03","84","40","D2",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
			bluetoothle.write(writeSuccess, writeFail, {"address":address, "value":writeString, "serviceUuid":serviceUuid, "characteristicUuid":charUuid,"type":"noResponse"});
		}
		
		function getVolume(){
			alert("in getVolume");
			var hexArray = ["AA","AA","03","84","20","00",""];
			var writeArray = hexToUint8(hexArray);
			var writeString = bluetoothle.bytesToEncodedString(writeArray);
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
		
		function processRawData(Ax, Ay, Az){
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
					newData[i] = data.slice(lindex,rindex+1).reduce(function(pv, cv) { return pv + cv; }, 0);;   
				}
				return newData;
			}
			
			function getMaxOfArray(numArray) {
				return Math.max.apply(null, numArray);
			}

			var window1 = Math.round(720/framesToSkip);
			var window2 = Math.round(1000/framesToSkip);
			var sleepState = windowSum(window2,windowSum(window1, motion));
			
			var maxEvents = 400;
			var minEvents = 100; 
			// Determine how to scaled smoothed function
			var asleepConst = (motionEvents-minEvents)*20/maxEvents+60; 
			var asleepMax = Math.random()*10+asleepConst;                                          // Maximum value of the internal peaks. The more events, the higher the value of the maximum peak. A random component of +/- 10 added
			sleepState = sleepState.map(function(x){return x*asleepMax/getMaxOfArray(sleepState)});;                             // Scale SleepState according to calculated maximum
			
			// Determine introduction interval length
			var introConst = (motionEvents-minEvents)*0.5/maxEvents+0.45;                         // Arduino equivalent map(# of events, minEvents, maxEvents,0.45,0.9). This returns fraction of one hour for the length of the introduction curve (curve at beginning of data).
			var introInterval = Math.round(introConst*Math.round(3600/framesToSkip));                  // Returns number of data points that the introduction curve will take.
			var introMin = sleepState[introInterval];                                  // Value at the end of the introduction curve, to keep plot continuous.
			var introMax = 100;
			// Calculate the introduction curve
			var time = []
			for (i = 0; i < introInterval ; i++){
				time[i] = (i-1)/(introInterval-1)*Math.PI;                                    // For each index, create a time to allow for calculation of a cosine function. map(index,1,introduction interval length,0,pi)
				sleepState[i] = (introMax-introMin)/2*Math.cos(time[i])+(minEvents-introMin)/2+introMin; //Calculate new SleepState value for each data point in the introduction curve range
			}

			// Determine outroduction interval length
			var outroConst = -0.125*(motionEvents-minEvents)/maxEvents+0.25;         // map(# of events, minEvents,maxEvents, 0.125,0.25). Returns fraction of one hour for outroduction interval. Higher constant = shorter outroduction.
			var outroInterval = Math.round(outroConst*Math.round(3600/framesToSkip));     //Number of data points to be used in outroduction curve
			var outroStart = orientation.length-outroInterval;                 //Beginning index of outroduction 

			var outroMin = sleepState[outroStart];                              //Beginning value of outroduction
			var outroMax = Math.random()*20+50;                                       //Ending value of outroduction. Returns random value between 50 and 70

			//Flip sign if OutroMin > OutroMax (if value at end happens to be higher than random value for the end of outroduction
			amp = outroMax-outroMin;
			if (amp <0){
				sign = -1;
			}else{
				sign = 1;
			}

			//Calculate the outro curve
			var time = [];
			for (i = 0; i < outroInterval ; i++){
				time[i] = (i-1)/(outroInterval-1)*Math.PI; // For each index, create a time to allow for calculation of a cosine function. map(1,outroduction interval length,0,pi)
				sleepState[i+outroStart] = -sign*(outroMax-outroMin)/2*Math.cos(time[i])+sign*(outroMax-outroMin)/2+outroMin; //Calculate new SleepState value for each data point in the outroduction curve range
			}
			var sleepStateShort = [];
			for (var i = 0; i < sleepState.length ; i = i+15){
				sleepStateShort.push(sleepState[i]);
			}
			
			var d = new Date();
			var processEndTime = d.getTime();
			alert("Processing took: "+ (processEndTime - processStartTime)/1000);
		//-------- Set Up Line Graph ---------------------//

			var graphLabels = [];  // Sets full hours, every other point has blank label;
			for (i = 0; i < sleepState.length ; i = i+15){
				graphLabels.push(i.toString());
			}
			/* for (i = 0; i < Ax.length ; i++){
				if (i*20 % 3600 === 0){
					graphLabels[i] = (i*20/3600).toString();
				}else{
					graphLabels[i] = "";
				}
			} */
			var ctx = $("#graph").get(0).getContext("2d");
			// This will get the first returned node in the jQuery collection.
			var data = {labels: graphLabels,
			datasets: [
				{
					label: "My First dataset",
					fillColor: "rgba(0,0,0,0.2)",
					strokeColor: "rgba(0,0,0,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#000",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: sleepStateShort
				},
			   
			]};
			Chart.defaults.global.animation = false;
			
			var options = {"pointDotRadius":1,  "pointHitDetectionRadius" :1};
			var myNewChart = new Chart(ctx).Line(data,options);
		}
		
		
	
		
		/* volumeRange.on("click",function(){
			alert("clicked the slider");
		}); */
		
    }, // onDeviceReady end tag
    
};
