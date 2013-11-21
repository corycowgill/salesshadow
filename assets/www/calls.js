var CallLog =
{
   list : function(params, successCallback, failureCallback) {
	return cordova.exec(successCallback, failureCallback, 'CallListPlugin', 'list',
			[ params ]);
   }
 /*
   contact : function(params, successCallback, failureCallback) {
	return cordova.exec(successCallback, failureCallback, 'CallListPlugin', 'contact',
			[ params ]);
   }

   show : function(params, successCallback, failureCallback) {
	return cordova.exec(successCallback, failureCallback, 'CallListPlugin', 'show',
			[ params ]);
   }*/
}