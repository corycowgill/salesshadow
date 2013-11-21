//Sample code for Hybrid REST Explorer

function setup() 
{
    var $j = jQuery.noConflict();
    var logToConsole = cordova.require("salesforce/util/logger").logToConsole;
    //queryTasks();
    //queryEvents(); 
    //queryAccounts();
    //queryContacts();
    //queryOpportunities();
}

function queryTasks()
{
	forcetkClient.query("Select Id, Subject, ActivityDate, Description,Account.Name, WhoId, WhatId, Who.Name, What.Name from Task where AccountId != null and WhoId != null limit 100",onSuccessTaskQuery, onErrorTaskQuery);
}

function onSuccessTaskQuery(response)
{
	$j("#tasks_content").html("");
	var ul = $j('<ul data-role="listview" data-inset="true" data-theme="a" data-dividertheme="a"></ul>');
	$j.each(response.records, function(i, record){
		var taskItem = "<li><a id='caseIdLink_" + record.What.Name + "' onclick='javascript:' href='#service-case-details' data-transition='slide'>" + record.ActivityDate + "<br/>Subject: " + record.Subject + "<br/>Account: " + record.Account.Name + "</br>Contact: " + record.Who.Name + "</a></li>";
		ul.append(taskItem);
	});
	$j("#tasks_content").append(ul);
	$j("#tasks_content").trigger("create");
}

function onErrorTaskQuery(response)
{
	alert(JSON.stringify(response));
}

function queryEvents()
{
	forcetkClient.query("Select Id, Location, Subject, ActivityDate, Description, Account.Name, WhoId, WhatId, Who.Name, What.Name from Event where AccountID != null and WhoID != null limit 100",onSuccessEventQuery, onErrorEventQuery);
}

function onErrorEventQuery(response)
{
	alert(JSON.stringify(response));
}

function onSuccessEventQuery(response)
{
	$j("#events_content").html("");
	var ul = $j('<ul data-role="listview" data-inset="true" data-theme="d" data-dividertheme="d"></ul>');
	$j.each(response.records, function(i, record){
		var taskItem = "<li>" + record.ActivityDate + "<br/>Subject: " + record.Subject + "<br/>Account: " + record.Account.Name + "</br>Contact: " + record.Who.Name + "</li>";
		ul.append(taskItem);
	});
	$j("#events_content").append(ul);
	$j("#events_content").trigger("create");	
}

function queryAccounts()
{
	forcetkClient.query("Select Id, Name from Account limit 100",onSuccessAccountQuery, onErrorAccountQuery);
}

function onSuccessAccountQuery(response)
{
	$j("#accounts_content").html("");
	var ul = $j('<ul data-role="listview" data-inset="true" data-theme="d" data-dividertheme="d"></ul>');
	$j.each(response.records, function(i, record){
		var acctItem = "<li>Name: " + record.Name + "</li>";
		ul.append(acctItem);
	});
	$j("#accounts_content").append(ul);
	$j("#accounts_content").trigger("create");	
}

function onErrorAccountQuery(response)
{
	alert(JSON.stringify(response));
}

function queryOpportunities()
{
	forcetkClient.query("Select Id, Name, Amount, StageName, AccountId, Account.Name, CloseDate from Opportunity limit 100",onSuccessOpportunityQuery, onErrorOpportunityQuery);
}

function onSuccessOpportunityQuery(response)
{
	$j("#opportunities_content").html("");
	var ul = $j('<ul data-role="listview" data-inset="true" data-theme="d" data-dividertheme="d"></ul>');
	$j.each(response.records, function(i, record){
		var acctItem = "<li>Name: " + record.Name + "<br/>Stage: " + record.StageName + "<br>CloseDate: " + record.CloseDate + "<br/>Amount" + record.Amount + "</li>";
		ul.append(acctItem);
	});
	$j("#opportunities_content").append(ul);
	$j("#opportunities_content").trigger("create");	
}

function onErrorOpportunityQuery(response)
{
	alert(JSON.stringify(response));
}

function queryContacts()
{
	forcetkClient.query("Select Id, Name, Phone, MobilePhone, Email, AccountId, Account.Name from Contact where AccountId != null limit 100",onSuccessContactQuery, onErrorContactQuery);
}

function onSuccessContactQuery(response)
{
	$j("#contacts_content").html("");
	var ul = $j('<ul data-role="listview" data-inset="true" data-theme="d" data-dividertheme="d"></ul>');
	$j.each(response.records, function(i, record){
		var acctItem = "<li>Name: " + record.Name + "<br/>Account: " + record.Account.Name +"<br/>Phone: " + record.Phone + "<br/>Mobile: " + record.MobilePhone + "</li>";
		ul.append(acctItem);
	});
	$j("#contacts_content").append(ul);
	$j("#contacts_content").trigger("create");	
}

function onErrorContactQuery(response)
{
	alert(JSON.stringify(response));
}



function getCalenderEvents()
{
	var later = new Date();
	//later.setDate(later.getDate() + 1); // 1 days from now
	
	Calendar.findEvents(successCalendars, errorCalendars, {
		  'startAfter': new Date().getTime(),
		  'startBefore': later.getTime()
		})
}

function successCalendars(response)
{
	//alert(JSON.stringify(response));
	var breakLoop = false;
	for (var key in response)
	{
	      // here you have access to
	     
		  var summary = response[key].summary;
	      var startDate = response[key].start;
	      var endDate = response[key].end;
	      var attendees = response[key].Xattendees;
	      var emails = '';
	      for(var attendee in attendees)
	      {
	    		  var email = attendees[attendee].email;
	    		  emails = emails + "'" + email + "',";
	    		  var name = attendees[attendee].name;
	      }
	      //alert(emails);
	      if(emails != null && emails.length > 2)
	      {
	    	  emails = emails.substring(0,emails.length - 1);
	    	  //alert(emails);
	    	  //if(!breakLoop)
	    	  //{	  
	    		breakLoop = true;
	    	  	forcetkClient.query("Select Id, Name, Phone, MobilePhone, Email, AccountId, Account.Name from Contact where AccountId != null and (Email in ("+ emails +")) limit 100", onSuccessContactCalendarAnlysisQuery, onErrorContactCalendarAnlysisQuery); 
	      
	    	  //}
	      }
	      
	}
}

function errorCalendars(response)
{
	alert(JSON.stringify(response));
}

function getCallLogs()
{
	CallLog.list('all', successCallBack, failCallBack);
}

function successCallBack(response)
{
	alert(JSON.stringify(response));
}

function failCallBack(response)
{
	alert(JSON.stringify(response));
}

function getGPSLocation()
{
	navigator.geolocation.getCurrentPosition(processLocationSuccess, processLocationError);
}

function processLocationSuccess(response)
{
	//alert(JSON.stringify(response));
	//alert(JSON.stringify(response));
	onGeolocationQuery(response);
}

function processLocationError(response)
{
	alert(JSON.stringify(response));
}

function resetRefreshButtonHome()
{
	$j("#refreshButtonHome").removeClass("ui-btn-active");
}

function resetRefreshButtonFeed()
{
	$j("#refreshButtonFeed").removeClass("ui-btn-active");
}


