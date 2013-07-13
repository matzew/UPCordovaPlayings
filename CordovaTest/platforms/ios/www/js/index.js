// handle the incomming APNS notifications for iOS
function onNotificationAPN(e) {
  alert(e.alert); // display the push notification message... (extract the APNs alert key value....)
}

var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.report(), and not this.report()
        app.initAeroGearPush();
        app.report('deviceready');

    },
    report: function(id) { 
        console.log("report:" + id);
        // hide the .pending <p> and show the .complete <p>
        document.querySelector('#' + id + ' .pending').className += ' hide';
        var completeElem = document.querySelector('#' + id + ' .complete');
        completeElem.className = completeElem.className.split('hide').join('');
    },
	myTokenHandler: function(deviceToken) {
		// log the device token
		console.log(deviceToken);

		// create the unified push helper:
		var agUnifiedPush = AeroGear.UnifiedPushClient(
		  "a00e5512-a727-4882-9577-c6883c8e0623", // variantID
		  "3bcf69ea-65db-43a6-afad-c09619ec2b0c",  // secret
		  "http://192.168.0.100:8080/ag-push/rest/registry/device"
		);
		
		//hack:
		var tokenContainer = {};
		tokenContainer.channelID = deviceToken;
		
		// register with the UP server:
		agUnifiedPush.registerWithPushServer(
			"category", // the category
			tokenContainer,   // the token (hack :-) )
			"lalalalalaalal"  // alias
		);
	},
	myErrorHandler: function(error) {
		console.log(error);
	},
	initAeroGearPush: function() {
		// get the push plugin object
		var pushNotification = window.plugins.pushNotification;

		// set callbacks for dealing with the DeviceToken, or an Error
		pushNotification.register(
		  app.myTokenHandler, // set callback for dealing with the DeviceToken
		  app.myErrorHandler, // set callback when no deviceToken could be received (from APNs)
		  {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"} // allow badge,sound and alert APNs keys
		);
	}
};