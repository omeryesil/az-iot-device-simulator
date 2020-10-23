import random

class Sensor:
  Name = ""
  ValueType = ""
  MinValue = -9999
  MaxValue = -9999

  CurrentValue = "-9999"

  def __init__(self, name, valueType, minValue, maxValue):
    self.Name = name
    self.ValueType = valueType
    self.MinValue = minValue
    self.MaxValue = maxValue


  def generateValue(self):
    randValue = random.randint(self.MinValue, self.MaxValue)

    if self.ValueType == "int":
      self.CurrentValue = str(randValue)
    elif self.ValueType == "float":
      self.CurrentValue = str(randValue + random.random()) 
    elif self.ValueType == "bool":
      if randValue % 2 == 0:
        self.CurrentValue = "true"
      else:
        self.CurrentValue = "false"

    return self.CurrentValue
