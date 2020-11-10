// This code provisions an IoT device on Azure IoT Hub 
// It supports both symmetric key and x509 authentication 


//Sample call for x509
// node server.js --authtype=x509 --host=global.azure-devices-provisioning.net --idscope=123 --registrationid=deviceId --certfile=/certs/mydevicecert.crt --certkey=/certs/mydevicecert.key 

//Sample call for symmetric key
// node server.js --authtype=smykey --host=global.azure-devices-provisioning.net --idscope=123 --registrationid=abc1234 --enrolmentType=group --symmetrickey=2342342sdfd

var args = require('yargs/yargs')(process.argv.slice(2)).argv;
var registerDevice = require('./registerDevice.js');

const DEFAULT_HOST = 'global.azure-devices-provisioning.net'

if (args.authtype == undefined) {
  throwError('--authtype must be defined (x509 or symkey)');
}

var dpsHost = args.host;
if (args.host == undefined) {
  dpsHost = DEFAULT_HOST;
}

result = new Object();

async function app() {
  switch (args.authtype.toLowerCase()) {
    case 'x509':
      console.log("Auth type is x509");
      result = await registerDevice.registerByX509(dpsHost, idScope, registrationId, enrolmentType, args.certfile, args.certkey);
      break;

    case 'symkey':
      console.log("Auth type is symmetric key");

      result = await registerDevice.registerBySymKey(dpsHost, args.idscope, args.registrationid, args.enrolmenttype, args.symmetrickey);
      break;

    default:
      throwError('--authtype is not recognized, it must be x509 or symkey)');
  }

  console.log(result);

}

app();



function throwError(msg) {
  console.log("ERORR: " + msg);
  process.exit(1);
}


