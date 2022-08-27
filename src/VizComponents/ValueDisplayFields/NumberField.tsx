import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";

export interface IntegerFieldProps extends CommonFieldProps {
  valueType?: "measure" | "dimension";
  options?: any;
  TypographyProps?: Omit<TypographyProps, "children">;
}

const DEFAULT_INT_OPTIONS = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const IntegerField = (props: IntegerFieldProps) => (
  <Typography variant="body2" {...(props.TypographyProps || {})}>
    {props.format
      ? props.format(props.value)
      : props.value.toLocaleString("en-us", {
          ...(props.options || DEFAULT_INT_OPTIONS,
          { useGrouping: props.valueType === "measure" }),
        })}
  </Typography>
);

export default React.memo(IntegerField);
