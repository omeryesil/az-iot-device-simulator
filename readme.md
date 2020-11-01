  #  Azure IoT Device/Thing Simulator 

This is a simple python application that sends configured sensor data to Azure IoT hub. Sensors can be configured through a configuration file (see the Configuration section)


## Sample Telemetry Message Sent to IoT Hub

```json
{
  "EnqueuedTimeUtc": "2019-10-23T01:42:52.6750000Z",
  "Properties": {
    "deviceGuid": "<GUIDofTheDevice>",
    "deviceName": "<NameOfTheDevice>",
    "locationId": "<locationId>"
  },
  "SystemProperties": {
    "connectionDeviceId": "<connectionDeviceId>",
    "connectionAuthMethod": "<connectionAuthMethod>",
    "connectionDeviceGenerationId": "<connectionDeviceGenerationId>",
    "enqueuedTime": "<enqueuedTime>"
  },
  "Body": "eyJ0ZW1wZXJhdHVyZSI6IDI3LjkzNzM3NTI3NTU1OTE3NywiaHVtaWRpdHkiOiA3NS4zNDAwMTI0ODQ3NjQ0fQ=="
}
```

- Body attribute is Base64 encoded. Sample decoded value: 
  ```json
  { 
    "temperature" : 55.06736631118647, 
    "humidity" : 83, 
    "motion" : "True"
  }
  ```


## Configuration

Application requires config/config.yaml. Sample:


**config.yaml**
```yaml
device:
  guid: 515f1ebe-7b8c-4815-bda6-b69ac23a1770
  name: sensorComboDevice001
  connectionString: "<AzureIoTHubDeviceConnectionString>"
  locationId: "<You might want to know where the device is located>"  
  sleepInSeconds: 20  # Send telemetry data every sleepInSeconds

  sensors:
    - name: temperature   # name of the sensor
      valueType: float    # can be: float, int or bool
      minValue: -40
      maxValue: 100

    - name: motion
      valueType : bool
      minValue : 0
      maxValue : 0 

  alerts:  
    - name: HighTemperature   # alert name. This will be added as a custom parameter to the telemetry message
      sensorName: temperature      
      value: 30
      operand : greater       # can be: greater, smaller, or equal

    - name: MotionDetected    # raise if motion sensor is true
      sensorName: motion
      value: 1                # if sensors's valueType is bool: 0 is false, 1 is true
      operand: equal

```

## Running the simulator 

<font color=#ff0000>**NOTE**</font> : Do not forget to kill the similator once you are done as it might impact the cost of your Azure IoT hub. I also recommend NOT to use lower values for sleepInSeconds in the configuration.

### Run with Command line

- Requires Python 3.

- Go to the src folder
  ```shell
  cd src
  ```

- Install required python packages:
  ```shell
  pip install -r requirements.txt
  ```

- Run the application
  ```shell
  python device.py
  ```
  

### Run With Docker

In the following sample call, in the host computer, the config.yaml file is located under /appconfigs/az-iot-device-simulator folder

```shell
docker run -it -v ~/appconfigs/az-iot-device-simulator:/app/config oyesil/az-iot-device-simulator:0.4
```

