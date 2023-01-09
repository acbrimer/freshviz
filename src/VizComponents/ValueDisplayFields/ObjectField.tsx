import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";
import { withFieldRecordContext } from "./FieldRecordProvider";

export interface ObjectFieldProps extends CommonFieldProps {
  TypographyProps?: Omit<TypographyProps, "children">;
}

const ObjectField = (props: ObjectFieldProps) => (
  <Typography {...(props.TypographyProps || {})}>
    {props.format
      ? props.format(props.record[props.source])
      : JSON.stringify(props.record[props.source], null, "\t")}
  </Typography>
);

export default withFieldRecordContext(React.memo(ObjectField));
