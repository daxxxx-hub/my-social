/* My Social: background FCM notification handler. GitHub Pages must host this at /my-social/firebase-messaging-sw.js */
/* Only Firebase's public web configuration belongs here. NEVER put server/service-account secrets in this file. */
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=self.registration.scope;
  event.waitUntil((async()=>{
    const windows=await clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of windows){
      if(client.url.startsWith(target)){
        if('focus' in client)return client.focus();
      }
    }
    if(clients.openWindow)return clients.openWindow(target);
  })());
});

importScripts('https://www.gstatic.com/firebasejs/13.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/13.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDoXBu86nx1hQBYEzapMZdJm3XXckGPEs8',
  authDomain: 'my-social-11308.firebaseapp.com',
  projectId: 'my-social-11308',
  messagingSenderId: '581747567782',
  appId: '1:581747567782:web:325dcbc4d3c791bfd01867'
});

const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{
  const d=payload && payload.data || {};
  const kind=d.kind==='call'?'call':'message';
  const title=kind==='call'?'📞 Incoming My Social call':'💬 My Social private message';
  const body=kind==='call'?'Tap to open My Social and answer if the call is still active.':'Open My Social to read your new message.';
  return self.registration.showNotification(title,{
    body,
    tag:'my-social-'+kind+'-'+String(d.eventId||''),
    renotify:kind==='call',
    requireInteraction:kind==='call',
    data:{url:self.registration.scope},
    vibrate:kind==='call'?[200,100,200,100,200]:[180]
  });
});
