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

    self.generateValue()


  def generateValue(self):
    if self.ValueType == "bool":
      self.CurrentValue = str(bool(random.getrandbits(1)))
      return self.CurrentValue

    randValue = random.randint(self.MinValue, self.MaxValue)

    if self.ValueType == "int":
      self.CurrentValue = str(randValue)
    elif self.ValueType == "float":
      self.CurrentValue = str(randValue + random.random()) 

    return self.CurrentValue
