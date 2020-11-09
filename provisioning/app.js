// This code provisions an IoT device on Azure IoT Hub 
// It supports both symmetric key and x509 authentication 


//Sample call for x509
// node server.js --authtype=x509 --host=global.azure-devices-provisioning.net idscope=123 registrationid=deviceId devicecertfile=/certs/mydevicecert.crt devicecertkey=/certs/mydevicecert.key 

//Sample call for symmetric key
// node server.js --authtype=smykey --host=global.azure-devices-provisioning.net idscope=123 registrationid=deviceId symmeytickey=2342342sdfd

var args = require('yargs/yargs')(process.argv.slice(2)).argv;

if (args.authtype == undefined) {
  throwError('--authtype must be defined (x509 or symkey)');
}

switch(args.authtype.toLowerCase()) {
  case 'x509' :
    console.log("Auth type is x509");
    break;
  case 'symkey':
    console.log("Auth type is symmetric key");
    break;
  default:
    throwError('--authtype is not recognized, it must be x509 or symkey)'); 
}


function throwError(msg) {
  console.log("ERORR: " + msg);
  process.exit(1);
}


