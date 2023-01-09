import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { CommonFieldProps } from "./fields";

import { withFieldRecordContext } from "./FieldRecordProvider";

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
      ? props.format(props.record[props.source])
      : props.record[props.source].toLocaleDateString(
          "en-us",
          props.options || DEFAULT_DATE_OPTIONS
        )}
  </Typography>
);

export default withFieldRecordContext(React.memo(DateField));
