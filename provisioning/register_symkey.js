// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var iotHubTransport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var CryptoUtils = require('./cryptoUtils.js');

// var ProvisioningTransport = require('azure-iot-provisioning-device-http').Http;
// var ProvisioningTransport = require('azure-iot-provisioning-device-amqp').Amqp;
// var ProvisioningTransport = require('azure-iot-provisioning-device-amqp').AmqpWs;
var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
// var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').MqttWs;
// Feel free to change the preceding using statement to anyone of the following if you would like to try another protocol.

module.exports = {
  registerBySymKey : function (host, idScope, registrationId, enrolmentType, symmetricKey) {
    var SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
    var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;

    // if we are using group enrolment, then we have to create a symmetric key for each device which is 
    // derived by the registrationId and the DPS's symmetric key
    if (enrolmentType.toLowerCase() == 'group') {
      symmetricKey = CryptoUtils.createSignature(symmetricKey, registrationId);
    }

    var provisioningSecurityClient = new SymmetricKeySecurityClient(registrationId, symmetricKey);
    var provisioningClient = ProvisioningDeviceClient.create(host, idScope, new ProvisioningTransport(), provisioningSecurityClient);

    // Register the device.
    provisioningClient.setProvisioningPayload({ a: 'b' });

    provisioningClient.register(function (err, result) {
      if (err) {
        console.log("error registering device: " + err);
      } else {
        console.log('registration succeeded');
        console.log('assigned hub=' + result.assignedHub);
        console.log('deviceId=' + result.deviceId);
        console.log('payload=' + JSON.stringify(result.payload));
        var connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + symmetricKey;
        var hubClient = Client.fromConnectionString(connectionString, iotHubTransport);

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
      }
    });
  }
}

