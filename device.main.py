import random
import time 
import json 
from deviceConfig import DeviceConfig
from azure.iot.device import IoTHubDeviceClient, Message 

conf = DeviceConfig('config.yaml')

TEMPERATURE = 20.0
HUMIDITY = 60 

SensorValues = {
  "temperature" : 20.0,
  "humidity" : 60
}



MSG_TXT = '{{"temperature": {temperature},"humidity": {humidity}}}'

def iothub_client_init():
  client = IoTHubDeviceClient.create_from_connection_string(conf.ConnectionString)
  return client 

def iothub_client_telemetry_sample_run() :
  try :
    client = iothub_client_init()
    print ("Sending periodic messages, CTRL+C to exit")

    while True:
      SensorValues["temperature"] = TEMPERATURE + (random.random() * 15)
      SensorValues["humidity"]    = HUMIDITY + (random.random() * 20)

      msg_text_formatted = MSG_TXT.format(temperature = SensorValues["temperature"], humidity = SensorValues["humidity"])
      message = Message(msg_text_formatted)

      # custom application prop
      message.custom_properties["deviceGuid"] = conf.GUID
      message.custom_properties["deviceName"] = conf.Name
      message.custom_properties["locationId"] = conf.LocationId

      # an IoT hub can filter on these properties without accesss to the message body 
      for sensor in SensorValues:
        for alert in conf.Alerts:
          print(alert.Attribute)
          if sensor == alert.Attribute:
            sValue = float(SensorValues[alert.Attribute])

            if alert.Operand.lower() == "greater" and sValue > alert.Value or \
               alert.Operand.lower() == "equal" and sValue == alert.Value or \
               alert.Operand.lower() == "smaller" and sValue < alert.Value:
              message.custom_properties[alert.Name] = "true" 
            else:
              message.custom_properties[alert.Name] = "false"

      # send the message
      print("Sending: {}".format(message))
      client.send_message(message)
      print("Message sent")
      time.sleep(20)

  except KeyboardInterrupt:
    print("IoTHubClient sample stopped")


if __name__ == '__main__' : 
  print("IoT Hub Quickstart #1 - Simulated device")
  print("Press CTRL+C to exit")
  
  iothub_client_telemetry_sample_run()
