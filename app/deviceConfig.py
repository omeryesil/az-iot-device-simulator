import yaml
from deviceAlert import Alert 
from deviceSensor import Sensor 


class DeviceConfig:
  GUID = ""
  Name = ""
  ConnectionString = ""
  LocationId = ""
  SleepInSeconds = 10  
  
  Sensors = []
  Alerts = []

  def __init__(self, fileName):
    with open(fileName) as file:
      # The FullLoader parameter handles the conversion from YAML
      # scalar values to Python the dictionary format
      data = yaml.load(file, Loader=yaml.FullLoader)

      self.GUID             = data["device"]["guid"]
      self.Name             = data["device"]["name"]
      self.ConnectionString = data["device"]["connectionString"]
      self.LocationId       = data["device"]["locationId"]
      self.SleepInSeconds   = int(data["device"]["sleepInSeconds"])

      for s in data["device"]["sensors"]:
        self.Sensors.append( Sensor(s["name"], s["valueType"], s["minValue"], s["maxValue"]))

      for a in data["device"]["alerts"]:
        self.Alerts.append( Alert(a["name"], a["sensorName"], a["value"], a["operand"]))

