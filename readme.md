#  Azure IoT Device/Thing Simulator 

This is a simple python application that works like an IoT device. The application sends random humidity and temperature values to Azure IoT Hub.

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
    "temperature": 27.937375275559177,
    "humidity": 75.3400124847644
  }
  ```


## Configuration

Application requires config/config.yaml file that should have the following attributes:

```yaml
device:
  guid: <GUIDofTheDevice>
  name: <NameOfTheDevice>  # Can be different than the Azure IoT Device
  connectionString: <ConnectionString> # Azure IoT Hub Device Connection string
  locationId: <LocationId>  # You might want to know where your device is located
  sleepInSeconds: 20  # Message is sent to IoT Hub every sleepInSeconds

  sensors:
    - name: <SensorName1> # ex: temperature
      valueType: float    # float, int or bool
      minValue: -40
      maxValue: 100

    - name: <SensorName2> # ex: motion
      valueType : bool    # float, int or bool
      minValue : 0        # any value if valueType is bool
      maxValue : 0        # any value if valueType is bool


  # List of alerts. 
  # For example, add an alert to the message if temperature is greater than 35 
  alerts:   
    - sensorName: temperature  # name of the attribure. temeperature or humidity
      name: HighTemperature   # alert name. This will be added to the message sent to IoT hub
      value: 35               # threshold value
      operand : greater       # greater, smaller or equal. Used to compare actual value with threshold value

    - sensorName: temperature
      name: LowTemperature
      value: -15
      operand: smaller 

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
docker run -it -v ~/appconfigs/az-iot-device-simulator:/app/config oyesil/az-iot-device-simulator:0.2 
```







