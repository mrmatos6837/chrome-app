// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let calculate = document.getElementById('calculate');

calculate.onclick = function(element) {
	let input = document.getElementById('input').value;
	let timeTable= mapTable(input);
	var today = new WorkDay(timeTable[0]);
	today.calculateAllTimes(timeTable);
	clearResults();
	printAllResults(today);
}

//~~ functions below ~~//

function splitComma(text){
	return text.split(",");
}

function splitColon(text){
	return text.split(":");
}
function joinComma(array){
	return array.join(":");
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
	result[0] = Number(t2[0]*1 + t1[0]*1); //str*1 transforms numeric string to number
	result[1] = Number(t2[1]*1 + t1[1]*1);
	
	if(result[1]>=60){
		result[0] += 1;
		result[1] -= 60;
	}

	return [result[0],result[1]];
}

function subTime(t1, t2){ //t2-t1

	let result = [];
	result[0] = Number(t2[0]*1 - t1[0]*1);
	result[1] = Number(t2[1]*1 - t1[1]*1);
	
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

function printResults(string) {
	document.getElementById('results').innerHTML += "<p>"+string+"</p>";
}

function printAllResults(obj){
	if(obj.status=="extra-hours"){
		document.getElementById('results').innerHTML += "<h4> EXTRA HOURS! </h4>"
	}
	printResults(obj.stringHoursDone());
	printResults(obj.stringHoursLeft());
	if(obj.status=="working"){
		printResults(obj.stringLeaveTime());
	}
}

function clearResults(){
	document.getElementById('results').innerHTML = "";
}

//~~ classes ~~//

class WorkDay {
	constructor(entry) {
		this.entryTime=entry;
		this.lastEntry=[];
		this.leaveTime=[];
		this.workJourney= [8,0];
		this.hoursLeft=[];
		this.hoursDone= [0,0];
		this.status= ""; // working, not working, extra-hours
	}
	
	calculateHoursDone(array){
		if (array.length%2==0){
			this.status = "not working";
		}
		else {
			this.status = "working";
			this.lastEntry = array.pop();
		}
		for (var i = 0; i < array.length; i+=2) {
			this.hoursDone = addTime(this.hoursDone, subTime(array[i], array[i+1]));
		}
		if(this.status == "working"){
			this.hoursDone = addTime(this.hoursDone, subTime(this.lastEntry, now()));
		}
		//alert(this.hoursDone);
	}
	
	calculateHoursLeft(){
		this.hoursLeft = subTime(this.hoursDone, this.workJourney)
		//alert(this.hoursLeft);
		if(this.hoursLeft[0]<0){
			this.status="extra-hours";
		}
	}

	calculateLeaveTime() {
		if(this.status=="working"){
			this.leaveTime = addTime(now(), this.hoursLeft);
		}
		else {
			this.leaveTime = this.status;
		}
		//alert(this.leaveTime);
	}

	calculateAllTimes(array) { //order matters
		this.calculateHoursDone(array);
		this.calculateHoursLeft();
		this.calculateLeaveTime();
		
	}

	stringHoursDone(){
		return "Horas trabalhadas: " + this.hoursDone[0] + " horas e " + this.hoursDone[1] + " minutos.";
	}
	stringEntryTime(){
		return "Hora da entrada: " + this.entryTime[0] + " horas e " + this.entryTime[1] + "minutos.";
	}
	stringLeaveTime(){
		return "Hora da saida: " + this.leaveTime[0] + " horas e " + this.leaveTime[1] + "minutos.";
	}
	stringHoursLeft(){
		let string = "Faltam: " + this.hoursLeft[0] + " horas e " + this.hoursLeft[1];
		if(this.status=="working"){
			string += " minutos para ir embora.";
		}
		else{
			string += " minutos a pagar.";
		}
		return string;
	}
}

//01:23, 45:67