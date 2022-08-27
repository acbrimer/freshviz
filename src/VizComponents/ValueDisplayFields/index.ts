import TextField from "./TextField";
import DateField from "./DateField";
import NumberField from "./NumberField";
import IntegerField from "./IntegerField";
import BooleanField from "./BooleanField";
import ObjectField from "./ObjectField";

const fields = {
  string: TextField,
  date: DateField,
  integer: IntegerField,
  number: NumberField,
  boolean: BooleanField,
  object: ObjectField,
  array: ObjectField,
};

export default fields;
