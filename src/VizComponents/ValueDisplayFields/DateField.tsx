import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";

export interface DateFieldProps extends CommonFieldProps {
  options?: any;
  TypographyProps?: Omit<TypographyProps, "children">;
}

const DEFAULT_DATE_OPTIONS = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const DateField = (props: DateFieldProps) => (
  <Typography {...(props.TypographyProps || {})}>
    {props.format
      ? props.format(props.value)
      : props.value.toLocaleDateString(
          "en-us",
          props.options || DEFAULT_DATE_OPTIONS
        )}
  </Typography>
);

export default React.memo(DateField);
