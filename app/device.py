import random
import time 
import json 
from deviceConfig import DeviceConfig
from azure.iot.device import IoTHubDeviceClient, Message 

from requests import get

conf = DeviceConfig('config/config.yaml')

# get external ip of the device
def GetExternalIp():
  ip = get('https://api.ipify.org').text
  return ip

ExternalIp = GetExternalIp()

def iotHubClientInit():
  client = IoTHubDeviceClient.create_from_connection_string(conf.ConnectionString)
  return client 

def sendMessageToCloud() :
  try :
    client = iotHubClientInit()
    print ("Sending periodic messages, CTRL+C to exit")

    while True:
      
      messageText = '{'
      for s in conf.Sensors:
        s.generateValue()
        if messageText != '{':
          messageText += ','
        if s.ValueType == "bool":
          messageText += ' "' + s.Name + '" : "' + s.CurrentValue + '"'
        else:
          messageText += ' "' + s.Name + '" : ' + s.CurrentValue
      messageText += '}'

      message = Message(messageText)

      # custom application prop
      message.custom_properties["deviceGuid"] = conf.GUID
      message.custom_properties["deviceName"] = conf.Name
      message.custom_properties["locationId"] = conf.LocationId
      message.custom_properties["externalIp"] = ExternalIp

      # an IoT hub can filter on these properties without accesss to the message body 
      for sensor in conf.Sensors:
        for alert in conf.Alerts:
          if sensor.Name == alert.SensorName:
            if sensor.ValueType == "bool":
              if alert.Operand.lower() == "equal" and bool(sensor.CurrentValue) == bool(alert.Value):
                message.custom_properties[alert.Name] = "true"
              continue

            sValue = float(sensor.CurrentValue)

            if alert.Operand.lower() == "greater" and sValue > alert.Value or \
               alert.Operand.lower() == "equal" and sValue == alert.Value or \
               alert.Operand.lower() == "smaller" and sValue < alert.Value:
              message.custom_properties[alert.Name] = "true"

      # send the message
      print("Sending: {}".format(message))
      client.send_message(message)
      print("Message sent")
      time.sleep(conf.SleepInSeconds)

  except KeyboardInterrupt:
    print("IoTHubClient sample stopped")


if __name__ == '__main__' : 
  print("IoT Hub Quickstart #1 - Simulated device")
  print("Press CTRL+C to exit")
  
  sendMessageToCloud()
