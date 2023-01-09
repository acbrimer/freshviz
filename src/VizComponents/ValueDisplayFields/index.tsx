import * as React from "react";
import TextField from "./TextField";
import DateField from "./DateField";
import NumberField from "./NumberField";
import IntegerField from "./IntegerField";
import BooleanField from "./BooleanField";
import ObjectField from "./ObjectField";

export const defaultFields = {
  string: <TextField />,
  date: <DateField />,
  integer: <IntegerField />,
  number: <NumberField />,
  boolean: <BooleanField />,
  object: <ObjectField />,
  array: <ObjectField />,
};

export {
  TextField,
  DateField,
  NumberField,
  IntegerField,
  BooleanField,
  ObjectField,
};
