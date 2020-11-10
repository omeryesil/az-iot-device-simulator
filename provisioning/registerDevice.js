// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var iotHubTransport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;


// var Transport = require('azure-iot-provisioning-device-http').Http;
// var Transport = require('azure-iot-provisioning-device-amqp').Amqp;
// var Transport = require('azure-iot-provisioning-device-amqp').AmqpWs;
var Transport = require('azure-iot-provisioning-device-mqtt').Mqtt;
// var Transport = require('azure-iot-provisioning-device-mqtt').MqttWs;
// Feel free to change the preceding using statement to anyone of the following if you would like to try another protocol.

//Symmetric Key related packages
var SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
var CryptoUtils = require('./cryptoUtils.js');

//x509 related packages
var fs = require('fs');
var X509Security = require('azure-iot-security-x509').X509Security;


var RegistrationResult = new Object();

var createRegistrationResult = function () {
  var result = new Object();
  result.isSuccess = false;
  result.authType = '';
  result.iotHub = '';
  result.deviceId = '';
  result.payload = '';
  result.connectionString = '';

  return result;
}

module.exports = {
  // Register by SymmetricKey
  registerBySymKey: async function (dpsHost, idScope, registrationId, enrolmentType, symmetricKey) {
    return new Promise(function (resolve, reject) {
      RegistrationResult = createRegistrationResult();

      // if we are using group enrolment, then we have to create a symmetric key for each device which is 
      // derived by the registrationId and the DPS's symmetric key
      if (enrolmentType == 'group') {
        symmetricKey = CryptoUtils.createSignature(symmetricKey, registrationId);
      }

      var provisioningSecurityClient = new SymmetricKeySecurityClient(registrationId, symmetricKey);
      var provisioningClient = ProvisioningDeviceClient.create(dpsHost, idScope, new Transport(), provisioningSecurityClient);

      // Register the device.
      provisioningClient.setProvisioningPayload({ a: 'b' });

      provisioningClient.register(function (err, result) {
        if (err) {
          RegistrationResult.isSuccess = false;
          RegistrationResult.resultDetail = "error registering device: " + err;
          console.log(RegistrationResult.resultDetail);
          resolve(RegistrationResult);

        } else {
          RegistrationResult.isSuccess = true;
          RegistrationResult.authType = "symkey";
          RegistrationResult.iotHub = result.assignedHub;
          RegistrationResult.deviceId = result.deviceId;
          RegistrationResult.payload = result.payload;
          RegistrationResult.connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + symmetricKey;

          resolve(RegistrationResult);

          /*
           var hubClient = Client.fromConnectionString(RegistrationResult.connectionString, iotHubTransport);
  
          hubClient.open(function (err) {
            if (err) {
              console.error('Could not connect: ' + err.message);
            } else {
              console.log('Client connected');
              var message = new Message('Hello world');
              hubClient.sendEvent(message, function (err, res) {
                if (err) console.log('send error: ' + err.toString());
                if (res) console.log('send status: ' + res.constructor.name);
                process.exit(1);
              });
            }
          });
          */
        }
      });
    })
  },

  // Register by X509 Certificate -------------------------------------
  registerByX509: async function (dpsHost, idScope, registrationId, enrolmentType, certFile, certKey) {
    return new Promise(function (resolve, reject) {

      RegistrationResult = createRegistrationResult();

      var deviceCert = {
        cert: fs.readFileSync(certFile).toString(),
        key: fs.readFileSync(certKey).toString()
      };

      var transport = new Transport();
      var securityClient = new X509Security(registrationId, deviceCert);
      var deviceClient = ProvisioningDeviceClient.create(dpsHost, idScope, transport, securityClient);

      // Register the device.  Do not force a re-registration.
      deviceClient.register(function (err, result) {
        if (err) {
          RegistrationResult.isSuccess = false;
          RegistrationResult.resultDetail = "error registering device: " + err;
        } else {
          RegistrationResult.isSuccess = true;
          RegistrationResult.authType = "x509";
          RegistrationResult.iotHub = result.assignedHub;
          RegistrationResult.deviceId = result.deviceId;
          RegistrationResult.payload = result.payload;
          RegistrationResult.connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';x509=true';

          /* 
          var hubClient = Client.fromConnectionString(RegistrationResult.connectionString, iotHubTransport);
          hubClient.setOptions(deviceCert);
          hubClient.open(function (err) {
            if (err) {
              console.error('Failure opening iothub connection: ' + err.message);
            } else {
              console.log('Client connected');
              var message = new Message('Hello world');
              hubClient.sendEvent(message, function (err, res) {
                if (err) console.log('send error: ' + err.toString());
                if (res) console.log('send status: ' + res.constructor.name);
                process.exit(1);
              });
            }
          });
          */
        }
      });
    })
  }
}

