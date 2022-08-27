import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";

export interface ObjectFieldProps extends CommonFieldProps {
  TypographyProps?: Omit<TypographyProps, "children">;
}

const ObjectField = (props: ObjectFieldProps) => (
  <Typography {...(props.TypographyProps || {})}>
    {props.format
      ? props.format(props.value)
      : JSON.stringify(props.value, null, "\t")}
  </Typography>
);

export default React.memo(ObjectField);
