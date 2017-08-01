const fcmconfig = require('../config/fcm'); 
var admin = require("firebase-admin");

var serviceAccount = require('../config/serviceAcount.json');

var messaging

module.exports.init = function(){
    
 admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: fcmconfig.databaseURL,
    });

    messaging = admin.messaging();

}

module.exports.sendServerStart = function(){
    
    var payload = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        notification: {
            title: 'Solair',  
            body: 'Server is running.',
            icon: 'images/icon.png',
        },    
    };

    messaging.sendToTopic('/topics/dev',payload)
    .then(function(response) {
        // See the MessagingTopicResponse reference documentation for the
        // contents of response.
        console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
    });
}

module.exports.sendNotifById = function(token_list,payload){
    if ( token_list == null || token_list.length == 0 ) return;
    messaging.sendToDevice(token_list,payload)
}