import yaml

class DeviceConfig:
  GUID = ""
  Name = ""
  ConnectionString = ""
  LocationId = ""

  def __init__(self, fileName):
    with open(fileName) as file:
      # The FullLoader parameter handles the conversion from YAML
      # scalar values to Python the dictionary format
      data = yaml.load(file, Loader=yaml.FullLoader)

      self.GUID             = data["device"]["guid"]
      self.Name             = data["device"]["name"]
      self.ConnectionString = data["device"]["connectionString"]
      self.LocationId       = data["device"]["locationId"]
