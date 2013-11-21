var callsList;
var contactsCallList;

function totalRefresh()
{
	evaluateCallsForTasks();
	getGPSLocation();
	evaluateCalendarForEvents();
}

function evaluateCallsForTasks()
{
	//evaluateCallsForTasks();
	CallLog.list('all', successCallAnalysis, failCallAnalysisBack);
}

function successCallAnalysis(response)
{
	var phoneSearch = "";
	//alert(JSON.stringify(response));
	$j.each(response.rows, function(i,record){
		if(record.number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") != '')
		{
			phoneSearch = phoneSearch + "'" + record.number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") + "',";
	}
	});
	//alert(phoneSearch);
	if(phoneSearch != "" && phoneSearch.length > 0)
	{
		phoneSearch = phoneSearch.substring(0,phoneSearch.length - 1);
	}
	//alert(phoneSearch);
	//alert("Select Id, Name, Phone, MobilePhone, Email, AccountId, Account.Name from Contact where AccountId != null and (Phone in (" + phoneSearch + ") or MobilePhone in (" + phoneSearch + ")) limit 100)");
	forcetkClient.query("Select Id, Name, Phone, MobilePhone, Email, AccountId, Account.Name from Contact where AccountId != null and (Phone in (" + phoneSearch + ") or MobilePhone in (" + phoneSearch + ")) limit 100", onSuccessContactAnlysisQuery, onErrorContactAnlysisQuery);
}

function failCallAnalysisBack(response)
{
	alert(JSON.stringify(response));
}

function onSuccessContactAnlysisQuery(response)
{
	//alert(JSON.stringify(response));
	$j("#feed_content_tasks").html("");
	
	var ul = $j("<div class='item'>");
	$j.each(response.records, function(i, record){
		//alert("#clid" + record.Id);
		var taskItem = "<div class='radialContent' id='clid" + record.Id + "'><div class='customParent'><div class='customLeftPanel'><img  src='images/ic_action_call.png'/></div><div style='margin-bottom: 0px; padding-bottom: 0px;'><h3>Call Activity Today</h3><p>" + record.Name + " from " + record.Account.Name + ".</p><p>Automatically log this task in Salesforce?</p><div><div style='float:left;'><a href='#feed' style='text-decoration: none;' onclick=\"createCallTask('" + record.Id + "')\"><img src='images/ic_action_accept.png'/></a></div><div style='float:right; padding-top:0px; margin-top:0px;'><a style='text-decoration: none;' href='#feed' onclick=\"cancelCallTask('" + record.Id + "')\"><img src='images/ic_action_cancel.png'/></a></div><div style='clear:both'></div></div></div></div></div>";
		ul.append(taskItem);
	}); ul.append("<div style='clear:both'></div></div>");
	$j("#feed_content_tasks").append(ul);
	$j("#feed_content_tasks").trigger("refresh");
}

function onErrorContactAnlysisQuery(response)
{
	alert(JSON.stringify(response));
}

function cancelCallTask(elementId)
{
	$j("#clid" + elementId).fadeOut(700, function() { $j("#clid" + elementId).remove(); });
}

function createSMSTask(contactId)
{
	//alert("Create Task");
	var callTask = {};
	callTask.Subject = 'SMS Conversation';
	callTask.Description = 'SMS Logged from Sales Shadow!';
	callTask.WhoId = contactId;
	forcetkClient.create("Task",callTask,successCallTaskCreate,errorCallTaskCreate);
	$j("#smsid" + contactId).fadeOut(800, function() { $j("#smsid" + contactId).remove(); });
}

function createCallTask(contactId)
{
	//alert("Create Task");
	var callTask = {};
	callTask.Subject = 'Phone Call';
	callTask.Description = 'Call Logged from Sales Shadow!';
	callTask.WhoId = contactId;
	forcetkClient.create("Task",callTask,successCallTaskCreate,errorCallTaskCreate);
	$j("#clid" + contactId).fadeOut(800, function() { $j("#clid" + contactId).remove(); });
}

function createOnsiteVisitTask(contactId)
{
	//alert("Create Task");
	var visitTask = {};
	visitTask.Subject = 'On-Site Visit';
	visitTask.Description = 'Visit Logged from Sales Shadow!';
	visitTask.WhatId = contactId;
	forcetkClient.create("Task",visitTask,successOnsiteVisitCreate,errorOnsiteVisitTaskCreate);
	$j("#nbid" + contactId).fadeOut(800, function() { $j("#nbid" + contactId).remove(); });
}

function successOnsiteVisitCreate(response)
{
}

function errorOnsiteVisitTaskCreate(response)
{
	alert(JSON.stringify(response));
}

function successCallTaskCreate(response)
{
	//alert("#clid" + response.id);
	//$j("#clid" + response.id).fadeOut(700, function() { $j("#clid" + response.id).remove(); });
	//alert(JSON.stringify(response));
}

function errorCallTaskCreate(response)
{
	alert(JSON.stringify(response));
}

function evaluateCalendarForEvents()
{
	var startDate = new Date();
	startDate.setHours(0);
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);
	//alert(startDate.toString());
	var later = new Date();
	later.setHours(23);
	later.setMinutes(0);
	later.setSeconds(0);
	later.setMilliseconds(0);
	startDate.setHours(1);
	//alert(later.toString());
	//alert('startAfter: ' + startDate.getTime());
	//alert('startBefore: ' + later.getTime());
	
	Calendar.findEvents(successCalendarsAnalysis, errorCalendarsAnalysis, {
		  'startAfter': startDate.getTime(),
		  'startBefore': later.getTime()
		})
}

function cancelEventCreate(elementId)
{
	$j("#evtid" + elementId).fadeOut(700, function() { $j("#evtid" + elementId).remove(); });
}


var calendarResponse;
var selectedCalendarItem; //AGAIN, HACKING THE HELL OUT OF THIS...... :)

function successCalendarsAnalysis(response)
{
	calendarResponse = response; //HACK THIS! LOL..... SHORTCUTS EVERYWHERE!!!!!!!!
	//alert(response.length);
	//alert(JSON.stringify(response));
	var breakLoop = false;
	var ul = $j("<div class='item'>");
	for (var key in response)
	{
		var eventItem = "<div id='evtid" + response[key].id + "' style='clear:both' class='radialContent'><div class='customParent' style='clear:both;'><div class='customLeftPanel' style='clear:both;'><img  src='images/ic_action_event.png'/></div><div><h3>Meeting Today</h3><p>Summary: " + response[key].summary + "</p><p>Time: " + response[key].start + "<p>Automatically log this event in Salesforce?</p><div style='clear:both;'><div style='float:left;'><p><a href='#feed' onclick=\"createSFDCEvent('" + response[key].id + "')\"><img src='images/ic_action_accept.png'/></a></div><div style='float:right;'><a href='#feed' onclick=\"cancelEventCreate('" + response[key].id + "')\"><img src='images/ic_action_cancel.png'/></a></div><div style='clear:both'></div></div></div></div>";
		ul.append(eventItem);
		$j("#feed_content_events").append(ul);
		$j().append("<div style='clear:both'></div></div>");
		$j("#feed_content_events").trigger("refresh");
		  //alert(JSON.stringify(response));
	      // here you have access t
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
	    	  //calendarVar.summary = summary;
	    	  //calendarVar.startDate = startDate;
	    	  //calendarVar.endDate = endDate;
	    	  emails = emails.substring(0,emails.length - 1);
	    	  //alert(emails);
	    	  //if(!breakLoop)
	    	  //{
	    		  //breakLoop = true;
	    		  //forcetkClient.query("Select Id, Name, Phone, MobilePhone, Email, AccountId, Account.Name from Contact where AccountId != null and (Email in ("+ emails +")) limit 100", onSuccessContactCalendarAnlysisQuery, onErrorContactCalendarAnlysisQuery); 
	    	  //}
	       }      
	}
	$j("#feed_content_events").append(ul);
	$j("#feed_content_events").trigger("refresh");
} 

function createSFDCEvent(response)
{
	alert("Event KEY " + response);
}

function errorCalendarsAnalysis(response)
{
	alert(JSON.stringify(response));
}

function onSuccessContactCalendarAnlysisQuery(response)
{
	//$j("#feed_content_events").html("");
	var ul = $j("<div class='item'>");
	$j.each(response.records, function(i, record){
	});	
	var eventItem = "<li><p>You had a meeting today about '" + calendarVar.summary + "' at " + calendarVar.startDate + ". Automatically log this task in Salesforce?</p><a href='#feed'>Yes</a> or <a href=''>No</a></li>";
	ul.append(eventItem);
	ul.append("<div style='clear:both'></div></div>");
	$j("#feed_content_events").append(ul);
	$j("#feed_content_events").trigger("refresh");
	//alert(JSON.stringify(response));
	//alert(JSON.stringify(calendarVar));
}

function onErrorContactCalendarAnlysisQuery(response)
{
	alert(JSON.stringify(response));
}

function onGeolocationQuery(currentLocation)
{
	forcetkClient.query("Select Id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, Location__latitude__s, Location__longitude__s, (Select Id, Name, Amount from Opportunities) from Account WHERE DISTANCE(Location__c, GEOLOCATION(" + currentLocation.coords.latitude +  "," +  currentLocation.coords.longitude + "), 'mi') < 1 limit 10", onSuccessLocationQuery, onErrorLocationQuery);
}
var queryResponse;
function onSuccessLocationQuery(response)
{
	queryResponse = response;
	$j("#feed_content_nearby").html("");
	
	var ul = $j("<div class='item'>");
	$j.each(response.records, function(i, record){
		var taskItem = "<div class='radialContent' id='nbid" + record.Id + "'><div class='customParent'><div class='customLeftPanel'><img  src='images/ic_action_location_found.png'/></div><div><h3>On-Site Visit Today</h3><p>" + record.Name + "</p><p>" + record.BillingStreet + "<br/>" + record.BillingCity + " " + record.BillingState + record.BillingPostalCode + "</p><p>Do you want log a visit to this account?</p><div><div style='float:left;'><a href='#feed' onclick=\"createOnsiteVisitTask('" + record.Id + "')\"><img src='images/ic_action_accept.png'/></a></div><div style='float:right;'><a href='#feed' onclick=\"cancelNearbyItem('" + record.Id + "')\"><img src='images/ic_action_cancel.png'/></a></div><div style='clear:both'></div></div></div></div></div>";
		ul.append(taskItem);
		//alert(record.Id); AAW
	});	ul.append("<div style='clear:both'></div></div>");
	$j("#feed_content_nearby").append(ul);
	//$j("#feed_content_nearby").trigger("refresh");
	//Build the Maps
	//alert('HERE1');
	//$j.each(response.records, function(i, record){
		//alert($j('#map' + record.Id).html());
		//var yourStartLatLng = new google.maps.LatLng(59.3426606750, 18.0736160278);
	    //var theMap = $j('#map' + record.Id).gmap({'center': yourStartLatLng});
	    //google.maps.event.trigger(theMap, "resize");
	    //alert($j('#map' + record.Id).html());
	//});
	//var yourStartLatLng = new google.maps.LatLng(59.3426606750, 18.0736160278);
	
	//$j("#feed_content_nearby").trigger("refresh");
	//$j.each(response.records, function(i, record){
	  //  $j('#map' + record.Id).gmap("refresh");
	    //alert('REFERSH');
	    //alert($j('#map' + record.Id).html());
	//});
	$j("#feed_content_nearby").trigger("refresh");
}

function onErrorLocationQuery(response)
{
	alert(JSON.stringify(response));
}

function cancelNearbyItem(elementId)
{
	$j("#nbid" + elementId).fadeOut(700, function() { $j("#" + elementId).remove(); });
}

function cancelSMSItem(elementId)
{
	$j("#smsid" + elementId).fadeOut(700, function() { $j("#" + elementId).remove(); });
}

var currentSMS;
function receiveSMSSuccess(response)
{
	var message = response.split(">",2);
	message[0] = message[0].replace("+1","");
	var phoneSearch = "'" + message[0].replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") + "'";
	forcetkClient.query("Select Id, Name, Phone, MobilePhone, Email, AccountId, Account.Name from Contact where AccountId != null and (Phone in (" + phoneSearch + ") or MobilePhone in (" + phoneSearch + ")) limit 100", receiveSMSContactSuccess, receiveSMSFail);
}

function receiveSMSFail(response)
{
	alert(JSON.stringify(response));
}

function receiveSMSContactSuccess(response)
{
	$j("#feed_content_sms").html("");
	var ul = $j("<div class='item'>");
	$j.each(response.records, function(i, record){
		//alert("#clid" + record.Id);
		var taskItem = "<div class='radialContent' id='smsid" + record.Id + "'><div class='customParent'><div class='customLeftPanel'><img  src='images/ic_action_email.png'/></div><div><h3>SMS Activity Today</h3><p>" + record.Name + " at " + record.Account.Name + "</p><p>Automatically log this task in Salesforce?</p><div><div style='float:left;'><a href='#feed' onclick=\"createSMSTask('" + record.Id + "')\"><img src='images/ic_action_accept.png'/></a></div><div style='float:right;'><a href='#feed' onclick=\"cancelSMSItem('" + record.Id + "')\"><img src='images/ic_action_cancel.png'/></a></div><div style='clear:both'></div></div></div></div></div>";
		ul.append(taskItem);
	});	ul.append("<div style='clear:both'></div></div>");
	$j("#feed_content_sms").append(ul);
	$j("#feed_content_sms").trigger("refresh");	
}



