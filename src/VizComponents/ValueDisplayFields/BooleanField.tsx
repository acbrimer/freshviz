import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export interface BooleanFieldProps extends Omit<CommonFieldProps, "format"> {
  TypographyProps?: Omit<TypographyProps, "children">;
  trueComponent?: JSX.Element;
  falseComponent?: JSX.Element;
}

const BooleanField = (props: BooleanFieldProps) => (
  <Typography {...(props.TypographyProps || {})}>
    {props.value
      ? props.trueComponent || <CheckIcon color="success" fontSize="inherit" />
      : props.falseComponent || (
          <CloseIcon color="disabled" fontSize="inherit" />
        )}
  </Typography>
);

export default React.memo(BooleanField);
