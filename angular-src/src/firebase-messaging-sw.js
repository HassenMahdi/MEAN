importScripts("https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js");

var config = {
    apiKey: "AIzaSyDn1jmmwsb6xwVqr3C3Kp-U-RfB1HeYpIM",
    authDomain: "notify-f2264.firebaseapp.com",
    databaseURL: "https://notify-f2264.firebaseio.com",
    projectId: "notify-f2264",
    storageBucket: "notify-f2264.appspot.com",
    messagingSenderId: "711253784982"
  };
firebase.initializeApp(config);

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  var data;
  var title;
  var options;

  try { 
        data = JSON.parse(event.data.text());
        title = data.notification.title;
        options = data.notification;

    } catch (e) {
        title = 'Solair';
        options = {
          body: 'Push.',
          //badge: 'images/badge.png'  
        };
    }

    options.icon = 'assets/firebase/images/icon.png';

  

  event.waitUntil(self.registration.showNotification(title ,options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://localhost:4200/dashboard')
  );
}); 