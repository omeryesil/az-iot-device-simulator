
class Alert:
  Name = ""
  SensorName = ""
  Value = -99999
  Operand = "equal"

  def __init__(self, name, sensorName, value, operand):
    self.Name = name
    self.SensorName = sensorName
    self.Value = value
    self.Operand = operand

  