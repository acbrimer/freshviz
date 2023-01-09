import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";
import { withFieldRecordContext } from "./FieldRecordProvider";

export interface TextFieldProps extends CommonFieldProps {
  TypographyProps?: Omit<TypographyProps, "children">;
}

const TextField = (props: TextFieldProps) => {
  console.log("text field", props);
  return (
    <Typography {...(props.TypographyProps || {})}>
      {props.format
        ? props.format(props.record[props.source])
        : props.record[props.source]}
    </Typography>
  );
};

export default withFieldRecordContext(React.memo(TextField));
