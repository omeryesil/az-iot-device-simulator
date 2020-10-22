import yaml

class Alert:
  Name = ""
  Attribute = ""
  Value = -99999
  Operand = "equal"

  def __init__(self, name, attribute, value, operand):
    self.Name = name
    self.Attribute = attribute
    self.Value = value
    self.Operand = operand


class DeviceConfig:
  GUID = ""
  Name = ""
  ConnectionString = ""
  LocationId = ""
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

      for a in data["device"]["alerts"]:
        self.Alerts.append( Alert(a["name"], a["attribute"], a["value"], a["operand"]))

