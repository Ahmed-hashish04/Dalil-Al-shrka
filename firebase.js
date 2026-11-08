// إعدادات Firebase الخاصة بمشروعك
const firebaseConfig = {
    apiKey: "AIzaSyCH8mX-zWybG0H4siDT-knMbcPB8kWM0hQ",
    authDomain: "talagat-app.firebaseapp.com",
    projectId: "talagat-app",
    storageBucket: "talagat-app.firebasestorage.app",
    messagingSenderId: "114526686249",
    appId: "1:114526686249:web:dcb5d8e19c85fb1d82e038"
  };
  
  // تشغيل Firebase
  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }
  
  // تعريف الداتابيز والدخول
  const db = firebase.firestore();
  const auth = firebase.auth();