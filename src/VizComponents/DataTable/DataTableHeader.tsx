import * as React from "react";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface DataTableHeaderProps {
  fields: any[];
}
const DataTableRow = (props: DataTableHeaderProps) => {
  const { fields } = props;
  return (
    <TableRow>
      {fields.map((v: any) => (
        <TableCell sx={{ background: "white" }}>{v}</TableCell>
      ))}
    </TableRow>
  );
};

export default React.memo(DataTableRow);
