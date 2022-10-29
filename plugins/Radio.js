const fetch = require('node-fetch');
const task = require('../plugins/Task');
const nodemailer = require('nodemailer');
const FCM = require('fcm-node');
const transporter = nodemailer.createTransport({
	host: 'smtp.zoho.com',
	port: 465,
	secure: true, // use SSL
	auth: {
			user: "notification@aroxbit.com",
			pass: "EXAMPLE"
	}
});

async function textMessage(users, data, flow_id){

  console.log(global.keys.msg91_key);

  // for a single mobile number
  let bodyData = Object.assign({}, data);
  bodyData.flow_id = flow_id;
  bodyData.mobiles = users[0].phone;
  if(bodyData.mobiles < 12) bodyData.mobiles = '91'+bodyData.mobiles;

  // if the message is to be sent to multiple mobile numbers
  //if(users.length > 1){
    delete bodyData.mobiles;
    bodyData.recipients = [];
    for(let i=0; i<users.length; i++){
      let temp = Object.assign({}, data);
      if(users[i].phone.length < 12) users[i].phone='91'+users[i].phone;
      if(users[i].phone.length > 12) continue;
      temp.mobiles = users[i].phone;
      bodyData.recipients.push(temp);
    }
  //}

  if(global.debug && process.env.isHeroku != "true") {
    console.log(bodyData);
    return true;
  }

  let uri = 'http://api.msg91.com/api/v5/flow/';
  let options = {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {'Content-Type': 'application/json', 'authkey': global.keys.msg91_key}
  };

  const response = await fetch(uri, options);
  if(response.status == 200) return true;
  else return false;
}


async function pushNotification(notice){
  let Notifier = new FCM(global.keys.fcm_key);
  let notif = {notification: {title: notice.title, body: notice.body}};
  if(notice.image) notif.notification.image = notice.image;
  if(notice.data) notif.data = notice.data;
  if(notice.filter.token){
    // TODO: support multi-token and users
    notif.token = notice.filter.token;
    Notifier.send(notif, function(e, r){
      if(e) console.log(e);
      console.log(r);
    })
  }
  else{
    let topics = notice.filter.topics;
    for(let i =0; i<topics.length; i++){
      notif.to = '/topics/' + topics[i];
      Notifier.send(notif, function(e, r){
          if(e) console.log(e);
          console.log(r);
      });
    }
  }
}


async function sendEmail(){
	const mailoptions = {
		from: 'Aroxbit Notifications <notification@aroxbit.com>',
		to: data.to,
		subject: data.subject,
		html: data.html
	};

	const [err, info] = await task(transporter.sendMail(mailoptions));
	if(err) return true;
	else return false;
}

module.exports = {textMessage, sendEmail, pushNotification};