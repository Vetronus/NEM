'use strict'
const Plan = require(__dirname + "/../models/Plan");
const Payment = require(__dirname + "/../models/Payment");
const task = require(__dirname + "/../plugins/Task");
const Razorpay = require('razorpay')
const crypto = require("crypto");
// TODO: work in progress

var transfers = [{
    account: "acc_HX9brO77EcdEWl",
    currency: 'INR',
    amount: 5*100,
}];


// creates order for razorpay
async function createPayment(amount, user_id){

    let rzp_options = {
        key_id: global.rzp_id,
        key_secret: global.rzp_sec
    }
    let rzp = new Razorpay(rzp_options);

    // create order object from the plan id in razorpay db
    transfers[0].amount = 5*100;
    if(amount>60) transfers[0].amount = ((amount/100)*7.5)*100;

    let recNum = user_id + '#' + (new Date().valueOf()).toString();
    let newPayment = {currency: 'INR', amount: (amount*100), receipt: recNum, transfers: transfers};
    const[err, rzp_payment] = await task(rzp.orders.create(newPayment))
    if(err) throw err;
    
    // create payment object here in the backend
    newPayment.plan = 'custom';
    newPayment.id = rzp_payment.id;
    newPayment.user = user_id;
    const[er, payment] = await task(Payment.create(newPayment))
    if(er) throw er;
    return payment;
}

// verifies order for razorpay
async function verifyPayment(paymentData){

    // if something is missing in payment data
    if(!paymentData.razorpay_order_id || !paymentData.razorpay_payment_id || !paymentData.razorpay_signature)
    throw new Error("Please send complete payment data");
    
    // then check for the key with sha256 bit algorithm
    const hmac = crypto.createHmac('sha256', global.rzp_sec);
    hmac.update(paymentData.razorpay_order_id + "|" + paymentData.razorpay_payment_id);
    let generatedSignature = hmac.digest('hex');
    let valid = generatedSignature == paymentData.razorpay_signature;
    return valid;
}

module.exports = {createPayment, verifyPayment};