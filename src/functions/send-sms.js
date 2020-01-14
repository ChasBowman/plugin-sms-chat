/*
    Simple utility function to send and SMS message
    
    Inputs:
    toNumber ==>  phone number of recipient
    message ==> content of the SMS message
    
    URL:
    https://liver-ibis-5420.twil.io/util-send-sms?toNumber=13035706579&message=This is the message
    
    ACCESS CONTROL: Uncheck valid Twilio signature
    UPDATE: set fromNumber to the correct Twilio Number.
*/
exports.handler = function(context, event, callback) {
    
    const client = context.getTwilioClient();
    let toNumber = event.toNumber;
    let fromNumber = '+12056288673';
    
    //  perform error checking on toNumber
    toNumber = toNumber.trim();
    let pos = toNumber.indexOf("+");
    
    if (toNumber.indexOf('+') == -1) {
      toNumber = '+' + toNumber
    }    
    console.log('toNum: ' + toNumber);

    let msg = event.message;
    console.log('msg: ' + msg);
    
    let response = new Twilio.Response();
      let headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
    
    response.setHeaders(headers);    
    console.log('to: ' + toNumber + '  fromNumber:' + fromNumber +  '  msg: ' + msg);
    
    result = {};
    
    client.messages
      .create({
         body: msg,
         from: fromNumber,
         to: toNumber
       })
      .then(function(message) {
          console.log(message.sid);
          result = {"sid": message.sid};
            
            result = {"success" : "true", "data" : result}
            response.setBody(result);
            callback(null, response);          
          
          //callback(null, result);
      });

};