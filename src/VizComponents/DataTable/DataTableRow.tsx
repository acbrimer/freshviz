import * as React from "react";

import TableCell from "@mui/material/TableCell";

interface DataTableRowProps {
  record: any;
  ix: number;
}
const DataTableRow = (props: DataTableRowProps) => {
  const { record } = props;
  return (
    <>
      {Object.values(record).map((v: any) => (
        <TableCell>{v}</TableCell>
      ))}
    </>
  );
};

export default React.memo(DataTableRow);
