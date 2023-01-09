import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";
import { withFieldRecordContext } from "./FieldRecordProvider";

export interface IntegerFieldProps extends CommonFieldProps {
  valueType?: "measure" | "dimension";
  options?: any;
  TypographyProps?: Omit<TypographyProps, "children">;
}

const DEFAULT_INT_OPTIONS = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const IntegerField = (props: IntegerFieldProps) => {
  return (
    <Typography variant="body2" {...(props.TypographyProps || {})}>
      {props.format
        ? props.format(props.record[props.source])
        : props.record[props.source].toLocaleString("en-us", {
            ...(props.options || DEFAULT_INT_OPTIONS),
            useGrouping: props.valueType === "measure",
          })}
    </Typography>
  );
};

export default withFieldRecordContext(React.memo(IntegerField));
