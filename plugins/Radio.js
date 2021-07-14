const FCM = require('fcm-node');
let Notifier = new FCM(global.FCM_KEY);


function pushNotification(message){
   let notif = {notification: {title: message.title, body: message.body}};
   let topics = message.groups;
   for(let i =0; i<topics.length; i++){
      notif.to = '/topics/' + topics[i];
      Notifier.send(notif, function(e, r){
         if(e) console.log(e);
         console.log(r);
      });
   }
}

module.exports.pushNotification = pushNotification;