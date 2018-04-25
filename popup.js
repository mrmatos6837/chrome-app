// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let calculate = document.getElementById('calculate');

calculate.onclick = function(element) {
	let input = document.getElementById('input').value;
	let timeTable= mapTable(input);
	var today = new WorkDay(timeTable[0][0], timeTable[0][1]);
	//alert(today.entryMinute);

	for (var i = 0; i < timeTable.length; i+=2) {
		today.workDone = subTime(timeTable[i], timeTable[i+1])
	}
	alert(today.workDone);
}

//~~ functions below ~~//

function splitComma(text){
	let splitText = text.split(",");
	return splitText;
}

function splitColon(text){
	let splitText = text.split(":");
	return splitText;
}

function mapTable(input){
	let arrayOfInputs = splitComma(input);
	for (var i = arrayOfInputs.length - 1; i >= 0; i--) {
		arrayOfInputs[i] = splitColon(arrayOfInputs[i]);
	}
	return arrayOfInputs;
}

function addTime(t1, t2){ //t2+t1

	let result = [];
	result[0] = t2[0]+t1[0];
	result[1] = t2[1]+t1[1];
	
	if(result[1]>=60){
		result[0] += 1;
		result[1] -= 60;
	}

	return [result[0],result[1]];
}

function subTime(t1, t2){ //t2-t1

	let result = [];
	result[0] = t2[0]-t1[0];
	result[1] = t2[1]-t1[1];
	
	if(result[1]<0){
		result[0] -= 1;
		result[1] += 60;
	}

	return [result[0],result[1]];
}

function now(){
	let d = new Date();
	return [d.getHours(), d.getMinutes()]
}

//~~ classes ~~//

class WorkDay {
	constructor(entryHour, entryMinute) {
		this.entryHour= entryHour;
		this.entryMinute= entryMinute;
		this.leaveHour= "";
		this.leaveMinute= "";
		this.workJourney= "8";
		this.workDone= 0;
		this.status= ""; // working, not working, extra hours
	}
	calculateHours(){

	}
}

//01:23, 45:67