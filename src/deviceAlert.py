
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