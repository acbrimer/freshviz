import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";

export interface TextFieldProps extends CommonFieldProps {
  TypographyProps?: Omit<TypographyProps, "children">;
}

const TextField = (props: TextFieldProps) => (
  <Typography {...(props.TypographyProps || {})}>
    {props.format ? props.format(props.value) : props.value}
  </Typography>
);

export default React.memo(TextField);
