'use strict'
const Org = require(__dirname + "/../models/Org");
const Payment = require(__dirname + "/../models/Payment");
const task = require(__dirname + "/../plugins/Task");
const Razorpay = require('razorpay')
const crypto = require("crypto");


// creates order for razorpay
async function createPayment(order){

    let rzp_options = {
        key_id: global.partner_tid,
        key_secret: global.partner_tsec
    }
    let rzp = new Razorpay(rzp_options);
    const[e, org] = await task(Org.findById(order.org));
    if(e) throw e;
    let acc_id = org.rzp_acc;

    // create order object from the plan id in razorpay db
    let amount = order.amount - order.payment;
    let newPayment = {account_id: acc_id, amount: (amount*100), receipt: order._id.toString(), currency: 'INR'};
    const[err, rzp_payment] = await task(rzp.orders.create(newPayment))
    if(err) throw err;
    
    // create payment object here in the backend
    newPayment.authorizer = rzp_payment.id;
    newPayment.type = 'online';
    newPayment.user = order.user;
    newPayment.patient = order.patient;
    newPayment.order = order._id.toString();
    newPayment.org = order.org;
    const[er, payment] = await task(Payment.create(newPayment))
    if(er) throw er;
    return payment;
}

// verifies order for razorpay
async function verifyPayment(paymentData){
    // if something is missing in payment data
    if(!paymentData.order_id || !paymentData.razorpay_payment_id || !paymentData.razorpay_signature)
    throw new Error("Please send complete payment data");
    
    // then check for the key with sha256 bit algorithm
    const hmac = crypto.createHmac('sha256', global.rzp_sec);
    hmac.update(paymentData.razorpay_order_id + "|" + paymentData.razorpay_payment_id);
    let generatedSignature = hmac.digest('hex');
    let valid = generatedSignature == paymentData.razorpay_signature;
    return valid;
}

module.exports = {createPayment, verifyPayment};