importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAnulgPqKSI8Y_mMOTCof6joYscT4FLCXg",
  authDomain: "fcic-7f3c1.firebaseapp.com",
  projectId: "fcic-7f3c1",
  messagingSenderId: "91128961829",
  appId: "1:91128961829:web:815baae23a9b5eb3cbd8cc"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "fcic logo.png"
  });
});
