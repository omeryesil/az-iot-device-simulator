import random
import time 
import json 
from azure.iot.device import IoTHubDeviceClient, Message 

CONNECTION_STRING = "HostName=awapi.azure-devices.net;DeviceId=myTestDevice;SharedAccessKey=krS80O2ajiYC3lamRq5klbR9Zu4SCiqaQf/pI1UD3Qk="

TEMPERATURE = 20.0
HUMIDITY = 60 
MSG_TXT = '{{"temperature": {temperature},"humidity": {humidity}}}'

def iothub_client_init():
  client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)
  
  return client 

def iothub_client_telemetry_sample_run() :
  try :
    client = iothub_client_init()
    print ("Sending periodic messages, CTRL+C to exit")

    while True:
      temperature = TEMPERATURE + (random.random() * 15)
      humidity    = HUMIDITY + (random.random() * 20)

      msg_text_formatted = MSG_TXT.format(temperature = temperature, humidity = humidity)
      message = Message(msg_text_formatted)

      # custom application prop
      # an IoT hub can filter on these properties without accesss to the message body 
      if temperature > 30:
        message.custom_properties["temperatureAlert"] = "true"
      else:
        message.custom_properties["temperatureAlert"] = "false"

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
