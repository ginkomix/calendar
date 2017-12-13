'use strict';


function Calendar(yearParam,monthParam) {
	let now = new Date();
	this.year =	yearParam || now.getYear();
	this.month = monthParam || now.getMonth();
	this.element = 3;
//	this.element = now.getMonth()+now.getMilliseconds();
	var self = this;
	this.daySelect = 0;



	function changeMonthBack(){
		self.month--;
		if(self.month===0) {
			self.month=12;
			self.year--;
		}
	}

	function changeMonthNext(){
		self.month++;
		if(self.month===13) {
			self.month=1;
			self.year++;
		}
	}

	this.clickChangeCalendar = function(event){
		if(event.target.tagName!="BUTTON") {
			return;
		}
		let classButton = event.target.getAttribute('class');
		var where = document.querySelector('.boxSave'+self.element);
		if(classButton==='buttonLeft'){
			changeMonthBack();
			
			self.daySelect = self.clearText(where);
			self.drawCalendar();
		}
		if(classButton==='buttonRight'){
			changeMonthNext();
			
			self.daySelect =self.clearText(where);
			self.drawCalendar();
		}
	}

	function getLocal() {
		for( var i = 0;i<localStorage.length;i++) {
			var key = localStorage.key(i);
			var p = document.createElement('p');
			boxSave.appendChild(p);
			p.innerHTML = localStorage.getItem(key);
		}
	}

	this.newTask = function(event) {
		var where = document.querySelector('.boxSave'+self.element);
		self.getNumDay(event,self.daySelect)
			.then(function(day) {
			var data = ''+self.element+self.year+self.month+day;
			var textObj =  self.outputOllStorage(data);								  
			where.innerHTML = '';
			
			for(var key in textObj) {
				self.output(where,textObj[key]);
			}
				
			return day;									  
		}).then(function(day){
			if(self.daySelect === day) {
				var text = self.getText();
				if(text===null && text==='') {
					return;
				}
				
				self.output(where,text); 

				var data = ''+self.element+self.year+self.month+day;
				var objStorage= {}, num =where.childNodes.length ;
				objStorage[num] = text;	
				self.saveText(data,objStorage); 
				self.outputOllStorage(data);
			} else {
				self.daySelect = day;
				self.daySelect = self.setActive(self.daySelect);
			}
		});
	}
}

Calendar.prototype.clearText = function (where){
	where.innerHTML = '';
	return 0;
}

Calendar.prototype.output = function(where,text){

	var p = document.createElement('p');
	where.appendChild(p);
	p.innerHTML = text;
}

Calendar.prototype.saveText = function(where,text){
	var sObj;
	var storageText =JSON.parse(localStorage.getItem(where));
	if(!storageText)
		{
		storageText = text;
		}else {
			Object.assign(storageText,text);
		}
	
	var sObj = JSON.stringify(storageText);
	localStorage.setItem(where,sObj);

}

Calendar.prototype.outputOllStorage = function(where) {
	return JSON.parse(localStorage.getItem(where));
}

Calendar.prototype.getText = function() {
	return prompt('Введите задачу');
}

Calendar.prototype.drawInteractiveCalendar = function() {
	var el = document.createElement('div');
	el.id = 'interactiveCalendar'+this.element;
	document.querySelector('#calendar').appendChild(el);

	var buttonLeft = document.createElement('button');
	buttonLeft.innerHTML = '[<]';
	buttonLeft.className = 'buttonLeft';
	var data = document.createElement('span');
	data.className = 'data'+this.element;
	var buttonRight = document.createElement('button');
	buttonRight.innerHTML = '[>]';
	buttonRight.className = 'buttonRight';
	var divButton = document.createElement('div');
	divButton.className += 'divButton';
	divButton.className += ' divButton'+this.element;

	var boxSave = document.createElement('div');
	boxSave.className = 'boxSave'+this.element;
	var divCalendarMain =document.createElement('div');
	divCalendarMain.id = 'divCalendarMain'+this.element;
	divButton.appendChild(buttonLeft);
	divButton.appendChild(data);
	divButton.appendChild(buttonRight);
	el.appendChild(divButton);

	el.appendChild(divCalendarMain);
	el.appendChild(boxSave);
	data.innerHTML = this.year+' '+this.month;
}

Calendar.prototype.getDayNumber = function(date) { 
	var number = date.getDay();
	if(number === 0) {
		return number = 6;
	}
	else  return number - 1;
}




Calendar.prototype.drawCalendar = function() {
	document.querySelector('#divCalendarMain'+this.element).innerHTML ='';
	var now = new Date(this.year,this.month-1);
	var Calendar = '<table><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>св</th><tr>';
	for(var i=0;i<this.getDayNumber(now);i++) {
		Calendar+='<th></th>';
	}
	while(now.getMonth()===this.month-1) {
		Calendar += '<td>' + now.getDate() + '</td>';
		if (this.getDayNumber(now) % 6 === 0 && this.getDayNumber(now)!==0) {
			Calendar += '</tr><tr>';
		}
		now.setDate(now.getDate() + 1);
	}
	Calendar += '</tr></table>';

	document.querySelector('#divCalendarMain'+this.element).innerHTML=  Calendar;
	document.querySelector('.data'+this.element).innerHTML = this.year+' '+this.month;
	this.daySelect = this.setActive(this.daySelect);
}

Calendar.prototype.getNumDay = function(event,day) {
	return new Promise(function(resolve) {
		var target = event.target;
		if(target.tagName != 'TD') {
			resolve(NaN);
		}
		resolve(parseInt(target.innerHTML));

	});
}


Calendar.prototype.setActive = function(dayActive) {
	var day = dayActive;
	var td =	document.querySelectorAll('#divCalendarMain'+this.element+' td');
	if(day>td.length) {
		day = 1;
	}
	td.forEach(function(item,i,td) {
		if(item.className === 'activeDay') {
			item.removeAttribute('class');
		}
	});
	td.forEach(function(item,i,td) {
		if(parseInt(item.innerHTML) === day) {
			item.className = 'activeDay';
		}
	});
	return day;	
}

let calendar = new Calendar(2017,12);
calendar.drawInteractiveCalendar();
calendar.drawCalendar();
document.querySelector('.divButton'+calendar.element).addEventListener('click',calendar.clickChangeCalendar);
document.querySelector('#divCalendarMain'+calendar.element).addEventListener('click',calendar.newTask);


























